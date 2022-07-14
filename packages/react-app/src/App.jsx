import { 
  Button, 
  Col, 
  Menu, 
  Row, 
  List, 
  Card, 
  Avatar, 
  Checkbox, 
  Typography,
  Space,
  Select,
} from "antd";
import "antd/dist/antd.css";
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';

import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";

import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
  Address,
  AddressInput,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
import axios from "axios";
import { useEventListener } from "eth-hooks/events/useEventListener";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";
import { create } from "ipfs-http-client";

const { ethers } = require("ethers");
const { BufferList } = require("bl");
const { Title } = Typography;
const { Option } = Select;
const ipfs = create({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = true; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;
const NFT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';


const SWAPPER_ABI = [
    "function swap()",
    "function nft1Id() view returns (uint256)",
    "function nft2Id() view returns (uint256)",
    "function nft1Contract() view returns (address)",
    "function nft2Contract() view returns (address)",
    "function swapSucceeded() view returns (bool)",
    "function swapCancelled() view returns (bool)",
    "function cancelSwap()"
];

const ERC721_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [onlyMyNfts, setOnlyMyNfts] = useState(false);
  const [ownedNftForSwap, setOwnedNftForSwap] = useState();
  const [selectedNftForSwap, setSelectedNftForSwap] = useState();
  const [minting, setMinting] = useState(false);
  const [offers, setOffers] = useState([]);
  const [sourceNftCollection, setSourceNftCollection] = useState(NFT_ADDRESS);
  const [targetNftCollection, setTargetNftCollection] = useState(NFT_ADDRESS);
  const [count, setCount] = useState(1);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  const offerEvents = useEventListener(readContracts, "NftSwapperFactory", "OfferCreated", localProvider, 1);

  const json = {
    1: {
      description: "It's actually a bison?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/buffalo.jpg",
      name: "Buffalo",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "green",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 42,
        },
      ],
    },
    2: {
      description: "What is it so worried about?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/zebra.jpg",
      name: "Zebra",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "blue",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 38,
        },
      ],
    },
    3: {
      description: "What a horn!",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/rhino.jpg",
      name: "Rhino",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "pink",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 22,
        },
      ],
    },
    4: {
      description: "Is that an underbyte?",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/fish.jpg",
      name: "Fish",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "blue",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 15,
        },
      ],
    },
    5: {
      description: "So delicate.",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/flamingo.jpg",
      name: "Flamingo",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "black",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 6,
        },
      ],
    },
    6: {
      description: "Raaaar!",
      external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
      image: "https://austingriffith.com/images/paintings/godzilla.jpg",
      name: "Godzilla",
      attributes: [
        {
          trait_type: "BackgroundColor",
          value: "orange",
        },
        {
          trait_type: "Eyes",
          value: "googly",
        },
        {
          trait_type: "Stamina",
          value: 99,
        },
      ],
    },
  };

  const mintItem = async () => {
    // upload to ipfs
    const uploaded = await ipfs.add(JSON.stringify(json[count]));
    setCount(count + 1);
    console.log("Uploaded Hash: ", uploaded);
    const result = tx(
      writeContracts &&
        writeContracts.SampleNft &&
        writeContracts.SampleNft.mintItem(address, uploaded.path),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );
        }
      },
    );
  };


  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const currentNftSwapper = useContractReader(readContracts, "NftSwapperFactory", "currentNftSwapperContract");
  if(currentNftSwapper && deployedContracts[31337].localhost.contracts.NftSwapper !== undefined) deployedContracts[31337].localhost.contracts.NftSwapper.address = currentNftSwapper;
  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
    myMainnetDAIBalance,
  ]);


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);
// 
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [allCollectibles, setAllCollectibles] = useState([]);
  const [myCollectibles, setMyCollectibles] = useState([]);
  const allNfts = useContractReader(readContracts, "SampleNft", "totalSupply");
  useEffect(() => {
    const getAllNfts = async () => {
      const allNftsArr = [];
      for (let tokenIndex = 0; tokenIndex < parseInt(allNfts); tokenIndex++) {
        try {
          const tokenId = await readContracts.SampleNft.tokenByIndex(tokenIndex);
          const owner = await readContracts.SampleNft.ownerOf(tokenId);
          const tokenURI = await readContracts.SampleNft.tokenURI(tokenId);
        
          try {
            const { data } = await axios.get(tokenURI);
            allNftsArr.push({ id: tokenId, uri: tokenURI, owner, ...data });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log('[AK] failed at index ' + tokenIndex + ' ' + e);
        }
      }
      setAllCollectibles(allNftsArr);
      setMyCollectibles(allNftsArr.filter(nft => nft.owner === address))
    }
    getAllNfts();
  }, [allNfts]);

  useEffect(() => {
    const filterOffers = async () => {
      const myOffers =  offerEvents.filter((item) => {
        const myCollectiblesIds = myCollectibles.map((nft) => nft.id.toNumber());
        return myCollectiblesIds.indexOf(item.args[1].toNumber()) !== -1;
      });
      const filteredOffers =  await (Promise.all(myOffers.map(async (item) => {
        const contractAddress = item.args[2];
        const swapperContract = new ethers.Contract(contractAddress, SWAPPER_ABI, userSigner);
        const swapSucceeded = await swapperContract.swapSucceeded();
        const swapCancelled = await swapperContract.swapCancelled();
        const nft1Address = await swapperContract.nft1Contract();
        const nft2Address = await swapperContract.nft2Contract();
        const nft1Id = await swapperContract.nft1Id();
        const nft2Id = await swapperContract.nft2Id();
        const { blockNumber } = item;
        const nft1Contract  = new ethers.Contract(nft1Address, ERC721_ABI, userSigner);
        const nft2Contract  = new ethers.Contract(nft2Address, ERC721_ABI, userSigner);
        const nft1Approved = await nft1Contract.getApproved(nft1Id) == contractAddress;
        const nft1Owner = await nft1Contract.ownerOf(nft1Id);
        const nft2Approved = await nft2Contract.getApproved(nft2Id) == contractAddress;
        const nft2Owner = await nft2Contract.ownerOf(nft2Id);

        let offerItem = {
          yourNft: {
            address: nft1Owner === address ? nft1Address : nft2Address,
            id: nft1Owner === address ? nft1Id : nft2Id,
            owner: nft1Owner,
            approved: nft1Owner === address ? nft1Approved : nft2Approved,
          },
          otherNft: {
            address: nft1Owner === address ? nft2Address : nft1Address,
            id: nft1Owner === address ? nft2Id : nft1Id,
            owner: nft2Owner,
            approved: nft1Owner === address ? nft2Approved : nft1Approved
          },
          swapSucceeded,
          blockNumber,
          id: item.args[1].toNumber(),
          contractAddress,
        }
        const include = !swapSucceeded && !swapCancelled;
        console.log(offerItem);
        return {
          value: offerItem,
          include,
        } 
      })))
      setOffers(filteredOffers.filter(v => v.include).map(data => data.value));
    }
    filterOffers();
  }, [offerEvents, myCollectibles])

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header>
        {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1 }}>
            {USE_NETWORK_SELECTOR && (
              <div style={{ marginRight: 20 }}>
                <NetworkSwitch
                  networkOptions={networkOptions}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              </div>
            )}
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div>
        </div>
      </Header>
      {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )}
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <Menu style={{ textAlign: "center", marginTop: 20 }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">App Home</Link>
        </Menu.Item>
        {/* <Menu.Item key="/ui">
          <Link to="/ui">UI</Link>
        </Menu.Item> */}
        <Menu.Item key="/nfts">
          <Link to="/nfts">NFT collection</Link>
        </Menu.Item>
        <Menu.Item key="/nft-swapper">
          <Link to="/nft-swapper">NFT Swapper</Link>
        </Menu.Item>
        <Menu.Item key="/nft">
          <Link to="/nft">Sample NFT Contract</Link>
        </Menu.Item>
        <Menu.Item key="/swapperfactory">
          <Link to="/swapperfactory">NFT Swapper Factory Contract</Link>
        </Menu.Item>
        <Menu.Item key="/swapper">
          <Link to="/swapper">NFT Swapper Contract</Link>
        </Menu.Item>
        {/* <Menu.Item key="/hints">
          <Link to="/hints">Hints</Link>
        </Menu.Item> */}
        {/* <Menu.Item key="/subgraph">
          <Link to="/subgraph">Subgraph</Link>
        </Menu.Item> */}
      </Menu>

      <Switch>
        <Route exact path="/">
          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          <Home yourLocalBalance={yourLocalBalance} readContracts={readContracts} />
        </Route>
        <Route path="/ui">
          {/* <ExampleUI
            address={address}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            yourLocalBalance={yourLocalBalance}
            price={price}
            tx={tx}
            writeContracts={writeContracts}
            readContracts={readContracts}
            purpose={purpose}
          /> */}
        </Route>
        <Route path="/nfts">
          <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <Button
                disabled={minting}
                size="large"
                onClick={() => {
                  mintItem();
                }}
                
              >
                MINT NFT
              </Button>
              <Button
                size="large"
                type={onlyMyNfts ? "primary" : "default"}
                onClick={() => {
                  setOnlyMyNfts(!onlyMyNfts);
                }}
              >
                Show only my NFTs
              </Button>
            </div>
            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={onlyMyNfts ? myCollectibles : allCollectibles}
                renderItem={item => {
                  const id = item.id.toNumber();
                  return (
                    <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                          </div>
                        }
                      >
                        <div>
                          <img src={item.image} style={{ maxWidth: 150 }} />
                        </div>
                        <div>{item.description}</div>
                      </Card>

                      <div>
                        owner:{" "}
                        <Address
                          address={item.owner}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <AddressInput
                          ensProvider={mainnetProvider}
                          placeholder="transfer to address"
                          value={transferToAddresses[id]}
                          onChange={newValue => {
                            const update = {};
                            update[id] = newValue;
                            setTransferToAddresses({ ...transferToAddresses, ...update });
                          }}
                        />
                        <Button
                          onClick={() => {
                            console.log("writeContracts", writeContracts);
                            tx(writeContracts.SampleNft.transferFrom(address, transferToAddresses[id], id));
                          }}
                        >
                          Transfer
                        </Button>

                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
        </Route>
        <Route path="/nft-swapper">
          <div style={{ marginTop: 32, paddingBottom: 32, paddingRight: 32, paddingLeft: 32 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Title level={4}>Your NFTs</Title>
                <Space>
                  <Title level={5}>Select collection</Title>
                  <Select 
                    defaultValue={sourceNftCollection} 
                    style={{ width: 220 }}
                    onChange={(value) => setSourceNftCollection(value)}
                  >
                    <Option value="">---Select collection---</Option>
                    <Option value={NFT_ADDRESS}>Testowe NFT</Option>
                  </Select>
                </Space>
                <List
                  bordered
                  size="large"
                  dataSource={myCollectibles}
                  renderItem={item => {
                    const id = item.id.toNumber();
                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Checkbox 
                          style={{marginRight: 20}}
                          disabled={ownedNftForSwap && ownedNftForSwap !== id}
                          onChange={(event) => {
                            const { checked } = event.target;
                            checked ? setOwnedNftForSwap(id) : setOwnedNftForSwap(null);
                          }}
                          >
                        </Checkbox>
                        <List.Item.Meta
                          avatar={<Avatar shape="square" src={item.image} />}
                          title={`# ${item.id.toNumber()}`}
                          />
                        
                      </List.Item>
                    )
                  }}
                  />
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Swap for</Title>
                <Space>
                  <Title level={5}>Select collection</Title>
                  <Select 
                    defaultValue={targetNftCollection} 
                    style={{ width: 220 }}
                    onChange={(value) => setTargetNftCollection(value)}
                  >
                    <Option value="">---Select collection---</Option>
                    <Option value={NFT_ADDRESS}>Testowe NFT</Option>
                  </Select>
                </Space>
                <List
                  bordered
                  dataSource={allCollectibles.filter(nft => nft.owner !== address)}
                  renderItem={item => {
                    const id = item.id.toNumber();
                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Checkbox 
                          disabled={selectedNftForSwap && selectedNftForSwap !== id}
                          style={{marginRight: 20}}
                          onChange={(event) => {
                            const { checked } = event.target;
                            checked ? setSelectedNftForSwap(id) : setSelectedNftForSwap(null);
                          }}
                          >
                        </Checkbox>
                        <List.Item.Meta
                          avatar={<Avatar shape="square" src={item.image} />}
                          title={`# ${item.id.toNumber()}`}
                        />
                      </List.Item>
                    )
                  }}
                />
              </Col>
            <div style={{width: 900, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <Button
                onClick={async() => {
                  if (!ownedNftForSwap || !selectedNftForSwap) return;
                  tx(writeContracts.NftSwapperFactory.clone(sourceNftCollection, ownedNftForSwap, targetNftCollection, selectedNftForSwap));
                }}
              >
                Create an offer
              </Button>
            </div>
            </Row>
                <Title level={3}>Offers</Title>
                <List
                  dataSource={offers}
                  itemLayout="horizontal"
                  renderItem={item => {
                    return (
                      <List.Item 
                        key={item.blockNumber}
                        actions={[
                        <Button
                          disabled={item.yourNft.approved}
                          onClick={() => {
                            tx(writeContracts.SampleNft.approve(item.contractAddress, item.id));
                          }}
                          >
                          {item.yourNft.approved ? (<Space><CheckCircleTwoTone twoToneColor="#52c41a" /> Approved</Space>)  : "Approve"}
                        </Button>, 
                        <Button
                          type="primary"
                          disabled={!item.yourNft.approved || !item.otherNft.approved}
                          onClick={async () => {
                            try {
                              const contract = new ethers.Contract(item.contractAddress, SWAPPER_ABI, userSigner)
                              tx(contract.swap());
                            }catch(e) {
                              console.error(e);  
                            }
                          }}
                        >
                          Swap
                        </Button>, 
                        <Button
                          type="danger"
                          onClick={async () => {
                            try {
                              const contract = new ethers.Contract(item.contractAddress, SWAPPER_ABI, userSigner)
                              tx(contract.cancelSwap());
                            }catch(e) {
                              console.error(e);  
                            }
                          }}
                        >
                          <Space><CloseCircleOutlined/> Reject</Space>
                        </Button>
                      ]}
                      >
                        <List.Item.Meta
                          title={`Offer to exchange your NFT: ${item.yourNft.id} for NFT: ${item.otherNft.id}`}
                          description={!item.otherNft.approved ? "Awaiting approval from your exchange partner" : "Your exchange partner has approved the transaction"}
                        />
                      </List.Item>
                    );
                  }}
                />
          
          </div>
        </Route>
        <Route path="/nft">
          <Contract
            name="SampleNft"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route exact path="/swapperfactory">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}
          <Contract
            name="NftSwapperFactory"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route exact path="/swapper">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}
          <Contract
            name="NftSwapper"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
            // contractCustomAddress={currentNftSwapper}
          />
        </Route>
        <Route path="/hints">
          <Hints
            address={address}
            yourLocalBalance={yourLocalBalance}
            mainnetProvider={mainnetProvider}
            price={price}
          />
        </Route>
        <Route path="/subgraph">
          <Subgraph
            subgraphUri={props.subgraphUri}
            tx={tx}
            writeContracts={writeContracts}
            mainnetProvider={mainnetProvider}
          />
        </Route>
      </Switch>

      <ThemeSwitch />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
