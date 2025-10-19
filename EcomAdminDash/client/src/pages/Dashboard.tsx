import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Package, Heart, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { Order, WishlistItem, CartItem, Address } from "@shared/schema";
import { useState } from "react";

export default function Dashboard() {
  const { user, signInWithGoogle } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: wishlistItems = [] } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
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
              <h2 className="text-2xl font-bold mb-2">Sign in to view your dashboard</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your dashboard
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

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.displayName}!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-elevate cursor-pointer" onClick={() => navigate("/orders")} data-testid="card-orders">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => navigate("/wishlist")} data-testid="card-wishlist">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="text-3xl font-bold">{wishlistItems.length}</p>
                </div>
                <Heart className="h-12 w-12 text-destructive opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => navigate("/cart")} data-testid="card-cart">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                  <p className="text-3xl font-bold">{cartItems.length}</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-chart-1 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-total-spent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold">₹{totalSpent.toLocaleString("en-IN")}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-chart-3/20 flex items-center justify-center">
                  <span className="text-2xl">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-md hover-elevate cursor-pointer"
                      onClick={() => navigate("/orders")}
                    >
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total.toLocaleString("en-IN")}</p>
                        <p className="text-sm text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <Button variant="outline" className="w-full" onClick={() => navigate("/orders")} data-testid="button-view-all-orders">
                      View All Orders
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No saved addresses</p>
              ) : (
                <div className="space-y-4">
                  {addresses.slice(0, 3).map((address) => (
                    <div key={address.id} className="p-3 border rounded-md">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
