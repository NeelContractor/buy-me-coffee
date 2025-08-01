// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BuyMeCoffeeIDL from '../target/idl/buy_me_coffee.json'
import type { BuyMeCoffee } from '../target/types/buy_me_coffee'

// Re-export the generated IDL and type
export { BuyMeCoffee, BuyMeCoffeeIDL }

// The programId is imported from the program IDL.
export const BUY_ME_COFFEE_PROGRAM_ID = new PublicKey(BuyMeCoffeeIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getBuyMeCoffeeProgram(provider: AnchorProvider, address?: PublicKey): Program<BuyMeCoffee> {
  return new Program({ ...BuyMeCoffeeIDL, address: address ? address.toBase58() : BuyMeCoffeeIDL.address } as BuyMeCoffee, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getBuyMeCoffeeProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('5d6hiEu8ZSGe31uubKUcD3VKTNVqFYCRDNfoP8aFubnu')
    case 'mainnet-beta':
    default:
      return BUY_ME_COFFEE_PROGRAM_ID
  }
}
