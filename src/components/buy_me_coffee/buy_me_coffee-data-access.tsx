'use client'

import { getBuyMeCoffeeProgram, getBuyMeCoffeeProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { BN } from 'bn.js'

interface DonateArgs {
  name: string, 
  message: string, 
  amount: number,
  donaterPubkey: PublicKey
}

export function useBuyMeCoffeeProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBuyMeCoffeeProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBuyMeCoffeeProgram(provider, programId), [provider, programId])

  const coffeeAccount = useQuery({
    queryKey: ['coffeeAccount', 'all', { cluster }],
    queryFn: () => program.account.coffeeAccount.all(),
  })

  const coffeePurchaseAccount = useQuery({
    queryKey: ['coffeePurchase', 'all', { cluster }],
    queryFn: () => program.account.coffeePurchase.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // const donate = useMutation<string, Error, DonateArgs>({
  //   mutationKey: ['donate', 'initialize', { cluster }],
  //   mutationFn: async ({ name, message, amount, donaterPubkey }) => {

      
  
  //     [coffeePurchase] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("coffee_purchase"), coffeeAccount.toBuffer(), new anchor.BN(0).toArrayLike(Buffer, "le", 8)],
  //       program.programId
  //     );

  //     return await program.methods
  //       .buyCoffee(name, message, new BN(amount))
  //       .accountsStrict({ 
  //         buyer: donaterPubkey,
  //         coffeeAccount,
  //         coffeePurchase,
  //         systemProgram: SystemProgram.programId,
  //         owner
  //       })
  //       .rpc()
  //     },
  //   onSuccess: async (signature) => {
  //     transactionToast(signature)
  //     await coffeeAccount.refetch()
  //   },
  //   onError: () => {
  //     toast.error('Failed to initialize account')
  //   },
  // })

  return {
    program,
    programId,
    coffeeAccount,
    coffeePurchaseAccount,
    getProgramAccount,
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program } = useBuyMeCoffeeProgram()

  return {}
}
