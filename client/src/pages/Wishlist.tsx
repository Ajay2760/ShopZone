import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import type { WishlistItem, Product } from "@shared/schema";
import { useState } from "react";

export default function Wishlist() {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/wishlist/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
  });

  const moveToCartMutation = useMutation({
    mutationFn: async ({ wishlistId, productId }: { wishlistId: string; productId: string }) => {
      await apiRequest("POST", "/api/cart", { productId, quantity: 1 });
      await apiRequest("DELETE", `/api/wishlist/${wishlistId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Moved to cart",
        description: "Item has been added to your cart.",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your wishlist
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

  const wishlistWithProducts = wishlistItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is WishlistItem & { product: Product } => item !== null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-96" />
            ))}
          </div>
        ) : wishlistWithProducts.length === 0 ? (
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-4">
                Save your favorite items for later!
              </p>
              <Button onClick={() => navigate("/")} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistWithProducts.map((item) => (
              <Card key={item.id} className="group overflow-hidden" data-testid={`wishlist-item-${item.product.id}`}>
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeItemMutation.mutate(item.id)}
                      data-testid={`button-remove-${item.product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
                      <p className="text-xl font-bold mt-2">
                        ₹{item.product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() =>
                        moveToCartMutation.mutate({
                          wishlistId: item.id,
                          productId: item.product.id,
                        })
                      }
                      disabled={item.product.stock === 0 || moveToCartMutation.isPending}
                      data-testid={`button-move-to-cart-${item.product.id}`}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {item.product.stock === 0 ? "Out of Stock" : "Move to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
