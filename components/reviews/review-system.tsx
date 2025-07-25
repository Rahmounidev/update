"use client"

import { useState } from "react"
import { Star, Flag, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  helpful: number
  orderId?: string
  response?: string
}

interface ReviewSystemProps {
  restaurantId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ReviewSystem({
  restaurantId,
  reviews: initialReviews,
  averageRating,
  totalReviews,
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(false)

  /** Vérifie si l'utilisateur est connecté via l'API session */
  const checkSession = async () => {
    try {
      const res = await fetch("/api/session", { credentials: "include" })
      if (!res.ok) return null
      return await res.json()
    } catch (err) {
      console.error("Erreur checkSession:", err)
      return null
    }
  }

  const submitReview = async () => {
    if (newRating === 0 || newComment.trim() === "") return;
  
    try {
      setLoading(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Obligatoire pour iron-session
        body: JSON.stringify({
          userId: restaurantId, // Le backend attend userId
          rating: newRating,
          comment: newComment,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("Erreur API:", data);
        throw new Error(data.message || "Erreur lors de la soumission de l'avis.");
      }
  
      setReviews([data.review, ...reviews]);
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("Impossible d'envoyer votre avis. Vérifiez votre connexion ou votre session.");
    } finally {
      setLoading(false);
    }
  };
  

  /** Signaler un avis */
  const reportReview = async () => {
    if (!selectedReview) return

    try {
      await fetch(`/api/reviews/${selectedReview.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: reportReason, details: reportDetails }),
      })
      console.log("Review reported:", { reviewId: selectedReview.id, reason: reportReason, details: reportDetails })
    } catch (error) {
      console.error("Erreur lors du signalement de l'avis:", error)
    } finally {
      setReportReason("")
      setReportDetails("")
      setSelectedReview(null)
    }
  }

  /** Marquer un avis comme utile / pas utile */
  const markHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ helpful }),
      })
      console.log("Review marked as helpful:", { reviewId, helpful })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avis clients</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Laisser un avis</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Évaluer ce restaurant</DialogTitle>
                  <DialogDescription>Partagez votre expérience pour aider d'autres clients</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Note (sur 5 étoiles)</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= newRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Votre commentaire</Label>
                    <Textarea
                      id="comment"
                      placeholder="Décrivez votre expérience..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={submitReview} disabled={newRating === 0 || loading}>
                    {loading ? "Envoi..." : "Publier l'avis"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{averageRating}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{totalReviews}</span> avis
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {(review.customerName?.charAt(0) ?? "?").toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base">{review.customerName ?? "Utilisateur"}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                      {review.orderId && (
                        <Badge variant="outline" className="text-xs">
                          Commande #{review.orderId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                      <Flag className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Signaler cet avis</DialogTitle>
                      <DialogDescription>
                        Aidez-nous à maintenir la qualité des avis en signalant les contenus inappropriés
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Raison du signalement</Label>
                        <Select value={reportReason} onValueChange={setReportReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une raison" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spam">Spam ou contenu promotionnel</SelectItem>
                            <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                            <SelectItem value="fake">Faux avis</SelectItem>
                            <SelectItem value="offensive">Langage offensant</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reportDetails">Détails (optionnel)</Label>
                        <Textarea
                          id="reportDetails"
                          placeholder="Expliquez pourquoi vous signalez cet avis..."
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button onClick={reportReview} disabled={!reportReason}>
                        Signaler
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {review.response && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Réponse du restaurant :</p>
                  <p className="text-sm text-gray-700">{review.response}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm">
                <button
                  onClick={() => markHelpful(review.id, true)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Utile ({review.helpful})</span>
                </button>
                <button
                  onClick={() => markHelpful(review.id, false)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>Pas utile</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>Répondre</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
