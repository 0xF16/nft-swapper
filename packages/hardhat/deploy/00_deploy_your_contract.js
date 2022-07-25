// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");


const hashes = {
  0: 'QmfVMAmNM1kDEBYrC2TPzQDoCRFH6F5tE1e9Mr4FkkR5Xr',
  1: 'QmVHi3c4qkZcH3cJynzDXRm5n7dzc9R9TUtUcfnWQvhdcw',
  2: 'QmfVMAmNM1kDEBYrC2TPzQDoCRFH6F5tE1e9Mr4FkkR5Xr',
  3: 'QmVHi3c4qkZcH3cJynzDXRm5n7dzc9R9TUtUcfnWQvhdcw',
  4: 'QmcvcUaKf6JyCXhLD1by6hJXNruPQGs3kkLg2W1xr7nF1j',
  5: 'QmZUaKqR7Sd2iJHABbRmAN94nKqEjjj9GdM1LR66UDKUhe'
}


module.exports = async ({ getNamedAccounts, deployments }) => {
  const MY_BURNER_ADDRESS = "0x48F906e0e1dee59966c85E1Ee6D4B69950Cb4166";
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SampleNft", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });
  await deploy("NftContractTest", {
    from: deployer,
    args: ["TestNftContract", "TNC"],
    log: true,
    waitConfirmations: 1,
  });
  const NftContractTest = await ethers.getContract("NftContractTest", deployer);
  await NftContractTest.batchAddToWhitelist([MY_BURNER_ADDRESS, "0x97E36dafdcDE50C6322a7BbC9205500FF182E46F"], [10,10]);
  await NftContractTest.transferOwnership(MY_BURNER_ADDRESS);


  const SampleNft = await ethers.getContract("SampleNft", deployer);
  await SampleNft.transferOwnership(
    MY_BURNER_ADDRESS
  );
  // await SampleNft.mintItem(MY_BURNER_ADDRESS, hashes[1]);
  // for (let i = 1; i < 100; i++) {
  //   const nftId = i % 6;
  //   await SampleNft.mintItem(MY_BURNER_ADDRESS, hashes[nftId]);
  // }

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
