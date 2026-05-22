
import { BlockchainRecord, BlockchainNetwork, CertificateData } from '../types';

// Mock Contract Addresses
const CONTRACTS = {
  Polygon: '0x29f2D40B0605204364af54EC677bD022042518E9',
  Ethereum: '0x1234567890123456789012345678901234567890',
  'BNB Chain': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  Solana: 'DSHCert...Verification'
};

/**
 * Generates a SHA-256 hash of the certificate data.
 * This hash ensures data integrity. If any field changes, the hash changes.
 */
export const generateCertificateHash = async (cert: CertificateData): Promise<string> => {
  const dataString = `${cert.id}:${cert.studentName}:${cert.courseName}:${cert.issueDate}:${cert.grade}:DSH_ISSUER`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
};

/**
 * Simulates the mining/minting process on a blockchain.
 */
export const mintCertificateOnChain = async (
  cert: CertificateData, 
  network: BlockchainNetwork
): Promise<BlockchainRecord> => {
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const integrityHash = await generateCertificateHash(cert);
  const timestamp = new Date().toISOString();
  
  // Generate a random mock Transaction Hash
  const randomHex = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const txHash = network === 'Solana' ? `sol${randomHex.substring(0, 40)}` : `0x${randomHex}`;
  
  const blockNumber = Math.floor(Math.random() * 10000000) + 15000000;

  return {
    network,
    txHash,
    blockNumber,
    contractAddress: CONTRACTS[network],
    timestamp,
    integrityHash,
    nftTokenId: Math.floor(Math.random() * 10000).toString()
  };
};

export const getExplorerLink = (record: BlockchainRecord): string => {
  switch (record.network) {
    case 'Polygon': return `https://polygonscan.com/tx/${record.txHash}`;
    case 'Ethereum': return `https://etherscan.io/tx/${record.txHash}`;
    case 'BNB Chain': return `https://bscscan.com/tx/${record.txHash}`;
    case 'Solana': return `https://explorer.solana.com/tx/${record.txHash}`;
    default: return '#';
  }
};
