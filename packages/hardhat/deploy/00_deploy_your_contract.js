// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SampleNft", {
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 1,
  });

  const SampleNft = await ethers.getContract("SampleNft", deployer);
  await SampleNft.safeMint("0xfbe72a13a4777C2F07AD845FfCCfdFa2e5976b13");
  await SampleNft.safeMint("0x987f70d34E0b62E72e0c356D0641063AC39cbD32");

  await deploy("NftSwapper", {
    from: deployer,
    args: [SampleNft.address, 0, SampleNft.address, 1],
    log: true,
    waitConfirmations: 1,
  });

  const NftSwapper = await ethers.getContract("NftSwapper", deployer);
};

module.exports.tags = ["NftSwapper", "SampleNft"];
