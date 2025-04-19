// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Card.sol";

contract CardInventory {
    Card public cardNFT;
    address public gameMaster;

    constructor(address _cardNFT) {
        cardNFT = Card(_cardNFT);
        gameMaster = msg.sender;
    }

    modifier onlyGameMaster() {
        require(msg.sender == gameMaster, "Not authorized");
        _;
    }

    function giveCard(address to, uint cardType) external onlyGameMaster returns (uint) {
        return cardNFT.mintCard(to, cardType);
    }

    function getUserCards(address user) external view returns (uint[] memory) {
        return cardNFT.tokensOfOwner(user);
    }

    function getCardType(uint tokenId) external view returns (uint) {
        return cardNFT.cardTypes(tokenId);
    }

    function getCardOwner(uint tokenId) external view returns (address) {
        return cardNFT.ownerOf(tokenId);
    }
}
