"use client"

import { useState } from "react"
import { Search, MapPin, Star, Clock, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"

// Mock data étendu pour les restaurants
const allRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Italien",
    rating: 4.5,
    reviewCount: 234,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Pizzas authentiques et pâtes fraîches",
    location: "Centre-ville, Casablanca",
    distance: 1.2,
    priceRange: "250 MAD",
    isOpen: true,
    deliveryFee: 25,
    minOrder: 150,
    tags: ["Pizza", "Italien", "Livraison rapide"],
    promotions: ["Livraison gratuite dès 25€"],
  },
  {
    id: 2,
    name: "Burger House",
    cuisine: "Américain",
    rating: 4.2,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Burgers gourmets et frites maison",
    location: "Ain Diab",
    distance: 2.1,
    priceRange: "300 MAD",
    isOpen: true,
    deliveryFee: 30,
    minOrder: 120,
    tags: ["Burger", "Américain", "Frites"],
    promotions: [],
  },
  {
    id: 3,
    name: "Sushi Zen",
    cuisine: "Japonais",
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: "30-40 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Sushi frais et cuisine japonaise traditionnelle",
    location: "Centre-ville, Casablanca",
    distance: 0.8,
    priceRange: "450 MAD",
    isOpen: false,
    deliveryFee: 40,
    minOrder: 200,
    tags: ["Sushi", "Japonais", "Poisson frais"],
    promotions: ["20% sur la première commande"],
  },
  {
    id: 4,
    name: "Tajine d'Or",
    cuisine: "Marocain",
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: "35-45 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Cuisine marocaine authentique",
    location: "Maarif",
    distance: 3.2,
    priceRange: "280 MAD",
    isOpen: true,
    deliveryFee: 20,
    minOrder: 180,
    tags: ["Marocain", "Tajine", "Couscous"],
    promotions: [],
  },
  {
    id: 5,
    name: "Le Bistrot Français",
    cuisine: "Français",
    rating: 4.4,
    reviewCount: 278,
    deliveryTime: "40-50 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Cuisine française traditionnelle",
    location: "Centre-ville, Casablanca",
    distance: 1.5,
    priceRange: "500 MAD",
    isOpen: true,
    deliveryFee: 35,
    minOrder: 250,
    tags: ["Français", "Traditionnel", "Gastronomie"],
    promotions: ["Menu du jour à -15%"],
  },
  {
    id: 6,
    name: "Taco Loco",
    cuisine: "Mexicain",
    rating: 4.1,
    reviewCount: 145,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Tacos et cuisine mexicaine épicée",
    location: "Ain Diab",
    distance: 2.8,
    priceRange: "180 MAD",
    isOpen: true,
    deliveryFee: 25,
    minOrder: 100,
    tags: ["Mexicain", "Tacos", "Épicé"],
    promotions: ["2 tacos achetés = 1 offert"],
  },
  {
    id: 7,
    name: "Dragon d'Asie",
    cuisine: "Chinois",
    rating: 4.3,
    reviewCount: 203,
    deliveryTime: "30-40 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Cuisine chinoise authentique et dim sum",
    location: "Bourgogne",
    distance: 2.5,
    priceRange: "320 MAD",
    isOpen: true,
    deliveryFee: 30,
    minOrder: 150,
    tags: ["Chinois", "Dim Sum", "Nouilles"],
    promotions: [],
  },
  {
    id: 8,
    name: "Healthy Bowl",
    cuisine: "Healthy",
    rating: 4.7,
    reviewCount: 167,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Bowls healthy et cuisine végétarienne",
    location: "Centre-ville, Casablanca",
    distance: 1.0,
    priceRange: "290 MAD",
    isOpen: true,
    deliveryFee: 20,
    minOrder: 120,
    tags: ["Healthy", "Végétarien", "Bio"],
    promotions: ["Livraison gratuite dès 20€"],
  },
]

const cuisineTypes = [
  "Tous",
  "Italien",
  "Américain",
  "Japonais",
  "Marocain",
  "Français",
  "Mexicain",
  "Chinois",
  "Healthy",
]
const locations = ["Toutes zones", "Centre-ville, Casablanca", "Ain Diab", "Maarif", "Bourgogne"]
const priceRanges = ["Tous prix", "€", "€€", "€€€"]

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("Tous")
  const [selectedLocation, setSelectedLocation] = useState("Toutes zones")
  const [selectedPriceRange, setSelectedPriceRange] = useState("Tous prix")
  const [sortBy, setSortBy] = useState("rating")
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState([5])
  const [minRating, setMinRating] = useState([0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRestaurants = allRestaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCuisine = selectedCuisine === "Tous" || restaurant.cuisine === selectedCuisine
      const matchesLocation = selectedLocation === "Toutes zones" || restaurant.location === selectedLocation
      const matchesPriceRange = selectedPriceRange === "Tous prix" || restaurant.priceRange === selectedPriceRange
      const matchesOpenStatus = !showOpenOnly || restaurant.isOpen
      const matchesPromotions = !showPromotionsOnly || restaurant.promotions.length > 0
      const matchesDistance = restaurant.distance <= maxDistance[0]
      const matchesRating = restaurant.rating >= minRating[0]

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesLocation &&
        matchesPriceRange &&
        matchesOpenStatus &&
        matchesPromotions &&
        matchesDistance &&
        matchesRating
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "distance":
          return a.distance - b.distance
        case "deliveryTime":
          return Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
        case "deliveryFee":
          return a.deliveryFee - b.deliveryFee
        default:
          return 0
      }
    })

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCuisine("Tous")
    setSelectedLocation("Toutes zones")
    setSelectedPriceRange("Tous prix")
    setSortBy("rating")
    setShowOpenOnly(false)
    setShowPromotionsOnly(false)
    setMaxDistance([5])
    setMinRating([0])
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" onSearch={(query) => setSearchQuery(query)} />

      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tous les restaurants</h1>
          <p className="text-gray-600 mb-6">Découvrez {allRestaurants.length} restaurants près de chez vous</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un restaurant, une cuisine ou un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filtres</span>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Réinitialiser
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cuisine Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type de cuisine</Label>
                  <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Zone</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gamme de prix</Label>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Distance maximale: {maxDistance[0]} km</Label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Note minimale: {minRating[0]} étoiles</Label>
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="openOnly" checked={showOpenOnly} onCheckedChange={setShowOpenOnly} />
                    <Label htmlFor="openOnly" className="text-sm">
                      Restaurants ouverts uniquement
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotionsOnly"
                      checked={showPromotionsOnly}
                      onCheckedChange={setShowPromotionsOnly}
                    />
                    <Label htmlFor="promotionsOnly" className="text-sm">
                      Avec promotions uniquement
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                    <SheetDescription>Affinez votre recherche de restaurants</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Same filters as desktop but in mobile sheet */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type de cuisine</Label>
                      <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Zone</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Gamme de prix</Label>
                      <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priceRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="openOnlyMobile" checked={showOpenOnly} onCheckedChange={setShowOpenOnly} />
                        <Label htmlFor="openOnlyMobile" className="text-sm">
                          Restaurants ouverts uniquement
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="promotionsOnlyMobile"
                          checked={showPromotionsOnly}
                          onCheckedChange={setShowPromotionsOnly}
                        />
                        <Label htmlFor="promotionsOnlyMobile" className="text-sm">
                          Avec promotions uniquement
                        </Label>
                      </div>
                    </div>

                    <Button onClick={resetFilters} variant="outline" className="w-full">
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="deliveryTime">Temps de livraison</SelectItem>
                  <SelectItem value="deliveryFee">Frais de livraison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? "s" : ""} trouvé
                {filteredRestaurants.length > 1 ? "s" : ""}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="deliveryTime">Temps de livraison</SelectItem>
                  <SelectItem value="deliveryFee">Frais de livraison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Restaurants Grid */}
            {filteredRestaurants.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun restaurant trouvé</h3>
                  <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                  <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="relative">
                        <Image
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!restaurant.isOpen && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                            <span className="text-white font-semibold">Fermé</span>
                          </div>
                        )}
                        <Badge variant={restaurant.isOpen ? "default" : "secondary"} className="absolute top-2 right-2">
                          {restaurant.isOpen ? "Ouvert" : "Fermé"}
                        </Badge>
                        {restaurant.promotions.length > 0 && (
                          <Badge variant="destructive" className="absolute top-2 left-2 bg-red-500">
                            Promo
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{restaurant.rating}</span>
                            <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                          </div>
                        </div>
                        <CardDescription>{restaurant.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Promotions */}
                          {restaurant.promotions.length > 0 && (
                            <div className="space-y-1">
                              {restaurant.promotions.map((promo, index) => (
                                <p key={index} className="text-xs text-red-600 font-medium">
                                  🎉 {promo}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {restaurant.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Info Row 1 */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {restaurant.location} • {restaurant.distance}km
                              </span>
                            </div>
                            <span className="font-medium">{restaurant.priceRange}</span>
                          </div>

                          {/* Info Row 2 */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{restaurant.deliveryTime}</span>
                            </div>
                            <span>Livraison: {restaurant.deliveryFee.toFixed(2)}€</span>
                          </div>

                          {/* Min Order */}
                          <div className="text-xs text-gray-500">Commande minimum: {restaurant.minOrder}€</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
