import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, Category } from "@shared/schema";
import heroImage from "@assets/generated_images/E-commerce_hero_lifestyle_image_ff8fdd26.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Shop the latest products"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Discover Premium Products
            </h1>
            <p className="text-lg lg:text-xl text-white/90">
              Shop the latest electronics, fashion, and home essentials with free shipping on orders over ₹500
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="text-lg" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-shop-now">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-explore">
                Explore Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Our Products</h2>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} products available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-1">
                <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                {categories.slice(0, 5).map((category) => (
                  <TabsTrigger key={category.id} value={category.id} data-testid={`tab-${category.slug}`}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="stock">Stock Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-96" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Free Shipping</div>
              <p className="text-muted-foreground">On orders over ₹500</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Secure Checkout</div>
              <p className="text-muted-foreground">100% secure payment</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Easy Returns</div>
              <p className="text-muted-foreground">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
