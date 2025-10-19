import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Order, OrderStatus } from "@shared/schema";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/all"],
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders/all"] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage all orders and their status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-lg h-20" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No orders to manage yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Order ID</th>
                      <th className="text-left p-4 font-semibold">Customer</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Items</th>
                      <th className="text-right p-4 font-semibold">Total</th>
                      <th className="text-center p-4 font-semibold">Status</th>
                      <th className="text-center p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50" data-testid={`admin-order-${order.id}`}>
                          <td className="p-4">
                            <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{order.userId.slice(0, 8)}...</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{order.items.length} items</span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold">
                              ₹{order.total.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge className={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Select
                              value={order.status}
                              onValueChange={(value: OrderStatus) =>
                                updateOrderStatusMutation.mutate({ orderId: order.id, status: value })
                              }
                            >
                              <SelectTrigger className="w-[150px]" data-testid={`select-status-${order.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="On Process">On Process</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{orders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">On Process</p>
                <p className="text-4xl font-bold mt-2 text-chart-2">
                  {orders.filter((o) => o.status === "On Process").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-4xl font-bold mt-2 text-chart-3">
                  {orders.filter((o) => o.status === "Delivered").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
