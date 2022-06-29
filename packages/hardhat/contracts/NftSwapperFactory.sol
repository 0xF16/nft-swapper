// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

import "./NftSwapper.sol";

contract NftSwapperFactory {
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

    function clone(
        address _nft1,
        uint256 _nft1Id,
        address _nft2,
        uint256 _nft2Id
    ) public {
        NftSwapper cloned = NftSwapper(nftSwapperContract.clone());
        cloned.create(_nft1, _nft1Id, _nft2, _nft2Id);
        emit OfferCreated(_nft1, _nft1Id, address(cloned)); //event, so easily we can find the offers for both of the NFTs
        emit OfferCreated(_nft2, _nft2Id, address(cloned));
    }
}
