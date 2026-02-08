export const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "products", icon: "🛍️", label: "Products" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "inventory", icon: "📋", label: "Inventory" },
  { id: "reviews", icon: "⭐", label: "Reviews" },
  { id: "coupons", icon: "🎫", label: "Coupons" },
  { id: "reports", icon: "📈", label: "Reports" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export const DEFAULT_DATA = {
  products: [
    {
      id: '1',
      name: "Classic Tee",
      price: 599,
      discountPrice: 0,
      countInStock: 40,
      sku: "AP-TEE-001",
      category: "Clothing",
      brand: "Aaryan Prints",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White"],
      collections: "Summer Collection",
      material: "Cotton",
      gender: "Men",
      description: "Comfort cotton tee",
      images: [
        {
          url: "https://placehold.co/400x400",
          altText: "Classic Tee"
        }
      ],
      isFeatured: true,
      isPublished: true,
      tags: ["casual", "cotton", "basic"],
      rating: 4.5,
      numReviews: 10,
      weight: 0.2,
      dimensions: {
        length: 70,
        width: 50,
        height: 1
      },
      enabled: true,
    },
  ],
  orders: [
    {
      id: '101',
      date: new Date().toISOString().slice(0, 10),
      customerId: 1,
      total: 1198,
      status: "pending",
      items: [{ productId: '1', qty: 2, price: 599 }],
    },
    {
      id: '102',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      customerId: 2,
      total: 2499,
      status: "shipped",
      items: [{ productId: '2', qty: 1, price: 2499 }],
    },
  ],
  customers: [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543210",
      address: "123 Main Street, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      notes: "Preferred customer, likes premium products",
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 8765432109",
      address: "456 Oak Avenue, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      notes: "Frequent buyer, interested in new arrivals",
      createdAt: "2024-02-20",
      status: "active"
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 7654321098",
      address: "789 Park Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      notes: "Bulk order customer",
      createdAt: "2024-03-10",
      status: "inactive"
    }
  ],
  reviews: [
    {
      id: "1",
      productId: "1",
      customerName: "Rahul Sharma",
      rating: 5,
      comment: "Excellent quality and perfect fit! Will definitely buy again.",
      date: "2024-09-15",
      status: "published"
    },
    {
      id: "2",
      productId: "2",
      customerName: "Priya Patel",
      rating: 4,
      comment: "Good jacket but runs a bit large. Quality is great though.",
      date: "2024-09-18",
      status: "published"
    },
    {
      id: "3",
      productId: "1",
      customerName: "Amit Kumar",
      rating: 3,
      comment: "Average product. The fabric could be better.",
      date: "2024-09-20",
      status: "pending"
    }
  ],
  coupons: [],
};
