// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NftSwapper.sol";

contract NftSwapperFactory {
    address public currentNftSwapperContract;

    function create(
        address _nft1,
        uint256 _nft1Id,
        address _nft2,
        uint256 _nft2Id
    ) public {
        currentNftSwapperContract = address(
            new NftSwapper(_nft1, _nft1Id, _nft2, _nft2Id)
        );
    }
}
