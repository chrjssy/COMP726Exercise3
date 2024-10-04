require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API Key
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.AlchemyProvider('sepolia', API_KEY);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

// Create a signer
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = contract.abi;
const contractAddress = '0xc89C238389792727B9fC80A81d5079D1F54ce075';

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Function to generate random NFT metadata
const generateRandomNFTMetadata = () => {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number for uniqueness
    const randomName = `NFT-${randomNumber}`; // Random name
    const randomDescription = `This is a description for NFT-${randomNumber}`; // Random description

    // Create a simple metadata object
    const metadata = {
        name: randomName,
        description: randomDescription,
        image: `https://example.com/nft-images/${randomNumber}.png` // Placeholder image URL
    };

    return JSON.stringify(metadata);
}

// Call mintNFT function
const mintNFT = async () => {
    const tokenUri = generateRandomNFTMetadata(); // Generate the metadata
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
