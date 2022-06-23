# NFT-Swapper

> Everything you need to swap your NFTs! 🏞

Utility that helps you to make peer-to-peer (P2P) swaps of ERC721 tokens. It is built to be gas efficient to save you hard earned bucks by avoiding OpenSea/Rarible fees.

## How does it work?

1. 💡 Anyone can propose a swap between specific address by giving:
   1. other person's address,
   1. his own NFT that this person wants to swap by giving collection contract address,
   1. collection's address of which that person is interested in
   1. giving the specific token ID from that collection,
   1. specifying time to which the order is valid
1. ✅ Approve the token to the just created swap contract address
1. ⏳ Wait for the other person to do the the approval as well
1. 🏁 Swap is being executed and you both can enjoy just swapped NFT

---

## TODO

- [ ] implement time till which swap could be done
- [ ] restrict functions to be called by either the maker or a taker
- [ ] move testing scripts to the `/test` folder
- [ ] emit events (eg. when swap is done - also marks the contract as no longer usable)
- [ ] implement minimal proxy (for better gas efficiency)
- [ ] prepare UI which will be simple and which will show active and already executed swaps
