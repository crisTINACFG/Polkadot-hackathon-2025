// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InventoryManager {
    mapping(address => uint[9]) public cardInventory;

    modifier onlyTradingContract() {
        require(msg.sender == tradingContract, "Unauthorized");
        _;
    }

    address public tradingContract;

    constructor() {
        tradingContract = msg.sender;
    }

    function setTradingContract(address _contract) external {
        require(tradingContract == address(0), "Already set");
        tradingContract = _contract;
    }

    function addCard(address to, uint cardId) external {
        require(to != address(0), "Invalid address");
        require(cardId < 9, "Invalid card ID");
        cardInventory[to][cardId] += 1;
    }

    function transferCards(address from, address to, uint cardId, uint amount) external onlyTradingContract {
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
