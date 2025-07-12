export interface HoldingsAllocation {
  taoBalance: number;
  bittensor: number;
  ethereum: number;
  solana: number;
  allocation: {
    bittensor: number; // percent
    ethereum: number; // percent
    solana: number; // percent
  };
} 