"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock, TrendingUp, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import ModernHeader from "@/components/header/modern-header";
import RestaurantMap from "@/components/map/restaurant-map";
import WhatsAppNotification from "@/components/notifications/whatsapp-notification";

type Cuisine = {
  name: string;
};

type Restaurant = {
  id: string;
  restaurantName: string;
  cuisines: Cuisine[];
  averageRating: number;
  reviewCount: number;
  deliveryTime?: string;
  logo?: string;
  description?: string;
  city?: string;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
  promotion?: string | null;
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  // Charger cuisines depuis le backend
  useEffect(() => {
    async function fetchCuisines() {
      try {
        const res = await fetch("/api/cuisine");
        const data = await res.json();
        if (res.ok && data.success) {
          setCuisines(data.data);
        } else {
          setError("Erreur lors du chargement des cuisines");
        }
      } catch {
        setError("Erreur réseau lors du chargement des cuisines");
      }
    }
    fetchCuisines();
  }, []);

  // Charger restaurants selon searchQuery et selectedCuisine
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        if (selectedCuisine) params.append("cuisine", selectedCuisine);
        const res = await fetch(`/api/restaurants?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setRestaurants(data.restaurants || []);
        } else {
          setError(data.message || "Erreur lors du chargement des restaurants");
        }
      } catch {
        setError("Erreur réseau lors du chargement des restaurants");
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [searchQuery, selectedCuisine]);

  // Préparer restaurants pour la carte (limité à 5)
  const mapRestaurants = restaurants.slice(0, 5).map((r) => ({
    id: r.id,
    name: r.restaurantName,
    lat: r.latitude || 33.5731,
    lng: r.longitude || -7.5898,
    isOpen: r.isOpen,
    cuisine: r.cuisines?.[0]?.name || "Divers",
    rating: r.averageRating || 0,
    distance: 0,
    deliveryTime: r.deliveryTime || "30-40 min",
    image: r.logo || "/placeholder.svg",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" onSearch={setSearchQuery} />

      <WhatsAppNotification orderId="CMD-2024-001" status="confirmed" restaurantName="Pizza Casa" estimatedTime="25-35 min" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Savourez l'instant avec{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Droovo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez les meilleurs restaurants près de chez vous au Maroc et commandez en quelques clics. Livraison rapide, saveurs authentiques.
          </p>

          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <Input
              type="text"
              placeholder="Rechercher restaurants, plats, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:border-purple-500 focus:ring-purple-500"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl">
              Rechercher
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="outline" className="rounded-full border-2 hover:bg-purple-50 hover:border-purple-300" onClick={() => setShowMap(!showMap)}>
              <MapPin className="h-4 w-4 mr-2" />
              Voir sur la carte
            </Button>
            <Button variant="outline" className="rounded-full border-2 hover:bg-pink-50 hover:border-pink-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendances
            </Button>
            <Button variant="outline" className="rounded-full border-2 hover:bg-orange-50 hover:border-orange-300">
              <Zap className="h-4 w-4 mr-2" />
              Livraison rapide
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RestaurantMap restaurants={mapRestaurants} onRestaurantSelect={() => {}} userLocation={{ lat: 33.5731, lng: -7.5898 }} />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorez par cuisine</h2>
            <p className="text-gray-600">Découvrez une variété de saveurs du Maroc et du monde entier</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 ml-16">
            {cuisines.length === 0 && !error && <p>Chargement des cuisines...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {cuisines.map((cuisine) => (
              <Link key={cuisine.name} href={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-purple-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">🍽️</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{cuisine.name}</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">Voir les restaurants</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurants populaires</h2>
            <p className="text-gray-600">Les favoris de nos clients à Casablanca</p>
          </div>

          {loading && <p>Chargement des restaurants...</p>}
          {!loading && error && <p className="text-red-500 mb-8">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-0 shadow-lg">
                  <div className="relative">
                    <Image src={restaurant.logo || "/placeholder.svg"} alt={restaurant.restaurantName} width={300} height={200} className="w-full h-48 object-cover" />
                    <div className="absolute top-4 right-4">
                      <Badge variant={restaurant.isOpen ? "default" : "secondary"} className="bg-white/90 text-gray-900">
                        {restaurant.isOpen ? "Ouvert" : "Fermé"}
                      </Badge>
                    </div>
                    {restaurant.promotion && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="destructive" className="w-full justify-center bg-red-500">
                          🎉 {restaurant.promotion}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{restaurant.restaurantName}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "N/A"}</span>
                        <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600">{restaurant.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.deliveryTime || "30-40 min"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{restaurant.city || "Casablanca"}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {restaurant.cuisines?.[0]?.name || ""}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/restaurants">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-8">
                Voir tous les restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir Droovo ?</h2>
            <p className="text-gray-600">Une expérience de commande unique et moderne au Maroc</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livraison ultra-rapide</h3>
                <p className="text-gray-600">Recevez vos plats en 30 minutes maximum grâce à notre réseau optimisé</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Géolocalisation précise</h3>
                <p className="text-gray-600">Trouvez les restaurants les plus proches avec notre système de carte intégré</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualité garantie</h3>
                <p className="text-gray-600">Restaurants sélectionnés et notés par notre communauté de gourmets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
