// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInventoryManager {
    function transferCards(address from, address to, uint cardId, uint amount) external;
    function hasCard(address user, uint cardId, uint amount) external view returns (bool);
    function setTradingContract(address _contract) external;
}

contract CardTrading {
    struct Listing {
        address seller;
        uint8 offerCardId;
        uint8 requestCardId;
        bool active;
    }

    Listing[] public listings;
    IInventoryManager public inventory;
    address public owner;

    constructor(address inventoryAddress) {
        inventory = IInventoryManager(inventoryAddress);
        owner = msg.sender;
        // Try to set this contract as the trading contract in InventoryManager
        try inventory.setTradingContract(address(this)) {
            // Successfully set this contract as the trading contract
        } catch {
            // The trading contract might already be set, that's okay
        }
    }

    function createListing(uint8 offerCardId, uint8 requestCardId) external {
        require(offerCardId < 17 && requestCardId < 17, "Invalid ID");
        require(inventory.hasCard(msg.sender, offerCardId, 1), "No card");

        listings.push(Listing({
            seller: msg.sender,
            offerCardId: offerCardId,
            requestCardId: requestCardId,
            active: true
        }));
    }

    function acceptListing(uint listingId) external {
        require(listingId < listings.length, "Invalid ID");
        Listing storage listing = listings[listingId];
        require(listing.active, "Inactive");
        require(msg.sender != listing.seller, "Own listing");
        require(inventory.hasCard(msg.sender, listing.requestCardId, 1), "No card");

        // Swap cards
        inventory.transferCards(msg.sender, listing.seller, listing.requestCardId, 1);
        inventory.transferCards(listing.seller, msg.sender, listing.offerCardId, 1);

        listing.active = false;
    }

    function getAllListings() external view returns (Listing[] memory) {
        return listings;
    }
}
