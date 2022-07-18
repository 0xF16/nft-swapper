// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NftSwapper.sol";

contract NftSwapperFactory is Ownable {
    address public immutable nftSwapperContract;

    using Clones for address;

    event OfferCreated(
        address indexed nftCollection,
        uint256 indexed nftId,
        address pair
    );

    constructor(address _nftSwapperImplementation) {
        nftSwapperContract = _nftSwapperImplementation;
    }

    function withdrawFees() public onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Something went wrong with fee withdrawal");
    }

    receive() external payable {}

    function clone(
        address _nft1,
        uint256 _nft1Id,
        address _nft2,
        uint256 _nft2Id
    ) public payable {
        require(msg.value >= 0.01 ether, "You have to send at least 0.01 Ether to execute this transaction");
        NftSwapper cloned = NftSwapper(nftSwapperContract.clone());
        cloned.create(_nft1, _nft1Id, _nft2, _nft2Id, address(this));
        emit OfferCreated(_nft1, _nft1Id, address(cloned)); //event, so easily we can find the offers for both of the NFTs
        emit OfferCreated(_nft2, _nft2Id, address(cloned));
    }
}
