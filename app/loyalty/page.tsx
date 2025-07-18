"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"
import LoyaltySystem from "@/components/loyalty/loyalty-system"

// Mock data pour les points de fidélité
const loyaltyData = {
  currentPoints: 750,
  totalEarned: 1250,
  transactions: [
    {
      id: "1",
      type: "earned" as const,
      points: 48,
      description: "Commande chez Pizza Palace",
      date: "15 janvier 2024",
      orderId: "ORD-2024-001",
    },
    {
      id: "2",
      type: "redeemed" as const,
      points: 100,
      description: "Livraison gratuite échangée",
      date: "14 janvier 2024",
    },
    {
      id: "3",
      type: "earned" as const,
      points: 32,
      description: "Commande chez Sushi Zen",
      date: "12 janvier 2024",
      orderId: "ORD-2024-002",
    },
    {
      id: "4",
      type: "earned" as const,
      points: 25,
      description: "Commande chez Burger House",
      date: "10 janvier 2024",
      orderId: "ORD-2024-003",
    },
    {
      id: "5",
      type: "redeemed" as const,
      points: 200,
      description: "Réduction 10% échangée",
      date: "8 janvier 2024",
    },
  ],
}

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" />

      {/* Page Header */}
      <section className="bg-white border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Image src="/images/droovo-logo-full.png" alt="Droovo" width={140} height={40} className="h-8 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Programme de Fidélité</h1>
          <p className="text-gray-600">Gagnez des points à chaque commande et débloquez des récompenses exclusives</p>
        </div>
      </section>

      {/* Loyalty System */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoyaltySystem
          currentPoints={loyaltyData.currentPoints}
          totalEarned={loyaltyData.totalEarned}
          transactions={loyaltyData.transactions}
        />
      </section>

      <Footer />
    </div>
  )
}
