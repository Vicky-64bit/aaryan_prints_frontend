import React, { useMemo, useState } from 'react';
import { useStorage } from './hooks/useStorage';
import { DEFAULT_DATA } from './utils/constants';
import Card from './Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatDate } from './utils/helper';

const ReportsAnalytics = () => {
  const [data] = useStorage("admin_data_v1", DEFAULT_DATA);
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("sales");

  const orders = data.orders || [];
  const products = data.products || [];
  const customers = data.customers || [];
  const reviews = data.reviews || [];

  // Date range calculation
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return { startDate, endDate };
  };

  // Sales Report Data
  const salesReportData = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    return Array.from({ length: daysDiff }).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().slice(0, 10);
      
      const dayOrders = orders.filter(o => o.date === dateKey);
      const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const orderCount = dayOrders.length;
      const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

      return {
        date: dateKey,
        displayDate: new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }).format(date),
        revenue,
        orderCount,
        averageOrderValue
      };
    });
  }, [orders, dateRange]);

  // Product Performance Data
  const productPerformanceData = useMemo(() => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.qty;
        productSales[item.productId].revenue += item.qty * item.price;
      });
    });

    return Object.values(productSales)
      .map(ps => {
        const product = products.find(p => p.id === ps.productId) || {};
        return {
          ...ps,
          productName: product.title || 'Unknown',
          category: product.category
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [orders, products]);

  // Customer Analytics Data
  const customerAnalyticsData = useMemo(() => {
    const customerStats = customers.map(customer => {
      const customerOrders = orders.filter(o => o.customerId === customer.id);
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const orderCount = customerOrders.length;
      const lastOrder = customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      return {
        ...customer,
        totalSpent,
        orderCount,
        lastOrder: lastOrder?.date,
        averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0
      };
    });

    return customerStats.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
  }, [customers, orders]);

  // Category Sales Data
  const categorySalesData = useMemo(() => {
    const categorySales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const category = product.category || 'Uncategorized';
          if (!categorySales[category]) {
            categorySales[category] = 0;
          }
          categorySales[category] += item.qty * item.price;
        }
      });
    });

    return Object.entries(categorySales).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders, products]);

  // Key Metrics
  const keyMetrics = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    const periodOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const totalRevenue = periodOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = periodOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const newCustomers = customers.filter(c => {
      const custDate = new Date(c.createdAt);
      return custDate >= startDate && custDate <= endDate;
    }).length;

    const previousPeriodStart = new Date(startDate);
    const previousPeriodEnd = new Date(endDate);
    const periodLength = (endDate - startDate) / (1000 * 60 * 60 * 24);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodLength);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - periodLength);

    const previousPeriodOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= previousPeriodStart && orderDate <= previousPeriodEnd;
    });

    const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : totalRevenue > 0 ? 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      newCustomers,
      revenueGrowth
    };
  }, [orders, customers, dateRange]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sales">Sales Report</option>
            <option value="products">Product Performance</option>
            <option value="customers">Customer Analytics</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(keyMetrics.totalRevenue)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className={`text-xs ${keyMetrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {keyMetrics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(keyMetrics.revenueGrowth).toFixed(1)}%
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{keyMetrics.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(keyMetrics.averageOrderValue)}
          </div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">{keyMetrics.newCustomers}</div>
          <div className="text-sm text-gray-600">New Customers</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="p-6 col-span-2">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Sales Trend - {dateRange.replace('days', ' Days').replace('1year', '1 Year')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Top Performing Products
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="productName" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Sales by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">
          Top Customers by Spending
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-right py-3 px-4">Total Orders</th>
                <th className="text-right py-3 px-4">Total Spent</th>
                <th className="text-right py-3 px-4">Avg Order Value</th>
                <th className="text-left py-3 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customerAnalyticsData.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{customer.name}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="text-right py-3 px-4">{customer.orderCount}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(customer.totalSpent)}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(customer.averageOrderValue)}</td>
                  <td className="py-3 px-4">{customer.lastOrder || 'No orders'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default ReportsAnalytics;