// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");


module.exports = async ({ getNamedAccounts, deployments }) => {
  const MY_BURNER_ADDRESS = "0x3088344bDCF01aF651Fd85D781d3002a4f13Cc5d";
  const MY_BURNER_ADDRESS_2 = "0x4ed46E7812CcA9c199078e16D90eff94114c00e7";
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // await deploy("SampleNft", {
  //   from: deployer,
  //   log: true,
  //   waitConfirmations: 1,
  // });
 
 
  // // NFT deployment
  // await deploy("NftContractTest", {
  //   from: deployer,
  //   args: ["TestNftContract", "TNC"],
  //   log: true,
  //   waitConfirmations: 1,
  // });

  // const NftContractTest = await ethers.getContract("NftContractTest", deployer);
 
  // await NftContractTest.batchMintNfts(MY_BURNER_ADDRESS, 5);
  // await NftContractTest.batchMintNfts(MY_BURNER_ADDRESS_2, 5);
  // await NftContractTest.batchMintNfts(deployer, 100);
  // await NftContractTest.transferOwnership(MY_BURNER_ADDRESS);
  // // NFT deployment
  



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
  const NftSwapperFactory = await ethers.getContract("NftSwapperFactory", deployer);
  await NftSwapperFactory.transferOwnership(
    MY_BURNER_ADDRESS
  );
};

module.exports.tags = ["NftSwapper", "SampleNft"];
