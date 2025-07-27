"use client";

import { useState } from "react";
import { Star, Gift, Trophy, Crown, Zap, Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LoyaltyLevel {
  name: string;
  minPoints: number;
  color: string;
  icon: any;
  benefits: string[];
  multiplier: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: "discount" | "free_delivery" | "free_item" | "cashback";
  value: number;
  image: string;
  available: boolean;
}

interface PointsTransaction {
  id: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

interface LoyaltySystemProps {
  currentPoints: number;
  totalEarned: number;
  transactions: PointsTransaction[];
  onRedeem?: () => void; // callback pour rafraîchir après échange
}

const loyaltyLevels: LoyaltyLevel[] = [
  { name: "Bronze", minPoints: 0, color: "text-amber-600", icon: Star, benefits: ["1 point par 10 DH", "Offres spéciales"], multiplier: 1 },
  { name: "Argent", minPoints: 500, color: "text-gray-500", icon: Gift, benefits: ["1.5x points", "Livraison gratuite mensuelle", "Support prioritaire"], multiplier: 1.5 },
  { name: "Or", minPoints: 1500, color: "text-yellow-500", icon: Trophy, benefits: ["2x points", "Livraison gratuite illimitée", "Accès aux nouveautés"], multiplier: 2 },
  { name: "Platine", minPoints: 3000, color: "text-purple-600", icon: Crown, benefits: ["3x points", "Réductions exclusives", "Service VIP", "Cadeaux d'anniversaire"], multiplier: 3 },
];

const availableRewards: Reward[] = [
  { id: "1", name: "Livraison gratuite", description: "Livraison gratuite sur votre prochaine commande", pointsCost: 100, type: "free_delivery", value: 25, image: "/placeholder.svg?height=100&width=100", available: true },
  { id: "2", name: "Réduction 10%", description: "10% de réduction sur votre prochaine commande", pointsCost: 200, type: "discount", value: 10, image: "/placeholder.svg?height=100&width=100", available: true },
  { id: "3", name: "Pizza gratuite", description: "Pizza Margherita gratuite (valeur 129 DH)", pointsCost: 400, type: "free_item", value: 129, image: "/placeholder.svg?height=100&width=100", available: true },
  { id: "4", name: "Cashback 50 DH", description: "50 DH de cashback sur votre compte", pointsCost: 500, type: "cashback", value: 50, image: "/placeholder.svg?height=100&width=100", available: true },
  { id: "5", name: "Réduction 20%", description: "20% de réduction sur votre prochaine commande", pointsCost: 600, type: "discount", value: 20, image: "/placeholder.svg?height=100&width=100", available: false },
];

export default function LoyaltySystem({ currentPoints, totalEarned, transactions, onRedeem }: LoyaltySystemProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const getCurrentLevel = () =>
    loyaltyLevels.slice().reverse().find((level) => totalEarned >= level.minPoints) || loyaltyLevels[0];

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const currentIndex = loyaltyLevels.findIndex((level) => level.name === currentLevel.name);
    return currentIndex < loyaltyLevels.length - 1 ? loyaltyLevels[currentIndex + 1] : null;
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    const currentLevel = getCurrentLevel();
    const progress = ((totalEarned - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const redeemReward = async (reward: Reward) => {
    if (currentPoints < reward.pointsCost) return;

    setLoadingRedeem(true);
    setRedeemError(null);

    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      console.log("Reward redeemed:", data);

      setSelectedReward(null);
      if (onRedeem) onRedeem(); // refresh les données
    } catch (err: any) {
      setRedeemError(err.message || "Erreur inconnue");
    } finally {
      setLoadingRedeem(false);
    }
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = getProgressToNextLevel();

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Programme de Fidélité</CardTitle>
              <CardDescription className="text-purple-100">
                Gagnez des points à chaque commande et débloquez des récompenses
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentPoints}</div>
              <div className="text-sm text-purple-100">points disponibles</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <currentLevel.icon className={`h-6 w-6 ${currentLevel.color}`} />
              <span className="font-semibold">{currentLevel.name}</span>
            </div>
            <div className="text-sm">{totalEarned} points gagnés au total</div>
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression vers {nextLevel.name}</span>
                <span>{nextLevel.minPoints - totalEarned} points restants</span>
              </div>
              <Progress value={progressToNext} className="h-2 bg-purple-300" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="levels">Niveaux</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          {redeemError && <p className="text-red-500 text-sm">{redeemError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={`${!reward.available ? "opacity-50" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <Badge variant={reward.available ? "default" : "secondary"}>{reward.pointsCost} pts</Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Valeur: {reward.value} DH</div>
                    <Dialog open={selectedReward?.id === reward.id} onOpenChange={() => setSelectedReward(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={!reward.available || currentPoints < reward.pointsCost}
                          onClick={() => setSelectedReward(reward)}
                        >
                          {currentPoints >= reward.pointsCost ? "Échanger" : "Pas assez de points"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmer l'échange</DialogTitle>
                          <DialogDescription>
                            Voulez-vous échanger {selectedReward?.pointsCost} points contre "{selectedReward?.name}" ?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedReward(null)}>
                            Annuler
                          </Button>
                          <Button
                            disabled={loadingRedeem}
                            onClick={() => selectedReward && redeemReward(selectedReward)}
                          >
                            {loadingRedeem ? "Échange..." : "Confirmer l'échange"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-4">
          {loyaltyLevels.map((level) => {
            const isCurrentLevel = level.name === currentLevel.name;
            const isUnlocked = totalEarned >= level.minPoints;
            return (
              <Card key={level.name} className={`${isCurrentLevel ? "ring-2 ring-purple-500" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <level.icon className={`h-8 w-8 ${level.color}`} />
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{level.name}</span>
                          {isCurrentLevel && <Badge>Niveau actuel</Badge>}
                          {!isUnlocked && <Badge variant="secondary">Verrouillé</Badge>}
                        </CardTitle>
                        <CardDescription>
                          {level.minPoints} points requis • Multiplicateur x{level.multiplier}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Avantages :</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
                <p className="text-gray-600">Vos transactions de points apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "earned" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "earned" ? (
                            <ShoppingBag className="h-5 w-5 text-green-600" />
                          ) : (
                            <Gift className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                          {transaction.orderId && (
                            <p className="text-xs text-gray-400">Commande #{transaction.orderId}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "earned" ? "+" : "-"}
                          {transaction.points} pts
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
