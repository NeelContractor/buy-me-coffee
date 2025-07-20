"use client"

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider"
import { useBuyMeCoffeeProgram } from "./buy_me_coffee-data-access"
import { Button } from "../ui/button";
import { CheckCircle, Coffee, CoffeeIcon, Gift, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BuyButton from "./BuyButton";

export default function BuyMeCoffee() {
    const { coffeeAccount, initialize, donate } = useBuyMeCoffeeProgram();
    const { publicKey } = useWallet();
    const [selectedTier, setSelectedTier] = useState<number | null>(null);
    console.log(selectedTier);

    // const handleInit = async () => {
    //     if (!publicKey) return;
    //     await initialize.mutateAsync({ ownerPubkey: publicKey });
    // }
    // const handleDonate = async () => {
    //     if (!publicKey) return;
    //     await donate.mutateAsync({ donaterPubkey: publicKey,  });
    // }




    const coffeeTiers = [
        {
        id: 1,
        name: "Single Coffee",
        price: 0.5,
        icon: Coffee,
        description: "Buy me a single coffee to fuel my work",
        popular: false
        },
        {
        id: 2,
        name: "Coffee & Pastry",
        price: 1,
        icon: Gift,
        description: "Coffee plus a little treat for extra motivation",
        popular: true
        },
        {
        id: 3,
        name: "Coffee Date",
        price: 2,
        icon: Heart,
        description: "Like having coffee together - my favorite!",
        popular: false
        }
    ];

    const recentSupporters = [
        { name: "Sarah M.", amount: 5, message: "Love your work!" },
        { name: "Alex K.", amount: 10, message: "Keep it up! ☕" },
        { name: "Jordan P.", amount: 25, message: "Thank you for sharing your knowledge" },
        { name: "Casey L.", amount: 5, message: "Small contribution, big appreciation!" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={"/"} className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-800">BuyMeCoffee</span>
            </Link>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-gray-600 font-bold hover:text-orange-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-600 font-bold hover:text-orange-600 transition-colors">About</a>
              <a href="#support" className="text-gray-600 font-bold hover:text-orange-600 transition-colors">Support</a>
              <WalletButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              Loved by 1,000+ supporters
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Buy me a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600"> coffee</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Help fuel my passion for creating amazing projects and sharing knowledge with the community. 
              Every coffee makes a difference! ☕
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <button 
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    // onClick={() => handleDonate()}
                >
                    <Coffee className="inline h-5 w-5 mr-2" />
                    Buy me a coffee
                </button> */}
                <BuyButton />
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Tiers */}
      <section id="support" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Support Level</h2>
            <p className="text-xl text-gray-600">Every contribution helps me create better content and projects</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coffeeTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className={`relative bg-white border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    tier.popular ? 'border-orange-500 shadow-xl' : 'border-gray-200 hover:border-orange-300'
                  } ${selectedTier === tier.id ? 'ring-4 ring-orange-200' : ''}`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                      tier.popular ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-4">
                      {tier.price} SOL
                    </div>
                    <p className="text-gray-600 mb-8">{tier.description}</p>
                    
                    <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}>
                      {selectedTier === tier.id ? 'Selected' : 'Choose This'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Your Support Matters</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Hi! I'm a passionate developer who loves creating open-source projects, writing tutorials, 
                and sharing knowledge with the community. Your support helps me:
              </p>
              
              <div className="space-y-4">
                {[
                  'Dedicate more time to open-source projects',
                  'Create in-depth tutorials and guides',
                  'Maintain and improve existing tools',
                  'Cover hosting and development costs'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">1,247</div>
                  <div className="text-gray-600">Supporters</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">$8,430</div>
                  <div className="text-gray-600">Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">42</div>
                  <div className="text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">15k</div>
                  <div className="text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Supporters */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Supporters</h2>
            <p className="text-xl text-gray-600">Amazing people who fuel my work</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSupporters.map((supporter, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-semibold">
                  {supporter.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{supporter.name}</h4>
                <div className="text-orange-600 font-bold mb-2">${supporter.amount}</div>
                <p className="text-sm text-gray-600 italic">"{supporter.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Support?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join an amazing community of supporters and help me create even better projects!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              <Coffee className="inline h-5 w-5 mr-2" />
              Buy me a coffee
            </button> */}
            <BuyButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Coffee className="h-6 w-6 text-orange-400" />
              <span className="text-lg font-semibold">BuyMeCoffee</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">Made with ❤️ for the community</p>
              <p className="text-sm text-gray-500 mt-1">© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    )
}