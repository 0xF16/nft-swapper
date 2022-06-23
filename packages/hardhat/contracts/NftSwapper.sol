// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function ownerOf(uint256 tokenId) external view returns (address);
}

error SwapRejected(); //Error that happens when swap ended up with an error
error OnlyNftOwnersCanExecute(); //Only users who hold specific tokens are permitted to execute this function

contract NftSwapper {
    ERC721 public nft1Contract;
    ERC721 public nft2Contract;

    uint256 public nft1Id;
    uint256 public nft2Id;

    uint256 timeInvalidAt;

    constructor(
        address _nft1,
        uint256 _nft1Id,
        address _nft2,
        uint256 _nft2Id
    ) {
        nft1Contract = ERC721(nft1);
        nft2Contract = ERC721(nft2);

        nft1Id = _nft1Id;
        nft2Id = _nft2Id;
    }

    function swap() public makerOrTaker {
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

        if (
            nft1Contract.ownerOf(nft1Id) != originalOwnerOfNft2 &&
            nft2Contract.ownerOf(nft2Id) != originalOwnerOfNft1
        ) revert SwapRejected();
    }

    modifier makerOrTaker() {
        address originalOwnerOfNft1 = nft1Contract.ownerOf(nft1Id);
        address originalOwnerOfNft2 = nft2Contract.ownerOf(nft2Id);

        if (
            msg.sender != originalOwnerOfNft1 &&
            msg.sender != originalOwnerOfNft2
        ) revert OnlyNftOwnersCanExecute();
        _;
    }
}
