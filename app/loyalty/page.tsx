"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import ModernHeader from "@/components/header/modern-header";
import LoyaltySystem from "@/components/loyalty/loyalty-system";

interface PointsTransaction {
  id: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

interface LoyaltyData {
  currentPoints: number;
  totalEarned: number;
  transactions: PointsTransaction[];
}

export default function LoyaltyPage() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchLoyaltyData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/loyalty");
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setLoyaltyData(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" />

      <section className="bg-white border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Image
              src="/images/droovo-logo-full.png"
              alt="Droovo"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Programme de Fidélité</h1>
          <p className="text-gray-600">
            Gagnez des points à chaque commande et débloquez des récompenses exclusives
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p>Chargement des données...</p>}
        {error && <p className="text-red-500">Erreur: {error}</p>}
        {loyaltyData && (
          <LoyaltySystem
            currentPoints={loyaltyData.currentPoints}
            totalEarned={loyaltyData.totalEarned}
            transactions={loyaltyData.transactions}
            onRedeem={fetchLoyaltyData} 
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
