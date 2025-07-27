'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, User, MapPin, Edit, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { Tabs } from '@/components/ui/tabs'
import { TabsContent } from '@/components/ui/tabs'
import { TabsList } from '@/components/ui/tabs'
import { TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@/components/ui/avatar'

import ModernHeader from '@/components/header/modern-header'
import Footer from '@/components/footer'

type Profile = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  createdAt: string
}
function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  )
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Échec du chargement du profil')
        const data = await res.json()
        if (!data.profile) throw new Error('Profil introuvable')
        setProfileData(data.profile)
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!profileData) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erreur lors de la mise à jour')
      }

      const updated = await res.json()
      setProfileData(updated.profile)
      setIsEditing(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !profileData) return <div className="p-10 text-red-600 text-center">{error || 'Erreur'}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader cartItemsCount={0} userLocation={profileData.city} />

      <section className="bg-white border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Image src="droovo-logo.png" alt="Droovo" width={140} height={40} className="h-8 w-auto" />
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                <AvatarFallback className="text-2xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-gray-600 mb-2">{profileData.email}</p>
              <div className="text-sm text-gray-500">
                Membre depuis {new Date(profileData.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
            <TabsTrigger value="personal">Informations</TabsTrigger>
            <TabsTrigger value="address">Adresse</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>Modifiez vos informations de base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => profileData && setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => profileData && setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => profileData && setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Adresse principale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={profileData.address || ''}
                    onChange={(e) => profileData && setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input
                    value={profileData.city || ''}
                    onChange={(e) => profileData && setProfileData({ ...profileData, city: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  )
}
