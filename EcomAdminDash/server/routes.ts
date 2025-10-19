import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateUser, type AuthRequest } from "./middleware/auth";
import {
  insertCartItemSchema,
  insertWishlistItemSchema,
  insertOrderSchema,
  insertAddressSchema,
  orderStatusSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/cart", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const items = await storage.getCartItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const data = insertCartItemSchema.parse({ ...req.body, userId });
      
      const product = await storage.getProduct(data.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      if (product.stock === 0) {
        return res.status(400).json({ error: "Product is out of stock" });
      }
      
      if (product.stock < data.quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      const item = await storage.createCartItem(data);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.userId!;

      const cartItem = await storage.getCartItem(id);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (cartItem.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const product = await storage.getProduct(cartItem.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (quantity > product.stock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      const updated = await storage.updateCartItem(id, quantity);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const cartItem = await storage.getCartItem(id);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (cartItem.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.deleteCartItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cart item" });
    }
  });

  app.get("/api/wishlist", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const items = await storage.getWishlistItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const data = insertWishlistItemSchema.parse({ ...req.body, userId });
      
      const product = await storage.getProduct(data.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      if (product.stock === 0) {
        return res.status(400).json({ error: "Cannot add out of stock items to wishlist" });
      }

      const item = await storage.createWishlistItem(data);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add item to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const wishlistItem = await storage.getWishlistItem(id);
      if (!wishlistItem) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }

      if (wishlistItem.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.deleteWishlistItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete wishlist item" });
    }
  });

  app.get("/api/orders", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/all", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all orders" });
    }
  });

  app.post("/api/orders", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const data = insertOrderSchema.parse({ ...req.body, userId });

      for (const item of data.items) {
        const product = await storage.getProduct(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${item.productName}` 
          });
        }
      }

      for (const item of data.items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.updateProduct(item.productId, {
            stock: product.stock - item.quantity,
          });
        }
      }

      const order = await storage.createOrder(data);
      
      await storage.clearCart(userId);

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validatedStatus = orderStatusSchema.parse(status);
      const order = await storage.updateOrderStatus(id, validatedStatus);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update order status" });
    }
  });

  app.get("/api/addresses", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const addresses = await storage.getAddresses(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  app.post("/api/addresses", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const data = insertAddressSchema.parse({ ...req.body, userId });
      const address = await storage.createAddress(data);
      res.json(address);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create address" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
