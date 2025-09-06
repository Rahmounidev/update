"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WhatsAppNotificationProps {
  orderId: string;
}

export default function WhatsAppNotification({ orderId }: WhatsAppNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  
  const fetchOrderStatus = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération de la commande");

      const data = await res.json();

      const newNotification = {
        id: Date.now(),
        orderId: data.orderId,
        status: data.status.toLowerCase(), 
        restaurantName: data.restaurantName,
        estimatedTime: data.estimatedTime,
        timestamp: new Date().toLocaleTimeString(),
        message: getStatusMessage(data.status.toLowerCase(), data.orderId, data.restaurantName, data.estimatedTime),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 2)]);
      setIsVisible(true);
    } catch (err) {
      console.error("❌ Erreur récupération commande:", err);
    }
  }

  useEffect(() => {
    fetchOrderStatus(); 
    const interval = setInterval(fetchOrderStatus, 10000); 
    return () => clearInterval(interval);
  }, [orderId]);


  const getStatusMessage = (status: string, orderId: string, restaurantName: string, estimatedTime?: string) => {
    switch (status) {
      case "confirmed":
        return `✅ Votre commande #${orderId} chez ${restaurantName} a été confirmée !`;
      case "preparing":
        return `👨‍🍳 Votre commande #${orderId} est en préparation. Temps estimé : ${estimatedTime}`;
      case "ready":
        return `🎉 Votre commande #${orderId} est prête ! Vous pouvez venir la récupérer.`;
      case "delivered":
        return `✨ Votre commande #${orderId} a été livrée avec succès ! Bon appétit !`;
      default:
        return `📱 Mise à jour de votre commande #${orderId}`;
    }
  };

  // --- Icônes  ---
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "preparing":
        return "👨‍🍳";
      case "ready":
        return "🎉";
      case "delivered":
        return "✨";
      default:
        return "📱";
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="bg-green-50 border-green-200 shadow-lg animate-in slide-in-from-right"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <Badge variant="outline" className="text-green-700 border-green-300">
                  WhatsApp
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{getStatusIcon(notification.status)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
