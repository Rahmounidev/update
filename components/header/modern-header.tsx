"use client"

import React, { useState, useEffect } from "react"
import { Search, MapPin, ShoppingCart, User, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import LoyaltyBadge from "@/components/loyalty/loyalty-badge"

interface SessionUser {
  id: string
  name?: string
  email?: string
  role?: string
  userType: "user" | "customer"
  points?: number
  totalEarned?: number
}

interface ModernHeaderProps {
  cartItemsCount?: number
  userLocation?: string
  onLocationChange?: (location: string) => void
  onSearch?: (query: string) => void
}

export default function ModernHeader({
  cartItemsCount = 0,
  userLocation = "Casablanca, Maroc",
  onLocationChange,
  onSearch,
}: ModernHeaderProps) {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session")
        if (res.ok) {
          const data = await res.json()
          setSessionUser(data)
        } else {
          setSessionUser(null)
        }
      } catch {
        setSessionUser(null)
      } finally {
        setLoading(false)
      }
    }

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications/count")
        if (res.ok) {
          const data = await res.json()
          setNotificationCount(data.count || 0)
        }
      } catch (error) {
        console.error("Erreur de récupération des notifications :", error)
      }
    }

    fetchSession()
    fetchNotifications()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    setSessionUser(null)
    window.location.href = "/"
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative transition-all duration-300">
              <Image
                src="/droovo-logo.png"
                alt="Droovo"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </Link>

          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isScrolled ? "text-gray-400" : "text-white/70"
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Rechercher restaurants, plats, cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full transition-all duration-300 ${
                    isScrolled
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      : "bg-white/20 border-white/30 text-white placeholder-white/70 backdrop-blur-sm"
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Location & Actions */}
          <div className="flex items-center space-x-4">
            {/* Location - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <MapPin className={`h-4 w-4 ${isScrolled ? "text-gray-600" : "text-white"}`} />
              <span className={`text-sm font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                {userLocation}
              </span>
            </div>

            {/* Loyalty Points - Desktop */}
            <div className="hidden lg:flex">
              <LoyaltyBadge size="sm" />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className={`relative ${
                isScrolled
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white hover:text-white hover:bg-white/20"
              }`}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${
                  isScrolled
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white hover:text-white hover:bg-white/20"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-orange-500 text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    isScrolled
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white hover:text-white hover:bg-white/20"
                  }`}
                >
                  <User className="h-5 w-5" />
                  {sessionUser?.name && (
                    <span className="ml-2 hidden sm:inline text-sm font-medium">{sessionUser.name}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sessionUser ? (
                  <>
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Mes commandes</Link>
                    </DropdownMenuItem>
                
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>Se déconnecter</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Se connecter</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">S'inscrire</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden ${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-white"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
                />
              </form>

              {/* Mobile Location */}
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{userLocation}</span>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block py-2 text-white hover:text-orange-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/restaurants"
                  className="block py-2 text-white hover:text-orange-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  href="/orders"
                  className="block py-2 text-white hover:text-orange-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mes commandes
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
