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
import axios from "axios";
import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { useEventListener } from "eth-hooks/events/useEventListener";
const { Title } = Typography;
const { Option, OptGroup } = Select;
const { Search } = Input;


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
  const [nftTransferEvents, setNftTransferEvents] = useState([]);
// const [offerEvents, setOfferEvents] = useState([]);
  const offerEvents = useEventListener(readContracts, "NftSwapperFactory", "OfferCreated", localProvider, -1);

  const nftTotalSupply = useContractReader(readContracts, "TRANSPARENT_POWER", "totalSupply");
  
  const nftApprovalEvents = useEventListener(readContracts, "TRANSPARENT_POWER", "Approval", localProvider, 1);
  // const nftTransferEvents = useEventListener(readContracts, "TRANSPARENT_POWER", readContracts.TRANSPARENT_POWER?.filters.Transfer(null, address), localProvider, 1);
  // console.log('rrr', nftTransferEvents)
  // useEffect(() => {
  //   console.log('new attaching listenet')
  //   let filter = readContracts.NftSwapperFactory?.filters.OfferCreated();
  //   console.log('filter', filter);
  //   filter = {...filter, fromBlock: 1000}
  //   console.log('filter2', filter);
  //   localProvider?.on('block', () => {
  //     readContracts.NftSwapperFactory?.on(filter, handleEvents);
  //     console.log('new block')
  //   });
    
  //   const handleEvents = (from, to, id, evt) => {
  //     console.log('offerEvents before', offerEvents)
  //     setOfferEvents(offerEvents => setOfferEvents([...offerEvents, evt]));
  //     console.log('offerEvents after', offerEvents)
  //   };
    
  //   return () => readContracts.NftSwapperFactory?.off(filter, handleEvents);
    

  // }, [readContracts])

  // useEffect(async () => {
  //   const filter = readContracts.NftSwapperFactory?.filters.OfferCreated();
  //   const offers = await readContracts.NftSwapperFactory?.queryFilter(filter, -1800, 'latest');
  //   console.log('akaka', offers);
  //   console.log('akaka2', await localProvider?.getBlockNumber());
  //   // setOfferEvents(offers);
  // }, [readContracts]);

  const getEvents = async () => {
    // console.log('[AK] refreshing events');
    // const nftContract = readContracts.TRANSPARENT_POWER;
    // const receivedFilter = readContracts.TRANSPARENT_POWER?.filters.Transfer(null, address);
    // const sentFilter = readContracts.TRANSPARENT_POWER?.filters.Transfer(address, null);
    // if (!sentFilter || !receivedFilter) return;
    // console.log('[AK] filter', receivedFilter);
    // const receivedEvents = await nftContract?.queryFilter(receivedFilter) || [];
    // const sentEvents = await nftContract?.queryFilter(sentFilter) || [];
    // console.log('[AK] received EVENTS', receivedEvents);
    // console.log('[AK] sent EVENTS', sentEvents);
    // setNftTransferEvents([...receivedEvents, ...sentEvents]);
    // console.log("nftTransferEvents", nftTransferEvents);
  }
  
  useEffect(() => {
    let filterFromMe = readContracts.TRANSPARENT_POWER?.filters.Transfer(address, null);
    let filterToMe = readContracts.TRANSPARENT_POWER?.filters.Transfer(null, address);

    let handleEvent = function(from, to, id, evt) {
      setNftTransferEvents(nftTransferEvents => [...nftTransferEvents, evt]);
      console.log('[AK] id', id);
    };
    readContracts.TRANSPARENT_POWER?.on(filterFromMe, handleEvent);
    readContracts.TRANSPARENT_POWER?.on(filterToMe, handleEvent);
    return () => {
      readContracts.TRANSPARENT_POWER?.off(filterFromMe, handleEvent);
      readContracts.TRANSPARENT_POWER?.off(filterToMe, handleEvent);
    }



  }, [readContracts])
  
  

  const showResultMessage = (update) => {
    if (update && (update.status === "confirmed" || update.status === 1)) {
      message.success('Transaction confirmed!');
    }
  } 


  const getMyNfts = async () => {
    console.log('[AK] refreshing events');
    const nftContract = readContracts.TRANSPARENT_POWER;
    const receivedFilter = readContracts.TRANSPARENT_POWER?.filters.Transfer(null, address);
    const sentFilter = readContracts.TRANSPARENT_POWER?.filters.Transfer(address, null);
    console.log('[AK] filter', receivedFilter);
    const receivedEvents = await nftContract?.queryFilter(receivedFilter) || [];
    const sentEvents = await nftContract?.queryFilter(sentFilter) || [];
    console.log('[AK] received EVENTS', receivedEvents);
    console.log('[AK] sent EVENTS', sentEvents);
    // setNftTransferEvents([...receivedEvents, ...sentEvents]);
    const nftTransferEventsTest = [...receivedEvents, ...sentEvents];
    console.log("nftTransferEvents", nftTransferEvents);
    const myFilteredEvents = nftTransferEventsTest.reduce((reduced, currentEvent) => {
      const { args } = currentEvent;
      const fromAddr = args[0];
      const nftId = args[2].toNumber();
      const evtObj = {
        nftId: args[2],
        owned: fromAddr == address ? 0 : 1,
      };
      if (reduced.hasOwnProperty(nftId)) {
        fromAddr == address ? reduced[nftId].owned -= 1 : reduced[nftId].owned += 1;
      } else {
        reduced[nftId] = evtObj;
      }
      return reduced;
    }, {});
    
    const myNftsArr = [];
    for (let nftId in myFilteredEvents)  {
      if (myFilteredEvents[nftId].owned == 1) {
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

    const ids = myNftsArr.map((nft) => nft.id.toNumber());
    
    const nftIndexArr = [];
    const nftTotalSupply = await readContracts.TRANSPARENT_POWER?.totalSupply();
    for (let i = 0; i < nftTotalSupply; i++) {
      console.log('[AK3] My collectibles ID ', ids);
      if (ids.indexOf(i+1) === -1) {
        console.log('[AK3] Pushing ', i + 1);
        nftIndexArr.push(<Option key={i} value={i+1}>{i+1}</Option>)
      }
    }
    setMyCollectibles(myNftsArr);
    setMyCollectiblesIds(ids);
    setOtherCollectiblesOptions(nftIndexArr);
    console.log('[ak3] other collectibles options ', otherCollectiblesOptions);
  }
  
  const getOtherNftsOptions = async () => {
    const nftIndexArr = [];
    const nftTotalSupply = await readContracts.TRANSPARENT_POWER?.totalSupply();
    for (let i = 0; i < nftTotalSupply; i++) {
      console.log('[AK3] My collectibles ID ', myCollectiblesIds);
      if (myCollectiblesIds.indexOf(i+1) === -1) {
        console.log('[AK3] Pushing ', i + 1);
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
  
  // const otherNftsOptions = () => {
  //   const nftIndexArr = [];
  //   for (let i = 0; i < nftTotalSupply; i++) {
  //     console.log('[AK3] My collectibles ID ', myCollectiblesIds);
  //     if (myCollectiblesIds.indexOf(i+1) === -1) {
  //       console.log('[AK3] Pushing ', i + 1);
  //       nftIndexArr.push(<Option key={i} value={i+1}>{i+1}</Option>)
  //     }
  //   }
  //   return nftIndexArr;
  // }
    

  const filterOffers = async () => {
    console.log('offerEvents', offerEvents);
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

  // useEffect(() => {
  //   console.log("[AK] nft total supply", nftTotalSupply);
  //   setOtherCollectiblesOptions([]);
  //   const getOtherNftsOptions = async () => {
  //     const nftIndexArr = [];
  //     for (let i = 0; i < nftTotalSupply; i++) {
  //       console.log('[AK3] My collectibles ID ', myCollectiblesIds);
  //       if (myCollectiblesIds.indexOf(i+1) === -1) {
  //         console.log('[AK3] Pushing ', i + 1);
  //         nftIndexArr.push(<Option key={i} value={i+1}>{i+1}</Option>)
  //       }
  //     }
  //     setOtherCollectiblesOptions(nftIndexArr);
  //   }
  //   getOtherNftsOptions();
  
  // }, [nftTotalSupply, myCollectiblesIds]);

  useEffect(() => {
    filterOffers();
  }, [offerEvents, myCollectiblesIds]);

  useEffect(() => {
    const updateOffers = async () => {
      const filteredOffers =  await (Promise.all(myOffers.map(async (item) => {
        const contractAddress = item.args[2];
        const swapperContract = new ethers.Contract(contractAddress, SWAPPER_ABI, userSigner);
        const swapSucceeded = await swapperContract.swapSucceeded();
        if (swapSucceeded == true) return {};
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
                  {/* {otherNftsOptions} */}
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
              tx(writeContracts.NftSwapperFactory.clone(readContracts.TRANSPARENT_POWER.address, ownedNftForSwap, readContracts.TRANSPARENT_POWER.address, selectedNftForSwap, { value: ethers.utils.parseEther("0.01") }), () => {
                showResultMessage()
                setOwnedNftForSwap(null);
                setSelectedNftForSwap(null);
                setSelectedNftId('');
              });
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
                      // tx(contract.swap({ value: ethers.utils.parseEther("0.01") }), showResultMessage);
                      tx(contract.swap({ value: ethers.utils.parseEther("0.01") }), () => {
                        showResultMessage();
                      });
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
