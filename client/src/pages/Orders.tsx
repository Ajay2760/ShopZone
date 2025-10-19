import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Package, MapPin } from "lucide-react";
import type { Order, Address } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Orders() {
  const { user, signInWithGoogle } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: addresses = [] } = useQuery<Address[]>({
    queryKey: ["/api/addresses"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sign in to view your orders</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your order history
              </p>
              <Button onClick={signInWithGoogle} data-testid="button-signin">
                Sign In with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "On Process":
        return "bg-chart-2 text-chart-2-foreground";
      case "Shipped":
        return "bg-chart-1 text-chart-1-foreground";
      case "Delivered":
        return "bg-chart-3 text-chart-3-foreground";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-4">
                Start shopping to see your orders here!
              </p>
              <Button onClick={() => navigate("/")} data-testid="button-start-shopping">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => {
                const address = addresses.find((a) => a.id === order.addressId);
                return (
                  <Card key={order.id} data-testid={`order-${order.id}`}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <Badge className={getStatusVariant(order.status)} data-testid={`status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.productName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity}
                                  </p>
                                  <p className="text-sm font-semibold mt-1">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Delivery Address
                          </h4>
                          {address ? (
                            <div className="text-sm space-y-1">
                              <p className="font-medium">{address.name}</p>
                              <p className="text-muted-foreground">{address.phone}</p>
                              <p>
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p>
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Address not available</p>
                          )}

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>₹{order.total.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
