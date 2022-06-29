// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SampleNft", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });

  const SampleNft = await ethers.getContract("SampleNft", deployer);
  await SampleNft.transferOwnership(
    "0xfbe72a13a4777C2F07AD845FfCCfdFa2e5976b13"
  );

  await deploy("NftSwapper", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });

  const NftSwapper = await ethers.getContract("NftSwapper", deployer);

  await deploy("NftSwapperFactory", {
    from: deployer,
    args: [NftSwapper.address],
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["NftSwapper", "SampleNft"];
