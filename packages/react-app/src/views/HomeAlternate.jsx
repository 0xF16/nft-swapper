import { Button, Col, Row, List, Typography, Space, Select, Input, Card, Tooltip, Skeleton, Empty, Result } from "antd";
  
import { useContractReader } from "eth-hooks";
import ConnectWallet from "../components/ConnectWallet";
import Address from "../components/Address";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircleTwoTone, CloseCircleOutlined, ReloadOutlined, LoadingOutlined, WalletOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;



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
    "function getSwapperStatus() view returns (address, uint256, address, uint256, bool, bool)",
    "function cancelSwap()"
];

  
  
const fixUrl = (url) => {
  if (url.startsWith("ipfs")) {
    return "https://ipfs.io/ipfs/" + url.split("ipfs://")[1];
  }
  return url;
}

function HomeAlternate({ mainnetProvider, localProvider, readContracts, address, userSigner, tx, blockExplorer, writeContracts, web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) {

  const [yourNftForSwap, setYourNftForSwap] = useState();
  const [yourNftIdForSwap, setYourNftIdForSwap] = useState(null);
  const [targetNftForSwap, setTargetNftForSwap] = useState();
  const [targetNftIdForSwap, setTargetNftIdForSwap] = useState(null);
  
  const [offers, setOffers] = useState([]);
  const [yourNfts, setYourNfts] = useState([]);

  const [myNftsOptions, setMyNftsOptions] = useState([]);
  const [otherNftsOptions, setOtherNftsOptions] = useState([]);
  
  const [cardLoading, setCardLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const [loadingNftInProgress, setLoadingNftInProgress] = useState(false);

  // const offerEvents = useEventListener(readContracts, "NftSwapperFactory", "OfferCreated", localProvider, 1);

  const nftTotalSupply = useContractReader(readContracts, "TRANSPARENT_POWER", "totalSupply");
    
    // const nftApprovalEvents = useEventListener(readContracts, "TRANSPARENT_POWER", "Approval", localProvider, 1);

  const pullNftDetails = async (nftId, callback) => {
    try {
      if(!nftId) {
        callback(null);
        return;
      }
      const tokenId = nftId;//await nftContract.tokenByIndex(value -1);
      const owner = await readContracts.TRANSPARENT_POWER.ownerOf(tokenId); // await nftContract.ownerOf(tokenId); 
      const tokenURI = fixUrl(await readContracts.TRANSPARENT_POWER.tokenURI(tokenId));
      
      const { data } = await axios.get(tokenURI);
      data.image = fixUrl(data.image);
      const nftDetails = { id: tokenId, uri: tokenURI, owner, ...data };
      callback(nftDetails);
      } catch (error) {
      
    }
  }

  const getOffers = async () => {
    setOffersLoading(true);

    let allOffers = [];
    for (let i = 0; i < yourNfts.length; i++) {
      const nft = yourNfts[i];
      let filter = readContracts.NftSwapperFactory?.filters.OfferCreated(readContracts.TRANSPARENT_POWER.address, nft.id);
      const offers = await readContracts.NftSwapperFactory?.queryFilter(filter, -1800, "latest");
      allOffers.push(...offers);
    }

    const filteredOffers =  await (Promise.all(allOffers.map(async (item) => {
      const contractAddress = item.args[2];
      const swapperContract = new ethers.Contract(contractAddress, SWAPPER_ABI, userSigner);
      const swapperStatus = await swapperContract.getSwapperStatus();
      const nft1Address = swapperStatus[0];
      const nft1Id = swapperStatus[1];
      const nft2Address = swapperStatus[2];
      const nft2Id = swapperStatus[3];
      const swapSucceeded = swapperStatus[4];
      const swapCancelled = swapperStatus[5];
      if (swapSucceeded || swapCancelled) return {};
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
    setOffersLoading(false);

  }

  const getMyNfts = async () => {
    if (!address || !readContracts.TRANSPARENT_POWER) return;
    setLoadingNftInProgress(true);
    setYourNftIdForSwap(null);

    const nftContract = new ethers.Contract(readContracts.TRANSPARENT_POWER.address, ERC721_ABI, userSigner);
    const receivedFilter = nftContract.filters.Transfer(null, address);
    const sentFilter = nftContract.filters.Transfer(address, null);
    
    const receivedEvents = await nftContract.queryFilter(receivedFilter, 0, "latest") || [];
    const sentEvents = await nftContract.queryFilter(sentFilter) || [];
    
    // console.log("[events]", receivedEvents);
    // console.log("[events]", sentEvents);

    const allEvents = [...receivedEvents, ...sentEvents];
    const myFilteredEvents = allEvents.reduce((reduced, currentEvent) => {
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


    const yourNftsArr = [];
    for (let nftId in myFilteredEvents)  {
      if (myFilteredEvents[nftId].owned === 1) {
        try {
          yourNftsArr.push({ id: myFilteredEvents[nftId].nftId });
        } catch (e) {
          console.log('[AKgetMyNfts]' + e);
        }
      }
    }

    setYourNfts(yourNftsArr);
    setLoadingNftInProgress(false);
    const nftsOptions = yourNftsArr.map((nft, index) => {
      return <Option key={index} value={nft.id.toNumber()}>{`Transparent power #${nft.id.toNumber()}`}</Option>;
    });
    setMyNftsOptions(nftsOptions);
  };

  useEffect(() => {
    setTargetNftIdForSwap(null);
    setOtherNftsOptions([]);
    getOffers();
  }, [yourNfts]);

  useEffect(() => {
    pullNftDetails(yourNftIdForSwap, setYourNftForSwap);
    const yourNftsNumbers = yourNfts.map(value => {
      return value.id.toNumber();
    });
    const otherOptionsArr = [];
    for (let i = 1; i <= nftTotalSupply; i++) {
      otherOptionsArr.push(
        <Option key={i} disabled={yourNftsNumbers.includes(i)} value={i}>{`Transparent power #${i}`}</Option>
      );
    }
    setOtherNftsOptions(otherOptionsArr);
  }, [yourNftIdForSwap]);

  useEffect(() => {
    pullNftDetails(targetNftIdForSwap, setTargetNftForSwap);
  }, [targetNftIdForSwap]);

  useEffect(() => {
    getMyNfts();
  }, [readContracts, userSigner, address]);

  return (
    <div>
      {web3Modal?.cachedProvider ? (
        <div style={{ marginTop: 32, paddingBottom: 32, paddingRight: 32, paddingLeft: 32 }}>
          <Row justify="center" gutter={16}>
            <Col xs={24} md={12}>
              <Title level={4}>Select your NFT</Title>
              <Tooltip title={"Refresh my NFTs"}>
                <Button onClick={getMyNfts} style={{ marginRight: 20 }}>
                  {loadingNftInProgress ? <LoadingOutlined /> : <ReloadOutlined />}
                </Button>
              </Tooltip>
              <Select
                defaultValue=""
                showSearch
                value={yourNftIdForSwap}
                style={{ width: 220}}
                onChange={value => setYourNftIdForSwap(value)}
              >
                {myNftsOptions}
              </Select>
              {yourNftForSwap ?
                <Card
                  style={{ width: 250, marginTop: 20, marginRight: "auto", marginLeft: "auto"}}
                  cover={<img alt="nft image" src={yourNftForSwap.image} />}
                  loading={cardLoading}
                >
                  <Meta 
                    title={<a target="_blank" rel="noreferrer" href={"https://opensea.io/assets/ethereum/0xecdeb3fec697649e08b63d93cab0bb168c35eec5/" + yourNftForSwap.id}>{`${yourNftForSwap.name}`}</a>} 
                    description={<Address address={yourNftForSwap.owner} blockExplorer={blockExplorer} ensProvider={mainnetProvider} fontSize={15}/>}
                  />
                </Card>
                :
                <Empty 
                  style={{marginTop: 30}}
                  description={false} 
                />
              }
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>Swap for</Title>
              <Select 
                defaultValue=""
                value={targetNftIdForSwap} 
                showSearch
                style={{ width: 220 }}
                onChange={(value) => setTargetNftIdForSwap(value)}
              >
                {otherNftsOptions}
              </Select>
              { targetNftForSwap ?
                <Card
                  style={{ width: 250, marginTop: 20, marginRight: "auto", marginLeft: "auto"}}
                  cover={<img alt="nft image" src={targetNftForSwap.image} />}
                  loading={cardLoading}
                >
                  <Meta 
                    title={<a target="_blank" href={"https://opensea.io/assets/ethereum/0xecdeb3fec697649e08b63d93cab0bb168c35eec5/" + targetNftForSwap.id}>{`${targetNftForSwap.name}`}</a>} 
                    description={<Address address={targetNftForSwap.owner} blockExplorer={blockExplorer} ensProvider={mainnetProvider} fontSize={15}/>} />
                </Card>
                :
                <Empty 
                  style={{marginTop: 30}}
                  description={false} 
                />

              }
            </Col>
          <div style={{width: 900, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
            <Button
              disabled={!yourNftForSwap || !targetNftForSwap}
              onClick={async() => {
                const nftOnwer = await readContracts.TRANSPARENT_POWER.ownerOf(yourNftIdForSwap);
                if (nftOnwer != address) {
                  return;
                }
                tx(writeContracts.NftSwapperFactory.clone(readContracts.TRANSPARENT_POWER.address, yourNftForSwap.id, readContracts.TRANSPARENT_POWER.address, targetNftForSwap.id, { value: ethers.utils.parseEther("0.01") }));
              }}
            >
              Create an offer
            </Button>
          </div>
          </Row>
          <Title level={3}>
            <Tooltip
              title={"Refresh offers"}
            >
              <Button onClick={getOffers} style={{marginRight: 20}}>
                { offersLoading ? <LoadingOutlined /> : <ReloadOutlined /> }
              </Button>
            </Tooltip>
            Offers for your NFTs
          </Title>
          <Text type="secondary">Last 8 hours</Text>
          {
            offersLoading ? 
            <Skeleton active paragraph={{ rows: 2 }} />
            :
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
                          tx(nftContract.approve(item.contractAddress, item.yourNft.id));
                          // filterOffers();
                        }}
                        >
                        {item.yourNft.approved ? (<Space><CheckCircleTwoTone twoToneColor="#52c41a" /> Approved</Space>) : "Approve"}
                      </Button>, 
                      <Button
                        type="primary"
                        disabled={!item.yourNft.approved || !item.otherNft.approved}
                        onClick={async () => {
                          try {
                            const contract = new ethers.Contract(item.contractAddress, SWAPPER_ABI, userSigner);
                            tx(contract.swap({ value: ethers.utils.parseEther("0.01") }), getMyNfts);
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
                          } catch(e) {
                            console.error(e);  
                          }
                        }}
                      >
                        <Space><CloseCircleOutlined/> Cancel</Space>
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
          }
          
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
      )
      :
      (<Row justify="center" align="middle">
        <Result
          icon={<WalletOutlined />}
          title="Connect your wallet to start"
          extra={<ConnectWallet web3Modal={web3Modal} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>}
        />    
      </Row>)}

    </div>
    

  );
}

export default HomeAlternate;