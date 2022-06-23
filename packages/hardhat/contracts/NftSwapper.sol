// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface NFT {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function ownerOf(uint256 tokenId) external view returns (address);
}

contract NftSwapper {
    address public nft1;
    uint256 public nft1Id;

    address public nft2;
    uint256 public nft2Id;

    uint256 timeInvalidAt;

    constructor(
        address _nft1,
        uint256 _nft1Id,
        address _nft2,
        uint256 _nft2Id
    ) {
        nft1 = _nft1;
        nft1Id = _nft1Id;
        nft2 = _nft2;
        nft2Id = _nft2Id;
    }

    function swap() public {
        NFT nft1Contract = NFT(nft1);
        NFT nft2Contract = NFT(nft2);

        address originalOwnerOfNft1 = nft1Contract.ownerOf(nft1Id);
        address originalOwnerOfNft2 = nft2Contract.ownerOf(nft2Id);

        nft1Contract.safeTransferFrom(
            originalOwnerOfNft1,
            originalOwnerOfNft2,
            nft1Id
        );
        nft2Contract.safeTransferFrom(
            originalOwnerOfNft2,
            originalOwnerOfNft1,
            nft2Id
        );

        require(
            nft1Contract.ownerOf(nft1Id) == originalOwnerOfNft2 &&
                nft2Contract.ownerOf(nft2Id) == originalOwnerOfNft1,
            "Swap did not execute correctly"
        );
    }
}
