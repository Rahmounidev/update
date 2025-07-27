"use client"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  distance: number
  lat: number
  lng: number
  isOpen: boolean
  deliveryTime: string
  image: string
}

interface RestaurantMapProps {
  restaurants: Restaurant[]
  onRestaurantSelect: (restaurant: Restaurant) => void
  userLocation?: { lat: number; lng: number }
}

export default function RestaurantMap({ restaurants, onRestaurantSelect, userLocation }: RestaurantMapProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [maxDistance, setMaxDistance] = useState([5])
  const [userPos, setUserPos] = useState(userLocation || { lat: 48.8566, lng: 2.3522 }) // Paris par défaut
  const [isLocating, setIsLocating] = useState(false)

  const getCurrentLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocating(false)
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setIsLocating(false)
        },
      )
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredRestaurants = restaurants
    .map((restaurant) => ({
      ...restaurant,
      distance: calculateDistance(userPos.lat, userPos.lng, restaurant.lat, restaurant.lng),
    }))
    .filter((restaurant) => restaurant.distance <= maxDistance[0])
    .sort((a, b) => a.distance - b.distance)

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Restaurants près de vous</span>
            </span>
            <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={isLocating}>
              <Navigation className="h-4 w-4 mr-2" />
              {isLocating ? "Localisation..." : "Me localiser"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Distance maximale: {maxDistance[0]} km</Label>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                max={20}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? "s" : ""} trouvé
              {filteredRestaurants.length > 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96 rounded-lg overflow-hidden">
            
            <div className="absolute inset-0 bg-gray-100 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100"></div>
            </div>

            
            <div
              className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>

            
            {filteredRestaurants.slice(0, 10).map((restaurant, index) => {
              const angle = (index * 360) / Math.min(filteredRestaurants.length, 10)
              const radius = Math.min(restaurant.distance * 30, 120)
              const x = 50 + (radius * Math.cos((angle * Math.PI) / 180)) / 4
              const y = 50 + (radius * Math.sin((angle * Math.PI) / 180)) / 4

              return (
                <div
                  key={restaurant.id}
                  className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                    restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                  } ${selectedRestaurant?.id === restaurant.id ? "ring-4 ring-orange-400" : ""}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() => {
                    setSelectedRestaurant(restaurant)
                    onRestaurantSelect(restaurant)
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    {restaurant.name.charAt(0)}
                  </div>
                </div>
              )
            })}

           
            {[1, 3, 5].map((distance) => (
              <div
                key={distance}
                className="absolute border border-gray-300 border-dashed rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${distance * 60}px`,
                  height: `${distance * 60}px`,
                }}
              >
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-xs text-gray-500 bg-white px-1 rounded">
                  {distance}km
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRestaurant?.id === restaurant.id ? "ring-2 ring-orange-400" : ""
            }`}
            onClick={() => {
              setSelectedRestaurant(restaurant)
              onRestaurantSelect(restaurant)
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                  {restaurant.isOpen ? "Ouvert" : "Fermé"}
                </Badge>
              </div>
              <CardDescription>{restaurant.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{restaurant.distance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span>{restaurant.rating}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Livraison: {restaurant.deliveryTime}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
