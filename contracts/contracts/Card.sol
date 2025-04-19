// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Card {
    string public name = "CardGameCard";
    string public symbol = "CGC";

    uint public nextTokenId;
    mapping(uint => address) public ownerOf;
    mapping(address => uint) public balanceOf;
    mapping(uint => uint) public cardTypes;
    mapping(uint => address) public tokenApprovals;

    event Transfer(address indexed from, address indexed to, uint indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint indexed tokenId);

    address public gameMaster;

    constructor(address _gameMaster) {
        gameMaster = _gameMaster;
    }

    modifier onlyGame() {
        require(msg.sender == gameMaster, "Not authorized");
        _;
    }

    function mintCard(address to, uint cardType) external onlyGame returns (uint) {
        uint tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        cardTypes[tokenId] = cardType;
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function approve(address to, uint tokenId) external {
        require(msg.sender == ownerOf[tokenId], "Not owner");
        tokenApprovals[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function getApproved(uint tokenId) public view returns (address) {
        return tokenApprovals[tokenId];
    }

    function transferFrom(address from, address to, uint tokenId) public {
        require(msg.sender == from || msg.sender == getApproved(tokenId), "Not allowed");
        require(ownerOf[tokenId] == from, "Invalid owner");

        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        delete tokenApprovals[tokenId];

        emit Transfer(from, to, tokenId);
    }

    function tokensOfOwner(address user) external view returns (uint[] memory) {
        uint balance = balanceOf[user];
        uint[] memory tokens = new uint[](balance);
        uint count = 0;

        for (uint i = 0; i < nextTokenId; i++) {
            if (ownerOf[i] == user) {
                tokens[count++] = i;
                if (count == balance) break;
            }
        }

        return tokens;
    }
}
