import { useCallback, useState } from "react";
import { Contract, ContractTransactionResponse } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

export enum Status { Initial, Loading, Success, Revert };

interface Listing {
    seller: string;
    offerCardId: number;
    requestCardId: number;
    active: boolean;
}

export function useCardTrading(contractData: ContractData) {
    const [status, setStatus] = useState(Status.Initial);
    const [listings, setListings] = useState<Listing[]>([]);
    const [offerCardId, setOfferCardId] = useState(0);
    const [requestCardId, setRequestCardId] = useState(0);

    const createListing = useCallback(async () => {
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            setStatus(Status.Loading);
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const response: ContractTransactionResponse = await contract.createListing(offerCardId, requestCardId);
                console.log("Transaction response", response);

                const receipt = await response.wait();
                console.log("Transaction receipt", receipt);

                if (receipt === null) {
                    setStatus(Status.Revert);
                    return;
                }

                setStatus(Status.Success);
                // Refresh listings after successful creation
                await fetchListings();
            } catch (e) {
                console.error(e);
                setStatus(Status.Revert);
            }
        }
    }, [offerCardId, requestCardId, contractData.abi, contractData.address]);

    const acceptListing = useCallback(async (listingId: number) => {
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            setStatus(Status.Loading);
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const response: ContractTransactionResponse = await contract.acceptListing(listingId);
                console.log("Transaction response", response);

                const receipt = await response.wait();
                console.log("Transaction receipt", receipt);

                if (receipt === null) {
                    setStatus(Status.Revert);
                    return;
                }

                setStatus(Status.Success);
                // Refresh listings after successful acceptance
                await fetchListings();
            } catch (e) {
                console.error(e);
                setStatus(Status.Revert);
            }
        }
    }, [contractData.abi, contractData.address]);

    const fetchListings = useCallback(async () => {
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const allListings = await contract.getAllListings();
                // Convert the listings to proper format
                const formattedListings = allListings.map((listing: any) => ({
                    seller: listing.seller,
                    offerCardId: Number(listing.offerCardId),
                    requestCardId: Number(listing.requestCardId),
                    active: listing.active
                }));
                setListings(formattedListings);
            } catch (e) {
                console.error(e);
            }
        }
    }, [contractData.abi, contractData.address]);

    return {
        status,
        listings,
        setOfferCardId,
        setRequestCardId,
        createListing,
        acceptListing,
        fetchListings
    };
} 