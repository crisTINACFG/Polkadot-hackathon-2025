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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Define fetchListings first to avoid reference before definition
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

    const createListing = useCallback(async () => {
        if (window.ethereum) {
            setStatus(Status.Loading);
            setErrorMessage(null);
            try {
                console.log("Starting to create listing...");
                
                // Get latest accounts without forcing a selection
                const accounts = await window.ethereum.request({ 
                    method: 'eth_accounts' 
                });
                
                if (accounts.length === 0) {
                    console.log("No accounts found, requesting permissions...");
                    // Only force selection if we don't have accounts
                    await window.ethereum.request({ 
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }]
                    });
                    
                    // Try again after permission request
                    const updatedAccounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    
                    if (updatedAccounts.length === 0) {
                        throw new Error('No accounts found after permission request');
                    }
                }
                
                console.log("Initializing provider and signer...");
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const signerAddress = await signer.getAddress();
                console.log("Signer address:", signerAddress);
                
                // Check if we have the card before trying to create a listing
                console.log("Creating contract instance...");
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                console.log("Creating listing with offer:", offerCardId, "request:", requestCardId);
                
                // Log gas estimate to check if transaction would succeed
                try {
                    console.log("Estimating gas...");
                    const gasEstimate = await contract.createListing.estimateGas(
                        offerCardId, 
                        requestCardId
                    );
                    console.log("Gas estimate successful:", gasEstimate.toString());
                } catch (estimateError: any) {
                    console.error("Gas estimation failed:", estimateError);
                    // Don't throw, just log - we'll try the transaction anyway
                    if (estimateError.message && estimateError.message.includes("You don't have the offered card")) {
                        setErrorMessage("You don't have the offered card");
                        setStatus(Status.Revert);
                        return;
                    }
                }
                
                // Send the transaction
                console.log("Sending transaction...");
                const response: ContractTransactionResponse = await contract.createListing(
                    offerCardId, 
                    requestCardId
                );
                
                console.log("Transaction sent with hash:", response.hash);

                console.log("Waiting for transaction confirmation...");
                const receipt = await response.wait();
                console.log("Transaction receipt:", receipt);

                if (receipt === null) {
                    setErrorMessage("Transaction failed - no receipt received");
                    setStatus(Status.Revert);
                    return;
                }

                console.log("Transaction successful!");
                setStatus(Status.Success);
                // Refresh listings after successful creation
                await fetchListings();
            } catch (e: any) {
                console.error("Error creating listing:", e);
                
                // Extract useful error information
                let error = 'Unknown error';
                if (e.message) {
                    if (e.message.includes('insufficient funds')) {
                        error = 'Not enough ETH for gas';
                    } else if (e.message.includes('user rejected')) {
                        error = 'Transaction rejected by user';
                    } else if (e.message.includes("You don't have the offered card") || 
                               e.message.includes("Invalid card ID") ||
                               e.message.includes("No card")) {
                        error = "You don't have the card you're trying to offer";
                    } else if (e.message.includes('execution reverted')) {
                        error = 'Contract rejected the transaction';
                    } else {
                        error = e.message;
                    }
                }
                
                setErrorMessage(error);
                console.log("Error details:", error);
                setStatus(Status.Revert);
            }
        }
    }, [offerCardId, requestCardId, contractData.abi, contractData.address, fetchListings]);

    const acceptListing = useCallback(async (listingId: number) => {
        if (window.ethereum) {
            setStatus(Status.Loading);
            setErrorMessage(null);
            try {
                console.log("Starting to accept listing...");
                
                // Get latest accounts without forcing a selection
                const accounts = await window.ethereum.request({ 
                    method: 'eth_accounts' 
                });
                
                if (accounts.length === 0) {
                    console.log("No accounts found, requesting permissions...");
                    // Only force selection if we don't have accounts
                    await window.ethereum.request({ 
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }]
                    });
                    
                    // Try again after permission request
                    const updatedAccounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    
                    if (updatedAccounts.length === 0) {
                        throw new Error('No accounts found after permission request');
                    }
                }
                
                console.log("Initializing provider and signer...");
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const signerAddress = await signer.getAddress();
                console.log("Signer address:", signerAddress);
                
                console.log("Creating contract instance...");
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                console.log("Accepting listing:", listingId);
                
                // Estimate gas to check if transaction would succeed
                try {
                    console.log("Estimating gas...");
                    const gasEstimate = await contract.acceptListing.estimateGas(listingId);
                    console.log("Gas estimate successful:", gasEstimate.toString());
                } catch (estimateError: any) {
                    console.error("Gas estimation failed:", estimateError);
                    // Extract specific error types
                    if (estimateError.message) {
                        if (estimateError.message.includes("You don't have the requested card") || 
                           estimateError.message.includes("No card")) {
                            setErrorMessage("You don't have the requested card");
                        } else if (estimateError.message.includes("Can't accept your own listing") || 
                                  estimateError.message.includes("Own listing")) {
                            setErrorMessage("Cannot accept your own listing");
                        } else if (estimateError.message.includes("Listing inactive") || 
                                  estimateError.message.includes("Inactive")) {
                            setErrorMessage("This listing is no longer active");
                        } else {
                            setErrorMessage("Transaction would fail: " + estimateError.message);
                        }
                        setStatus(Status.Revert);
                        return;
                    }
                }
                
                // Send the transaction
                console.log("Sending transaction...");
                const response: ContractTransactionResponse = await contract.acceptListing(listingId);
                console.log("Transaction sent with hash:", response.hash);

                console.log("Waiting for transaction confirmation...");
                const receipt = await response.wait();
                console.log("Transaction receipt:", receipt);

                if (receipt === null) {
                    setErrorMessage("Transaction failed - no receipt received");
                    setStatus(Status.Revert);
                    return;
                }

                console.log("Transaction successful!");
                setStatus(Status.Success);
                // Refresh listings after successful acceptance
                await fetchListings();
            } catch (e: any) {
                console.error("Error accepting listing:", e);
                
                // Extract useful error information
                let error = 'Unknown error';
                if (e.message) {
                    if (e.message.includes('insufficient funds')) {
                        error = 'Not enough ETH for gas';
                    } else if (e.message.includes('user rejected')) {
                        error = 'Transaction rejected by user';
                    } else if (e.message.includes("You don't have the requested card") || 
                               e.message.includes("No card")) {
                        error = "You don't have the card requested in this listing";
                    } else if (e.message.includes("Can't accept your own listing") || 
                               e.message.includes("Own listing")) {
                        error = "Cannot accept your own listing";
                    } else if (e.message.includes('execution reverted')) {
                        error = 'Contract rejected the transaction';
                    } else {
                        error = e.message;
                    }
                }
                
                setErrorMessage(error);
                console.log("Error details:", error);
                setStatus(Status.Revert);
            }
        }
    }, [contractData.abi, contractData.address, fetchListings]);

    return {
        status,
        listings,
        errorMessage,
        setOfferCardId,
        setRequestCardId,
        createListing,
        acceptListing,
        fetchListings
    };
} 