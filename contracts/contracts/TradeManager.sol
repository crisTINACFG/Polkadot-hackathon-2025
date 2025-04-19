// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Card.sol";

contract TradeManager {
    Card public cardNFT;

    constructor(address _cardNFT) {
        cardNFT = Card(_cardNFT);
    }

    struct Trade {
        address from;
        uint offeredTokenId;
        uint requestedTokenId;
        bool active;
    }

    Trade[] public trades;

    event TradeProposed(uint indexed tradeId, address indexed from, uint offeredTokenId, uint requestedTokenId);
    event TradeAccepted(uint indexed tradeId, address indexed to);

    function createTrade(uint offeredTokenId, uint requestedTokenId) external {
        require(cardNFT.ownerOf(offeredTokenId) == msg.sender, "You don't own the card");

        // Transfer offered NFT to contract for escrow
        cardNFT.transferFrom(msg.sender, address(this), offeredTokenId);

        trades.push(Trade({
            from: msg.sender,
            offeredTokenId: offeredTokenId,
            requestedTokenId: requestedTokenId,
            active: true
        }));

        emit TradeProposed(trades.length - 1, msg.sender, offeredTokenId, requestedTokenId);
    }

    function acceptTrade(uint tradeId) external {
        Trade storage trade = trades[tradeId];
        require(trade.active, "Trade not active");
        require(cardNFT.ownerOf(trade.requestedTokenId) == msg.sender, "You don't own the requested card");

        // Transfer requested card to trade proposer
        cardNFT.transferFrom(msg.sender, trade.from, trade.requestedTokenId);

        // Transfer offered card to the one accepting the trade
        cardNFT.transferFrom(address(this), msg.sender, trade.offeredTokenId);

        trade.active = false;
        emit TradeAccepted(tradeId, msg.sender);
    }

    function getTrade(uint tradeId) external view returns (
        address from,
        uint offeredTokenId,
        uint requestedTokenId,
        bool active
    ) {
        Trade storage trade = trades[tradeId];
        return (
            trade.from,
            trade.offeredTokenId,
            trade.requestedTokenId,
            trade.active
        );
    }

    function totalTrades() external view returns (uint) {
        return trades.length;
    }
}
