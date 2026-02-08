import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import Button from './Button';

// Redux Actions
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../../redux/slice/adminOrderSlice';
import { fetchAdminProducts } from '../../redux/slice/adminProductSlice';

const OrderManagementPage = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const { orders, loading: ordersLoading } = useSelector(state => state.adminOrders);
  const { products, loading: productsLoading } = useSelector(state => state.adminProducts);

  const [filters, setFilters] = useState({ orderStatus: "all" });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data on component mount - only once
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        console.log('Starting to load order data...');
        await Promise.all([
          dispatch(fetchAllOrders()),
          dispatch(fetchAdminProducts())
        ]);
        
        if (isMounted) {
          console.log('Order data loaded successfully');
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading order data:', error);
        if (isMounted) {
          setDataLoaded(true);
        }
      }
    };

    if (!dataLoaded && orders.length === 0) {
      loadData();
    } else {
      setDataLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, dataLoaded, orders.length]);

  // Simple loading logic
  const loading = !dataLoaded && (ordersLoading || productsLoading) && orders.length === 0;

  // Update order status using Redux
  const handleUpdateOrderStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  // Delete order using Redux
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  // Find product by product ID - using productId from orderItems
  const findProduct = (productId) => {
    return products.find(product => product._id === productId);
  };

  const printInvoice = (order) => {
    const win = window.open("", "_blank", "width=800,height=600");
    
    const itemsHtml = order.orderItems
      .map((item) => {
        return `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.quantity * item.price}</td>
          </tr>
        `;
      })
      .join("");
    
    win.document.write(`
      <html>
        <head>
          <title>Invoice #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            h1 { color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Invoice #${order._id.slice(-8).toUpperCase()}</h1>
            <div>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div class="order-info">
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Customer:</strong> ${order.user.firstName} ${order.user.lastName || ''}</p>
            <p><strong>Email:</strong> ${order.user.email}</p>
            <p><strong>Phone:</strong> ${order.user.mobile}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td>₹${order.totalPrice}</td>
              </tr>
            </tfoot>
          </table>

          <div class="order-info" style="margin-top: 30px;">
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
            <p>${order.shippingAddress.country}</p>
          </div>

          <div class="order-info">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            ${order.isPaid ? `<p><strong>Paid At:</strong> ${new Date(order.paidAt).toLocaleDateString()}</p>` : ''}
          </div>

          ${order.isDelivered ? `
          <div class="order-info">
            <h3>Delivery Information</h3>
            <p><strong>Delivered At:</strong> ${new Date(order.deliveredAt).toLocaleDateString()}</p>
          </div>
          ` : ''}

          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for your business!</p>
            <p>Aaryan Prints</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const filteredOrders = orders?.filter(o =>
    filters.orderStatus === "all" ? true : o.status === filters.orderStatus
  ) || [];

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status options based on actual order statuses in the system
  const getStatusOptions = () => {
    const allStatuses = [...new Set(orders.map(order => order.status))];
    const defaultOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    // Combine unique statuses from orders with default options
    const uniqueStatuses = [...new Set([...allStatuses, ...defaultOptions])];
    return uniqueStatuses;
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="text-sm text-gray-600">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={filters.orderStatus}
          onChange={(e) => setFilters(f => ({ ...f, orderStatus: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          {getStatusOptions().map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {filters.orderStatus === "all" 
                  ? "No orders have been placed yet" 
                  : `No ${filters.orderStatus} orders found`
                }
              </p>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {formatDate(order.createdAt)}</div>
                      <div>
                        Customer: {order.user.firstName} {order.user.lastName || ''}
                      </div>
                      <div>Email: {order.user.email}</div>
                      <div>Phone: {order.user.mobile}</div>
                      <div className="font-medium text-gray-900">
                        Total: ₹{order.totalPrice}
                      </div>
                      <div>
                        Payment: {order.paymentMethod} • {order.paymentStatus}
                        {order.isPaid && ` • Paid on ${formatDate(order.paidAt)}`}
                      </div>
                      <div>
                        Items: {order.orderItems?.length || 0} product{order.orderItems?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {getStatusOptions().map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    
                    <Button
                      variant="default"
                      onClick={() => printInvoice(order)}
                      className="flex items-center gap-2 text-xs"
                    >
                      📄 Invoice
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iMTYiIHk9IjE2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FhIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                              }}
                            />
                            <span className="text-gray-600">
                              {item.name} × {item.quantity}
                            </span>
                          </div>
                          <span className="text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default OrderManagementPage;