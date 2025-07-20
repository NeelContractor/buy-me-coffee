"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "../ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import { useBuyMeCoffeeProgram } from "./buy_me_coffee-data-access";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Coffee } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function BuyButton() {
    const { publicKey } = useWallet();
    const { donate } = useBuyMeCoffeeProgram();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [donationAmount, setDonationAmount] = useState(0);

    const isValid = name.trim() != "" && message.trim() != "";
    const handleDonate = async () => {
        if (publicKey && isValid) {
            console.log(name)
            console.log(message)
            console.log(donationAmount * LAMPORTS_PER_SOL)
            await donate.mutateAsync({ name, message, donaterPubkey: publicKey, amount: donationAmount * LAMPORTS_PER_SOL });
        }
    }

    return (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            <Coffee className="inline h-5 w-5 mr-2" />
            <AlertDialog>
                <AlertDialogTrigger>Buy me a Coffee</AlertDialogTrigger>
                <AlertDialogContent >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center font-bold">Donate SOL for Coffee</AlertDialogTitle>
                        <AlertDialogDescription >
                            <Input 
                                type="text"
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)} 
                                className="text-orange-600 font-semibold my-2"
                            />
                            <Textarea 
                                placeholder="Message" 
                                onChange={(e) => setMessage(e.target.value)} 
                                className="text-orange-600 font-semibold my-2"
                            />
                            <Input 
                                type="number"
                                placeholder="Donation Amount" 
                                step="any"
                                onChange={(e) => setDonationAmount(Number(e.target.value))} 
                                className="text-orange-600 font-semibold my-2"
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white bg-red-500">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="text-white bg-orange-500"
                            onClick={() => handleDonate()}
                        >Donate</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

{/* <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Buy me a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600"> coffee</span>
            </h1> */}

<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>