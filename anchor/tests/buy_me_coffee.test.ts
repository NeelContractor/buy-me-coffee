import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'
import { BuyMeCoffee } from '../target/types/buy_me_coffee'

describe('Buy Me Coffee', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const owner = provider.wallet as anchor.Wallet

  const program = anchor.workspace.BuyMeCoffee as Program<BuyMeCoffee>

  let coffeeAccount: PublicKey;
  let coffeePurchase: PublicKey;
  let donater = Keypair.generate();
  const name = "Alice";
  const message = "Have a Great Coffee";
  const amount = new anchor.BN(0.1 * LAMPORTS_PER_SOL); // 0.1

  beforeAll(async () => {
    const tx1 = await provider.connection.requestAirdrop(owner.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx1, "confirmed");
    const tx = await provider.connection.requestAirdrop(donater.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx, "confirmed");
    [coffeeAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("coffee_account"), owner.publicKey.toBuffer()],
      program.programId
    );

    [coffeePurchase] = PublicKey.findProgramAddressSync(
      [Buffer.from("coffee_purchase"), coffeeAccount.toBuffer(), new anchor.BN(0).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
  })

  // it('Initialize the Coffee account', async () => {
  //   const tx = await program.methods
  //     .initialize(owner.publicKey)
  //     .accountsStrict({
  //       signer: owner.publicKey,
  //       coffeeAccount,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .rpc()

  //     console.log("initialize transaction signature: ", tx);
  //   // const account = await program.account.coffeeAccount.fetch(coffeeAccount);
  //   // expect(account.owner.toString()).toEqual(owner.publicKey.toString());
  //   // expect(account.totalAmount.toNumber()).toEqual(0);
  // })

  it('buy coffee', async () => {
    const tx = await program.methods
      .buyCoffee(name, message, amount)
      .accountsStrict({
        buyer: donater.publicKey,
        coffeePurchase: coffeePurchase,
        coffeeAccount,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([donater])
      .rpc()

      console.log("Donate/Buy transaction signature: ", tx);
      const purchaseAccount = await program.account.coffeePurchase.fetch(coffeePurchase);
      expect(purchaseAccount.buyer.toString()).toEqual(donater.publicKey.toString());
      expect(purchaseAccount.name).toEqual(name);
      expect(purchaseAccount.message).toEqual(message);
      
      const account = await program.account.coffeeAccount.fetch(coffeeAccount);
      console.log(account);
  })

  // it("Withdraw funds", async () => {
  //   const withdrawAmount = new anchor.BN(0.05 * LAMPORTS_PER_SOL);

  //   const tx = await program.methods
  //     .withdraw(withdrawAmount)
  //     .accountsStrict({
  //       coffeeAccount,
  //       owner: owner.publicKey,
  //       systemProgram: SystemProgram.programId
  //     })
  //     .signers([owner])
  //     .rpc({ skipPreflight: true });

  //     console.log("Withdraw transaction signature: ", tx);

  //     const coffeeAccountData = await program.account.coffeeAccount.fetch(coffeeAccount);
  //     console.log(coffeeAccountData);
  // })
})
