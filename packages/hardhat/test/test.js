const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("NFT Swap", async () => {
  let deployer;
  let addr1;
  let addr2;
  let addrOther;
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Fundamental low-level operations", async () => {
    let nftInstance;
    let nftSwapper;
    let nftSwapperFactory;
    before(async () => {
      [deployer, addr1, addr2] = await ethers.getSigners();

      const nft = await ethers.getContractFactory("SampleNft");
      nftInstance = await nft.deploy();
      await nftInstance.safeMint(addr1.address);
      await nftInstance.safeMint(addr2.address);
    });

    it("Should deploy NftSwapper", async function () {
      const NftSwapper = await ethers.getContractFactory("NftSwapper");

      nftSwapper = await NftSwapper.deploy();
      expect(nftSwapper.address).to.not.be.equal(0);
    });

    it("Should deploy NftSwapper as a clone from NftSwapperFactory", async () => {
      const NftSwapperFactory = await ethers.getContractFactory(
        "NftSwapperFactory"
      );
      nftSwapperFactory = await NftSwapperFactory.deploy(nftSwapper.address);
      await expect(
        nftSwapperFactory.clone(nftInstance.address, 0, nftInstance.address, 1)
      ).to.emit(nftSwapperFactory, "OfferCreated");
    });
  });

  describe("Swaps", async () => {
    let nftInstance;
    let nftSwapperFactory;
    let nftSwapper;
    let swap;

    beforeEach(async () => {
      const nft = await ethers.getContractFactory("SampleNft");
      nftInstance = await nft.deploy();
      await nftInstance.safeMint(addr1.address);
      await nftInstance.safeMint(addr2.address);

      const NftSwapper = await ethers.getContractFactory("NftSwapper");
      nftSwapper = await NftSwapper.deploy();

      const NftSwapperFactory = await ethers.getContractFactory(
        "NftSwapperFactory"
      );
      nftSwapperFactory = await NftSwapperFactory.deploy(nftSwapper.address);
      const cloned = await nftSwapperFactory.clone(
        nftInstance.address,
        0,
        nftInstance.address,
        1
      );
      const recipt = await cloned.wait();

      if (recipt.events[0].event === "OfferCreated") {
        swap = await ethers.getContractAt(
          "NftSwapper",
          recipt.events[0].args.pair
        );
      }
      await nftInstance.connect(addr1).approve(swap.address, 0);
      await nftInstance.connect(addr2).approve(swap.address, 1);
    });

    it("Cannot swap if not the owner of one of the NFTs", async () => {
      await expect(swap.connect(addrOther).swap()).to.be.reverted;
    });

    it("Swap tokens by first owner", async () => {
      await swap.connect(addr1).swap();
      expect([
        await nftInstance.ownerOf(0),
        await nftInstance.ownerOf(1),
      ]).to.deep.equal([addr2.address, addr1.address]);
    });

    it("Swap tokens by second owner", async () => {
      await swap.connect(addr2).swap();
      expect([
        await nftInstance.ownerOf(0),
        await nftInstance.ownerOf(1),
      ]).to.deep.equal([addr2.address, addr1.address]);
    });
  });
});
