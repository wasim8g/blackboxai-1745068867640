# Instagram Clone on Arbitrum

This project is a decentralized Instagram clone deployed on the Arbitrum chain. It includes smart contracts written in Solidity and a frontend built with Tailwind CSS, Google Fonts, and Font Awesome.

## Features

- User registration with username, bio, and profile image
- Create posts with image IPFS hash or URL and caption
- Like posts
- Follow other users
- Interact with the contract via MetaMask wallet

## Project Structure

- `contracts/Instagram.sol`: Solidity smart contract for Instagram clone functionality
- `frontend/`: Frontend code (HTML, JS, CSS)
- `hardhat.config.js`: Hardhat configuration for Arbitrum testnet

## Prerequisites

- Node.js and npm installed
- MetaMask wallet
- Access to Arbitrum testnet RPC URL and private key for deployment

## Setup

1. Install dependencies:

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers dotenv
```

2. Create a `.env` file in the root directory with the following variables:

```
ARBITRUM_TESTNET_RPC_URL=your_arbitrum_testnet_rpc_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key (optional, for contract verification)
```

3. Compile the smart contracts:

```bash
npx hardhat compile
```

4. Deploy the smart contract to Arbitrum testnet:

Create a deploy script in `scripts/deploy.js` (not included here) or deploy manually using Hardhat.

5. Update the `contractAddress` and `contractABI` in `frontend/app.js` with the deployed contract address and ABI.

6. Run the frontend:

You can serve the frontend folder using a simple HTTP server, for example:

```bash
npx http-server frontend
```

Then open the served URL in your browser.

## Notes

- The smart contract stores IPFS hashes or URLs for images; you need to upload images to IPFS or use external URLs.
- The follower and following counts are not fully implemented on-chain due to gas constraints; consider off-chain indexing for production.
- This is a basic implementation and can be extended with more features and optimizations.

## License

MIT
