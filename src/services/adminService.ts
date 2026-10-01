import { ApiResponse, Order, OrderStatus, Product, User } from '../types/microservices';
import { apiBus, createSuccessResponse, simulateLatency } from './apiBus';
import { orderService } from './orderService';
import { productService } from './productService';
import { userService } from './userService';

export interface AdminMetrics {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalSales: number;
  pendingOrdersCount: number;
  lowStockCount: number;
}

class AdminService {
  // GET /admin/metrics
  public async getDashboardMetrics(): Promise<ApiResponse<AdminMetrics>> {
    const start = performance.now();
    await simulateLatency(40, 80);
    const duration = Math.round(performance.now() - start);

    const [prodRes, orderRes, userRes] = await Promise.all([
      productService.getProducts(),
      orderService.getAllOrders(),
      userService.getAllUsers()
    ]);

    const products = prodRes.data || [];
    const orders = orderRes.data || [];
    const users = userRes.data || [];

    const totalSales = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.pricing.total, 0);

    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    const metrics: AdminMetrics = {
      totalProducts: products.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalSales: Math.round(totalSales * 100) / 100,
      pendingOrdersCount,
      lowStockCount
    };

    const res = createSuccessResponse('Admin', metrics, 200);
    apiBus.logCall('Admin', 'GET', '/admin/metrics', 200, duration, null, metrics);
    return res;
  }

  // Delegated product operations
  public async addProduct(data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    return productService.createProduct(data);
  }

  public async editProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    return productService.updateProduct(id, updates);
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    return productService.deleteProduct(id);
  }

  public async updateStock(id: string, stock: number): Promise<ApiResponse<Product>> {
    return productService.updateStock(id, stock);
  }

  // Delegated order operations
  public async getOrders(): Promise<ApiResponse<Order[]>> {
    return orderService.getAllOrders();
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    return orderService.updateOrderStatus(id, status);
  }

  public async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    return orderService.cancelOrder(id);
  }

  // Delegated user operations
  public async getUsers(): Promise<ApiResponse<User[]>> {
    return userService.getAllUsers();
  }
}

export const adminService = new AdminService();
