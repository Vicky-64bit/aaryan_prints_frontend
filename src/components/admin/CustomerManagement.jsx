import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';

// Redux Actions
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/slice/adminSlice';
import { fetchAllOrders } from '../../redux/slice/adminOrderSlice';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const { users, loading: usersLoading } = useSelector(state => state.admin);
  const { orders, loading: ordersLoading } = useSelector(state => state.adminOrders);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUsers()),
          dispatch(fetchAllOrders())
        ]);
        
        if (isMounted) {
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        if (isMounted) {
          setDataLoaded(true);
        }
      }
    };

    if (!dataLoaded && users.length === 0) {
      loadData();
    } else {
      setDataLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, dataLoaded, users.length]);

  // Calculate customer stats based on actual order structure
  const customersWithStats = useMemo(() => {
    if (!users.length) return [];
    
    return users.map(customer => {
      // Find orders for this customer using user._id
      const customerOrders = orders.filter(order => order.user._id === customer._id);
      const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const orderCount = customerOrders.length;
      
      // Get the most recent order
      const lastOrder = customerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
      // Calculate average order value
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

      return {
        ...customer,
        totalSpent,
        orderCount,
        averageOrderValue,
        lastOrder: lastOrder ? {
          date: new Date(lastOrder.createdAt).toISOString().slice(0, 10),
          amount: lastOrder.totalPrice,
          status: lastOrder.status
        } : null,
        customerSince: customer.createdAt ? new Date(customer.createdAt).toISOString().slice(0, 10) : 'Unknown',
        // Add address information if available
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || customer.postalCode || ''
      };
    });
  }, [users, orders]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customersWithStats;

    const query = searchQuery.toLowerCase();
    return customersWithStats.filter(customer =>
      customer.firstName?.toLowerCase().includes(query) ||
      customer.lastName?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.mobile?.includes(query) ||
      customer._id?.toString().includes(query) ||
      customer.address?.toLowerCase().includes(query) ||
      customer.city?.toLowerCase().includes(query)
    );
  }, [customersWithStats, searchQuery]);

  // Add new customer
  const handleAddCustomer = () => {
    setSelectedCustomer({ mode: "create" });
    setShowCustomerModal(true);
  };

  // Edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer({ mode: "edit", customer });
    setShowCustomerModal(true);
  };

  // Save customer
  const handleSaveCustomer = (customerData) => {
    if (selectedCustomer.mode === "create") {
      dispatch(addUser(customerData));
    } else {
      dispatch(updateUser({
        id: selectedCustomer.customer._id,
        ...customerData
      }));
    }
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  // Toggle customer status
  const handleToggleStatus = (customerId) => {
    const customer = users.find(c => c._id === customerId);
    if (customer) {
      dispatch(updateUser({
        id: customerId,
        status: customer.status === 'active' ? 'inactive' : 'active'
      }));
    }
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      dispatch(deleteUser(customerId));
    }
  };

  // View customer details
  const handleViewDetails = (customer) => {
    setSelectedCustomer({ mode: "view", customer });
    setShowCustomerModal(true);
  };

  const loading = !dataLoaded && (usersLoading || ordersLoading) && users.length === 0;

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalCustomers = users.length;
    const activeCustomers = users.filter(c => c.status === 'active').length;
    const totalRevenue = customersWithStats.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalOrders = customersWithStats.reduce((sum, customer) => sum + customer.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      totalOrders,
      avgOrderValue
    };
  }, [users, customersWithStats]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600 mt-1">
            {filteredCustomers.length} of {users.length} customers
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button
          variant="success"
          onClick={handleAddCustomer}
          className="flex items-center gap-2"
        >
          <span>+</span>
          Add Customer
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{overallStats.totalCustomers}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{overallStats.activeCustomers}</div>
          <div className="text-sm text-gray-600">Active Customers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{overallStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">₹{overallStats.totalRevenue}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </Card>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search customers by name, email, mobile, address, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading customers...</span>
        </div>
      ) : (
        <>
          {/* Customers Grid */}
          {filteredCustomers.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No customers found" : "No customers yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first customer"}
              </p>
              {!searchQuery && (
                <Button variant="success" onClick={handleAddCustomer}>
                  Add Your First Customer
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onEdit={() => handleEditCustomer(customer)}
                  onViewDetails={() => handleViewDetails(customer)}
                  onToggleStatus={() => handleToggleStatus(customer._id)}
                  onDelete={() => handleDeleteCustomer(customer._id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
        <Modal
          title={
            selectedCustomer.mode === "create" ? "Add New Customer" :
            selectedCustomer.mode === "edit" ? "Edit Customer" :
            "Customer Details"
          }
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomer(null);
          }}
          size={selectedCustomer.mode === "view" ? "lg" : "md"}
        >
          <CustomerForm
            customer={selectedCustomer.customer}
            mode={selectedCustomer.mode}
            onSave={handleSaveCustomer}
            onCancel={() => {
              setShowCustomerModal(false);
              setSelectedCustomer(null);
            }}
          />
        </Modal>
      )}
    </section>
  );
};

// Customer Card Component
const CustomerCard = ({ customer, onEdit, onViewDetails, onToggleStatus, onDelete }) => {
  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {fullName}
            </h3>
            <div className="text-sm text-gray-600 mb-2">
              {customer.email}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                customer.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {customer.status || 'active'}
            </span>
            {customer.role === 'admin' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>{customer.mobile}</span>
          </div>
          {customer.gender && (
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>{customer.gender}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>🆔</span>
            <span>ID: {customer._id?.slice(-6)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Since: {customer.customerSince}</span>
          </div>
          {customer.city && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{customer.city}, {customer.state}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{customer.orderCount}</div>
            <div className="text-xs text-gray-600">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">₹{customer.totalSpent}</div>
            <div className="text-xs text-gray-600">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {customer.orderCount > 0 ? `₹${Math.round(customer.averageOrderValue)}` : '0'}
            </div>
            <div className="text-xs text-gray-600">Avg Order</div>
          </div>
        </div>

        {/* Last Order Info */}
        {customer.lastOrder && (
          <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-blue-800">
              <div className="font-medium">Last Order: {customer.lastOrder.date}</div>
              <div>Amount: ₹{customer.lastOrder.amount} • Status: {customer.lastOrder.status}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="default"
            onClick={onViewDetails}
            className="flex-1 min-w-[60px] text-xs"
          >
            View
          </Button>
          <Button
            variant="default"
            onClick={onEdit}
            className="flex-1 min-w-[60px] text-xs"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={onToggleStatus}
            className="flex-1 min-w-[80px] text-xs"
          >
            {customer.status === 'active' ? 'Disable' : 'Enable'}
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            className="flex-1 min-w-[70px] text-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Customer Form Component
const CustomerForm = ({ customer, mode, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    mobile: customer?.mobile || '',
    email: customer?.email || '',
    password: customer?.password || '',
    gender: customer?.gender || 'Male',
    role: customer?.role || 'customer',
    address: customer?.address || customer?.shippingAddress?.address || '',
    city: customer?.city || customer?.shippingAddress?.city || '',
    state: customer?.state || customer?.shippingAddress?.state || '',
    pincode: customer?.pincode || customer?.postalCode || customer?.shippingAddress?.postalCode || '',
    country: customer?.country || customer?.shippingAddress?.country || 'India',
    notes: customer?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (mode === "create" && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
          Personal Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
          Contact Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            disabled={isViewMode}
            placeholder="10-digit mobile number"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {isCreateMode && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required={isCreateMode}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={isViewMode}
              placeholder="Minimum 6 characters"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>
        )}
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
          Address Information
        </h3>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={isViewMode}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            disabled={isViewMode}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Any additional notes about the customer..."
          />
        </div>
      </div>

      {!isViewMode && (
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="success">
            {isCreateMode ? "Create Customer" : "Update Customer"}
          </Button>
        </div>
      )}

      {isViewMode && (
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="default" onClick={onCancel}>
            Close
          </Button>
        </div>
      )}
    </form>
  );
};

export default CustomerManagement;