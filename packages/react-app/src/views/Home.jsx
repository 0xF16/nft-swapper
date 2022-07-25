import { 
  Button, 
  Col, 
  message,
  Row, 
  List, 
  Avatar, 
  Checkbox, 
  Typography,
  Space,
  Select,
  Input,
  Alert,
} from "antd";

import {

  useContractReader,
} from "eth-hooks";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOnBlock } from "eth-hooks";
import axios from "axios";
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { useEventListener } from "eth-hooks/events/useEventListener";
const { Title } = Typography;
const { Option, OptGroup } = Select;
const { Search } = Input;



// const INITIAL_NFT_COLLECTION = [
//   {
//     address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
//     name: 'Trans powers'
//   },
//   {
//     address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
//     name: 'Collection 100'
//   },

// ];

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
        "name": "",
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
        "name": "",
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
        "name": "",
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
        "name": "_data",
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
        "name": "approved",
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
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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


const SWAPPER_ABI = [
    "function swap() payable",
    "function nft1Id() view returns (uint256)",
    "function nft2Id() view returns (uint256)",
    "function nft1Contract() view returns (address)",
    "function nft2Contract() view returns (address)",
    "function swapSucceeded() view returns (bool)",
    "function swapCancelled() view returns (bool)",
    "function cancelSwap()"
];



const fixUrl = (url) => {
  if (url.startsWith("ipfs")) {
    return "https://ipfs.io/ipfs/" + url.split("ipfs://")[1];
  }
  return url;
}

function Home({ yourLocalBalance, readContracts, address, userSigner, tx, localProvider, writeContracts }) {

  const [ownedNftForSwap, setOwnedNftForSwap] = useState();
  const [selectedNftForSwap, setSelectedNftForSwap] = useState();
  const [selectedNftId, setSelectedNftId] = useState(null);
  const [offers, setOffers] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  // const [availableNftCollections, setAvailableNftCollections] = useState(INITIAL_NFT_COLLECTION);
  const [myCollectiblesFilter, setMyCollectiblesFilter] = useState('');
  // const [otherCollectiblesCount, setOtherCollectiblesCount] = useState(0);
  const [myCollectibles, setMyCollectibles] = useState([]);
  const [myCollectiblesIds, setMyCollectiblesIds] = useState([]);
  const [otherCollectibles, setOtherCollectibles] = useState([]);
  const [otherCollectiblesOptions, setOtherCollectiblesOptions] = useState([]);
  const [offerHistory, setOfferHistory] = useState([]);

  const offerEvents = useEventListener(readContracts, "NftSwapperFactory", "OfferCreated", localProvider, 1);

  const nftTotalSupply = useContractReader(readContracts, "TRANSPARENT_POWER", "totalSupply");
  
  const nftTransferEvents = useEventListener(readContracts, "TRANSPARENT_POWER", "Transfer", localProvider, 1);
  const nftApprovalEvents = useEventListener(readContracts, "TRANSPARENT_POWER", "Approval", localProvider, 1);

  const showResultMessage = (update) => {
    if (update && (update.status === "confirmed" || update.status === 1)) {
      message.success('Transaction confirmed!');
    }
  } 


  const getMyNfts = async () => {
    console.log('[AKgetMyNfts]calling getMyNfts', nftTransferEvents);
    // const receiveFilter = nftContract.filters.Transfer(null, address);
    // const sentFilter = nftContract.filters.Transfer(address, null);
    const myEvents = nftTransferEvents.filter(event => event.args[1] == address || event.args[0] == address);
    
    const myFilteredEvents = {};
    for (let i = 0; i < myEvents.length; i++) {
      const { args } = myEvents[i];

      const fromAddr = args[0];
      const nftId = args[2].toNumber();
      const evtObj = {
        nftId: args[2],
        owned: fromAddr == address ? 0 : 1,
      };
      if (myFilteredEvents.hasOwnProperty(nftId)) {
        fromAddr == address ? myFilteredEvents[nftId].owned -= 1 : myFilteredEvents[nftId].owned += 1;
      } else {
        myFilteredEvents[nftId] = evtObj;
      }
    }
    console.log('[AKgetMyNfts]for loop ' , myFilteredEvents);

    // const myFilteredEvents = myEvents.reduce((reduced, currentEvent) => {
    //   const { args } = currentEvent;
    //   const fromAddr = args[0];
    //   const nftId = args[2].toNumber();
    //   const evtObj = {
    //     nftId: args[2],
    //     owned: fromAddr == address ? 0 : 1,
    //   };
    //   if (reduced.hasOwnProperty(nftId)) {
    //     fromAddr == address ? reduced[nftId].owned -= 1 : reduced[nftId].owned += 1;
    //   } else {
    //     reduced[nftId] = evtObj;
    //   }
    //   return reduced;
    // }, {});
    
    const myNftsArr = [];
    console.log("[AKgetMyNfts] myFilteredEvents", myFilteredEvents)
    for (let nftId in myFilteredEvents)  {
      if (myFilteredEvents[nftId].owned == 1) {
        console.log('[AKgetMyNfts] my owned nftid: ' + nftId + ' ', myFilteredEvents[nftId])
        try {
          const tokenId = myFilteredEvents[nftId].nftId;
          const tokenURI = fixUrl(await readContracts.TRANSPARENT_POWER.tokenURI(tokenId));
          const { data } = await axios.get(tokenURI);
          data.image = fixUrl(data.image);
          myNftsArr.push({ id: tokenId, uri: tokenURI, owner: address, ...data });
        } catch (e) {
          console.log('[AKgetMyNfts] [AK] failed ' + e);
        }
      }
    }

    setMyCollectibles(myNftsArr);
    console.log("[AKgetMyNfts] myNftsArr", myNftsArr);
    const ids = myNftsArr.map((nft) => nft.id.toNumber());
    setMyCollectiblesIds(ids);
  }
  
  const getOtherNfts = async () => {
    const nftIndexArr = [];
    for (let i = 0; i < nftTotalSupply; i++) {
      if (myCollectiblesIds.indexOf(i+1) === -1) {
        nftIndexArr.push(<Option key={i} value={i+1}>{i+1}</Option>)
      }
    }
    setOtherCollectiblesOptions(nftIndexArr);
  }
  
  const pullNftDetails = async () => {
    try {
      if(!selectedNftId) {
        setOtherCollectibles([]);
        return;
      }
      const tokenId = selectedNftId;//await nftContract.tokenByIndex(value -1);
      const owner = await readContracts.TRANSPARENT_POWER.ownerOf(tokenId); // await nftContract.ownerOf(tokenId); 
      const tokenURI = fixUrl(await readContracts.TRANSPARENT_POWER.tokenURI(tokenId));
      
      const { data } = await axios.get(tokenURI);
      data.image = fixUrl(data.image);
      const nftDetails = { id: tokenId, uri: tokenURI, owner, ...data };
      setOtherCollectibles([nftDetails]);
      } catch (error) {
      
    }
  }
  const myNftsOptions = myCollectiblesIds.map((id) => {
    return (<Option disabled="true" key={id} value={id}>{id}</Option>)
  });
  

    

  const filterOffers = async () => {
    const myOffersArr =  offerEvents.filter((item) => {

      return myCollectiblesIds.indexOf(item.args[1].toNumber()) !== -1;
    });

    setMyOffers(myOffersArr);
    
    
  }

  
  useEffect(() => {

    getMyNfts();


  }, [nftTransferEvents]);

  useEffect(() => {
    pullNftDetails();
  }, [selectedNftId]);

  useEffect(() => {

    getOtherNfts();
  
  }, [nftTotalSupply, myCollectiblesIds]);

  useEffect(() => {
    filterOffers();
  }, [offerEvents, myCollectiblesIds]);

  useEffect(() => {
    const updateOffers = async () => {
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
          swapCancelled,
          blockNumber,
          id: item.args[1].toNumber(),
          contractAddress,
        }
        const include = !swapSucceeded && !swapCancelled;
        return {
          value: offerItem,
          include,
        } 
      })))
      setOffers(filteredOffers.filter(v => v.include).map(data => data.value));
      setOfferHistory(filteredOffers.filter(v => !v.include).map(data => data.value));

    }
    updateOffers();
  }, [myOffers, nftApprovalEvents, nftTransferEvents]);


  return (
    <div>
      <Alert message="This is still in beta version. Use at your own risk." type="warning" showIcon />
      <div style={{ marginTop: 32, paddingBottom: 32, paddingRight: 32, paddingLeft: 32 }}>
      {/* <Space direction="vertical">
        <Title level={5}>Select collection</Title>
        <Select 
          value={sourceNftCollection} 
          style={{ width: 220 }}
          onChange={(value) => {
            setSourceNftCollection(value);
            setTargetNftCollection(value);
          }}
        >
          <Option value="">---Select collection---</Option>
          {
            availableNftCollections.map((collection, index) => {
              return (
                <Option key={index} value={collection.address}>{collection.name}</Option>
              )
            })
          }
        </Select>
      </Space> */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Title level={4}>Your NFTs</Title>
            <Space direction="vertical">
              <Search placeholder="search your nfts" onChange={(e) => setMyCollectiblesFilter(e.target.value)} style={{ width: 200 }} />
            </Space>

            <List
              bordered
              style={{marginTop: 20}}
              dataSource={myCollectibles.filter((nft) => nft.id.toString().includes(myCollectiblesFilter))}
              // dataSource={myCollectibles}
              renderItem={item => {
                const id = item.id.toNumber();
                return (
                  <List.Item 
                    key={id + "_" + item.uri + "_" + item.owner}
                    style={{textAlign: 'left'}}
                    >
                    <Checkbox 
                      style={{marginRight: 20}}
                      checked={ownedNftForSwap == id ? true : false}
                      disabled={ownedNftForSwap && ownedNftForSwap !== id}
                      onChange={(event) => {
                        const { checked } = event.target;
                        checked ? setOwnedNftForSwap(id) : setOwnedNftForSwap(null);
                      }}
                      >
                    </Checkbox>
                    <List.Item.Meta
                      avatar={<Avatar shape="square" src={item.image} />}
                      title={<a target="_blank" href={"https://opensea.io/assets/ethereum/0xecdeb3fec697649e08b63d93cab0bb168c35eec5/" + item.id.toNumber()}>{`${item.name}`}</a>}
                    />
                    
                  </List.Item>
                )
              }}
              />
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Swap for</Title>
            <Space direction="vertical">
              {/* Commented out, as at the moment we're allowing only for swaps within collection  */}
              {/* <Title level={5}>Select collection</Title>
              <Select 
              value={targetNftCollection} 
              style={{ width: 220 }}
              onChange={(value) => setTargetNftCollection(value)}
              >
              <Option value="">---Select collection---</Option>
              {
                availableNftCollections.map((collection) => {
                  return (
                    <Option value={collection.address}>{collection.name}</Option>
                    )
                  })
                }
              </Select> */}
              <Select
                showSearch
                style={{ width: 200 }}
                onChange={(value) => setSelectedNftId(value)}
                placeholder="Type NFT number"
                value={selectedNftId}
              >
                <OptGroup label="Other NFts">
                  {otherCollectiblesOptions}
                </OptGroup>
                <OptGroup label="Your NFTs">
                  {myNftsOptions}
                </OptGroup>
              </Select>
            </Space>
            <List
              bordered
              style={{marginTop: 20}}
              dataSource={otherCollectibles}
              renderItem={item => {
                const { id } = item;
                return (
                  <List.Item 
                    key={id + "_" + item.uri + "_" + item.owner}
                    style={{textAlign: 'left'}}
                    >
                    <Checkbox 
                      style={{marginRight: 20}}
                      checked={selectedNftForSwap == id ? true : false}
                      disabled={selectedNftForSwap && selectedNftForSwap !== id}
                      onChange={(event) => {
                        const { checked } = event.target;
                        checked ? setSelectedNftForSwap(id) : setSelectedNftForSwap(null);
                      }}
                      >
                    </Checkbox>
                    <List.Item.Meta
                      avatar={<Avatar shape="square" src={item.image} />}
                      title={<a target="_blank" href={"https://opensea.io/assets/ethereum/0xecdeb3fec697649e08b63d93cab0bb168c35eec5/" + item.id}>{`${item.name}`}</a>}
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
              tx(writeContracts.NftSwapperFactory.clone(readContracts.TRANSPARENT_POWER.address, ownedNftForSwap, readContracts.TRANSPARENT_POWER.address, selectedNftForSwap, { value: ethers.utils.parseEther("0.01") }), showResultMessage);
              setOwnedNftForSwap(null);
              setSelectedNftForSwap(null);
              setSelectedNftId(null);
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
                    const nftContract = new ethers.Contract(item.yourNft.address, ERC721_ABI, userSigner);
                    // tx(writeContracts.SampleNft.approve(item.contractAddress, item.id));
                    tx(nftContract.approve(item.contractAddress, item.yourNft.id), showResultMessage);
                    // filterOffers();
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
                      tx(contract.swap({ value: ethers.utils.parseEther("0.01") }), showResultMessage);
                      // filterOffers();
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
        {/* <Title level={3}>Offer history</Title>
        <List
          dataSource={offerHistory}
          itemLayout="horizontal"
          renderItem={item => {
            return (
              <List.Item 
                key={item.blockNumber + item.yourNft.id + item.otherNft.id}
              >
                <List.Item.Meta
                  title={`Offer to exchange NFT: ${item.yourNft.id} for NFT: ${item.otherNft.id}`}
                  description={"Swap executed"}
                />
              </List.Item>
            );
          }}
        />
       */}
      </div>
    </div>
  );
}

export default Home;
