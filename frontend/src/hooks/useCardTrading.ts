import { useCallback, useState } from "react";
import { Contract, ContractTransactionResponse, BrowserProvider } from "ethers";
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
        if (window.ethereum) {
            setStatus(Status.Loading);
            try {
                // Force MetaMask to show accounts selection
                await window.ethereum.request({ 
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                
                // Get latest accounts
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (accounts.length === 0) {
                    throw new Error('No accounts found');
                }
                
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                console.log("Creating listing with offer:", offerCardId, "request:", requestCardId);
                
                const response: ContractTransactionResponse = await contract.createListing(
                    offerCardId, 
                    requestCardId
                );
                
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
                console.error("Error creating listing:", e);
                setStatus(Status.Revert);
            }
        }
    }, [offerCardId, requestCardId, contractData.abi, contractData.address]);

    const acceptListing = useCallback(async (listingId: number) => {
        if (window.ethereum) {
            setStatus(Status.Loading);
            try {
                // Force MetaMask to show accounts selection
                await window.ethereum.request({ 
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                
                // Get latest accounts
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (accounts.length === 0) {
                    throw new Error('No accounts found');
                }
                
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                console.log("Accepting listing:", listingId);
                
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
                console.error("Error accepting listing:", e);
                setStatus(Status.Revert);
            }
        }
    }, [contractData.abi, contractData.address]);

    const fetchListings = useCallback(async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const allListings = await contract.getAllListings();
                // Convert the listings to proper format
                const formattedListings = allListings
                    .map((listing: any) => ({
                        seller: listing.seller,
                        offerCardId: Number(listing.offerCardId),
                        requestCardId: Number(listing.requestCardId),
                        active: listing.active
                    }))
                    .filter((listing: Listing) => listing.active);
                
                setListings(formattedListings);
            } catch (e) {
                console.error("Error fetching listings:", e);
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