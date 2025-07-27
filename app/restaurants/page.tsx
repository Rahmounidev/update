"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Star, Clock, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"

type Restaurant = {
  id: string
  restaurantName: string
  name: string
  description: string
  logo: string | null
  city: string
  address: string
  phone: string
  hours: string
  isOpen: boolean
  minimumOrder: number
  deliveryRadius: number
  customMessage: string | null
  cuisine: { name: string }[]
  promotions: { name: string }[]
  reviews: { rating: number }[]
  dishes: {
    id: string
    name: string
    price: number
    image: string | null
  }[]
}

export default function RestaurantsPage() {
  const searchParams = useSearchParams()!
  
  const cuisineFromUrl = searchParams.get("cuisine") || "Tous"

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineFromUrl)
  const [cuisines, setCuisines] = useState<string[]>(["Tous"])
  const [selectedLocation, setSelectedLocation] = useState("Toutes zones")
  const [selectedPriceRange, setSelectedPriceRange] = useState("Tous prix")
  const [sortBy, setSortBy] = useState("rating")
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState([5])
  const [minRating, setMinRating] = useState([0])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    async function fetchCuisines() {
      try {
        const res = await fetch("/api/cuisine")
        const json = await res.json()
        if (json.success && json.data) {
          setCuisines(["Tous", ...json.data.map((c: { name: string }) => c.name)])
        }
      } catch (error) {
        console.error("Erreur fetch cuisines:", error)
      }
    }
    fetchCuisines()
  }, [])

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const params = new URLSearchParams()

        if (searchTerm.trim()) params.append("search", searchTerm.trim())
       
        if (selectedCuisine && selectedCuisine !== "Tous") {
          params.append("cuisine", selectedCuisine)
        }

        if (showOpenOnly) params.append("isOpen", "true")
        if (minRating[0] > 0) params.append("minRating", minRating[0].toString())
        if (showPromotionsOnly) params.append("promotionsOnly", "true")

        console.log("Fetch restaurants with params:", params.toString())
        const response = await fetch(`/api/restaurants?${params.toString()}`)
        const data = await response.json()
        setRestaurants(data.restaurants || [])
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      }
    }
    fetchRestaurants()
  }, [
    searchTerm,
    selectedCuisine,
    showOpenOnly,
    showPromotionsOnly,
    minRating,
  ])

  useEffect(() => {
    if (cuisineFromUrl !== selectedCuisine) {
      setSelectedCuisine(cuisineFromUrl)
    }
  }, [cuisineFromUrl])


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

  // Filtrage frontend additionnel 
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.some((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesCuisine =
        selectedCuisine === "Tous" ||
        restaurant.cuisine.some((c) => c.name === selectedCuisine)


      const matchesOpenStatus = !showOpenOnly || restaurant.isOpen
      const matchesPromotions =
        !showPromotionsOnly || restaurant.promotions.length > 0

      const avgRating =
        restaurant.reviews.length > 0
          ? restaurant.reviews.reduce((acc, r) => acc + r.rating, 0) /
            restaurant.reviews.length
          : 0
      const matchesRating = avgRating >= minRating[0]

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesOpenStatus &&
        matchesPromotions &&
        matchesRating
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          const avgA =
            a.reviews.length > 0
              ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
              : 0
          const avgB =
            b.reviews.length > 0
              ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
              : 0
          return avgB - avgA
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <ModernHeader
        cartItemsCount={0}
        userLocation="Casablanca, Maroc"
        onSearch={(query) => setSearchTerm(query)}
      />

      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tous les restaurants</h1>
          <p className="text-gray-600 mb-6">
            Découvrez {filteredRestaurants.length} restaurants près de chez vous
          </p>

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

          {/* Sidebar Filters */}
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
                      {cuisines.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

               
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="openOnly"
                      checked={showOpenOnly}
                      onCheckedChange={(checked) => setShowOpenOnly(checked === true)}
                    />
                    <Label htmlFor="openOnly" className="text-sm">
                      Restaurants ouverts uniquement
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotionsOnly"
                      checked={showPromotionsOnly}
                      onCheckedChange={(checked) => setShowPromotionsOnly(checked === true)}
                    />
                    <Label htmlFor="promotionsOnly" className="text-sm">
                      Avec promotions uniquement
                    </Label>
                  </div>
                </div>

                
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
              </CardContent>
            </Card>
          </div>

         
          <div className="flex-1">
           
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
                    {/* Cuisine Filter Mobile */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type de cuisine</Label>
                      <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisines.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                   
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="openOnlyMobile"
                          checked={showOpenOnly}
                          onCheckedChange={(checked) => setShowOpenOnly(checked === true)}
                        />
                        <Label htmlFor="openOnlyMobile" className="text-sm">
                          Restaurants ouverts uniquement
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="promotionsOnlyMobile"
                          checked={showPromotionsOnly}
                          onCheckedChange={(checked) => setShowPromotionsOnly(checked === true)}
                        />
                        <Label htmlFor="promotionsOnlyMobile" className="text-sm">
                          Avec promotions uniquement
                        </Label>
                      </div>
                    </div>

                   
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
                  
                </SelectContent>
              </Select>
            </div>

            
            {filteredRestaurants.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun restaurant trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche
                  </p>
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
                          src={restaurant.logo || "/placeholder.svg"}
                          alt={restaurant.restaurantName}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge
                          variant={restaurant.isOpen ? "default" : "secondary"}
                          className="absolute top-2 right-2"
                        >
                          {restaurant.isOpen ? "Ouvert" : "Fermé"}
                        </Badge>
                        {restaurant.promotions.length > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 left-2 bg-red-500"
                          >
                            Promo
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{restaurant.restaurantName}</CardTitle>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {restaurant.reviews.length > 0
                                ? (
                                    restaurant.reviews.reduce(
                                      (acc, r) => acc + r.rating,
                                      0
                                    ) / restaurant.reviews.length
                                  ).toFixed(1)
                                : "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({restaurant.reviews.length})
                            </span>
                          </div>
                        </div>
                        <CardDescription>{restaurant.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Dishes */}
                          <div className="flex flex-wrap gap-2">
                            {restaurant.dishes.map((dish) => (
                              <Badge key={dish.id} variant="outline" className="text-xs">
                                {dish.name} - {dish.price.toFixed(2)}€
                              </Badge>
                            ))}
                          </div>
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
