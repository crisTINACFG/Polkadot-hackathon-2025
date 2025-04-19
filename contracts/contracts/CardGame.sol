// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.8.2 <0.9.0;




import "./CardInventory.sol";


contract CardGame {
    CardInventory public inventory;
    uint public totalCardTypes = 5;
    mapping(address => CardInventory) players;


    event CardWon(address indexed user, uint cardId);

    function createInventory() public {
        players[msg.sender] = CardInventory(msg.sender);
    }



    function spinWheel() external {
        uint random = uint(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao))
        ) % totalCardTypes;


        players[msg.sender].giveCard(msg.sender, random);
        emit CardWon(msg.sender, random);
    }
}
