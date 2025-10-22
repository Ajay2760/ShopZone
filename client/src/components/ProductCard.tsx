import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const isOutOfStock = product.stock === 0;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        await signInWithGoogle();
        return;
      }
      return apiRequest("POST", "/api/cart", { productId: product.id, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCartAndGoMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        await signInWithGoogle();
        return;
      }
      return apiRequest("POST", "/api/cart", { productId: product.id, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      navigate("/cart");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {discount}% OFF
              </Badge>
            )}
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            ) : product.stock < 10 ? (
              <Badge className="bg-chart-2 text-chart-2-foreground text-xs">
                Low Stock ({product.stock})
              </Badge>
            ) : (
              <Badge className="bg-chart-3 text-chart-3-foreground text-xs">
                In Stock ({product.stock})
              </Badge>
            )}
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={() => addToCartAndGoMutation.mutate()}
            disabled={isOutOfStock || addToCartAndGoMutation.isPending}
            aria-label="Add to cart"
            title="Add to cart"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-2" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {product.description}
            </p>
          </div>

          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!)
                        ? "fill-chart-2 text-chart-2"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold" data-testid={`text-price-${product.id}`}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <Button
            className="w-full"
            onClick={() => addToCartMutation.mutate()}
            disabled={isOutOfStock || addToCartMutation.isPending}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
