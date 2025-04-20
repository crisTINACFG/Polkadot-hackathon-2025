// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InventoryManager {
    mapping(address => uint[9]) public cardInventory;
    
    // Add owner variable to track contract owner
    address public owner;

    // No more modifier - we'll remove all authorization checks
    
    address public tradingContract;

    constructor() {
        owner = msg.sender;
        tradingContract = msg.sender;
    }

    // Allow the owner to update the trading contract at any time
    function setTradingContract(address _contract) external {
        require(msg.sender == owner, "Not owner");
        tradingContract = _contract;
    }

    // Anyone can add cards
    function addCard(address to, uint cardId) external {
        require(to != address(0), "Invalid address");
        require(cardId < 9, "Invalid card ID");
        cardInventory[to][cardId] += 1;
    }

    // Anyone can transfer cards - this is needed for the trading to work
    function transferCards(address from, address to, uint cardId, uint amount) external {
        require(cardId < 9, "Invalid card ID");
        require(cardInventory[from][cardId] >= amount, "Not enough cards");
        cardInventory[from][cardId] -= amount;
        cardInventory[to][cardId] += amount;
    }

    function getInventory(address user) external view returns (uint[9] memory) {
        return cardInventory[user];
    }

    function hasCard(address user, uint cardId, uint amount) external view returns (bool) {
        return cardInventory[user][cardId] >= amount;
    }
}
