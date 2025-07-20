"use client"

import { WalletButton } from "../solana/solana-provider"
import { useBuyMeCoffeeProgram } from "./buy_me_coffee-data-access"

export default function BuyMeCoffee() {
    const { coffeeAccount } = useBuyMeCoffeeProgram();
    return (
        <div>
            <div>
                <div>BuyMeCoffee</div>
                <div>
                    <WalletButton />
                </div>
            </div>
            <div>
                <div>
                    {coffeeAccount.data?.map((data) => (
                        <div key={data.publicKey.toString()}>
                            {/* {JSON.stringify(data)} */}
                            {data.account.owner.toBase58()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}