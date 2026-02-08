import React, { useState, useMemo } from 'react';
import { useStorage } from './hooks/useStorage';
import { DEFAULT_DATA } from './utils/constants';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { calculateTotalStock, formatCurrency } from './utils/helper';

const InventoryManagement = () => {
  const [data, setData] = useStorage("admin_data_v1", DEFAULT_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  const products = data.products || [];

  // Enhanced inventory data with stock calculations
  const inventoryData = useMemo(() => {
    return products.map(product => {
      const totalStock = calculateTotalStock(product.stock);
      const stockValue = totalStock * product.price;
      const lowStock = totalStock <= 5;
      const outOfStock = totalStock === 0;

      return {
        ...product,
        totalStock,
        stockValue,
        lowStock,
        outOfStock,
        stockStatus: outOfStock ? 'out' : lowStock ? 'low' : 'healthy'
      };
    });
  }, [products]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventoryData;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.id?.toString().includes(query)
      );
    }

    // Stock status filter
    if (stockFilter !== "all") {
      filtered = filtered.filter(item => item.stockStatus === stockFilter);
    }

    return filtered;
  }, [inventoryData, searchQuery, stockFilter]);

  // Inventory statistics
  const inventoryStats = useMemo(() => {
    const totalProducts = inventoryData.length;
    const lowStockItems = inventoryData.filter(item => item.lowStock && !item.outOfStock).length;
    const outOfStockItems = inventoryData.filter(item => item.outOfStock).length;
    const totalStockValue = inventoryData.reduce((sum, item) => sum + item.stockValue, 0);
    const healthyStockItems = totalProducts - lowStockItems - outOfStockItems;

    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      healthyStockItems,
      totalStockValue
    };
  }, [inventoryData]);

  // Update stock
  const handleUpdateStock = (productId, newStock) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    }));
    setShowStockModal(false);
    setSelectedProduct(null);
  };

  // Quick stock actions
  const handleQuickRestock = (productId, size, quantity) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          const currentStock = p.stock || {};
          return {
            ...p,
            stock: {
              ...currentStock,
              [size]: (currentStock[size] || 0) + quantity
            }
          };
        }
        return p;
      })
    }));
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600 mt-1">
            Real-time stock tracking and management
          </p>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{inventoryStats.totalProducts}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{inventoryStats.healthyStockItems}</div>
          <div className="text-sm text-gray-600">In Stock</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </Card>
      </div>

      {/* Total Stock Value */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="text-center">
          <div className="text-sm opacity-90">Total Inventory Value</div>
          <div className="text-3xl font-bold mt-1">
            {formatCurrency(inventoryStats.totalStockValue)}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Stock</option>
          <option value="healthy">Healthy Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Inventory List */}
      {filteredInventory.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No inventory items found
          </h3>
          <p className="text-gray-600">
            {searchQuery || stockFilter !== "all" 
              ? "Try adjusting your filters" 
              : "No products in inventory"
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInventory.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              onUpdateStock={() => {
                setSelectedProduct(item);
                setShowStockModal(true);
              }}
              onQuickRestock={handleQuickRestock}
            />
          ))}
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onSave={handleUpdateStock}
          onClose={() => {
            setShowStockModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </section>
  );
};

// Inventory Item Component
const InventoryItem = ({ item, onUpdateStock, onQuickRestock }) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Product Info */}
        <div className="flex items-start gap-4 flex-1">
          <img
            src={item.images?.[0] || "/placeholder-image.jpg"}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iMzIiIHk9IjMyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhYSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <div className="text-sm text-gray-600 mb-2">
              {item.category} • {formatCurrency(item.price)}
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(item.stock || {}).map(([size, quantity]) => (
                <div
                  key={size}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    quantity === 0
                      ? 'bg-red-100 text-red-800'
                      : quantity <= 2
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {size}: {quantity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${
              item.outOfStock ? 'text-red-600' :
              item.lowStock ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {item.totalStock}
            </div>
            <div className="text-xs text-gray-600">Total Stock</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(item.stockValue)}
            </div>
            <div className="text-xs text-gray-600">Stock Value</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={onUpdateStock}
            className="text-xs"
          >
            Update Stock
          </Button>
          <Button
            variant="success"
            onClick={() => onQuickRestock(item.id, Object.keys(item.stock || {})[0], 10)}
            className="text-xs"
          >
            +10
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Stock Update Modal Component
const StockUpdateModal = ({ product, onSave, onClose }) => {
  const [stockData, setStockData] = useState({ ...product.stock });

  const handleSave = () => {
    onSave(product.id, stockData);
  };

  const handleQuantityChange = (size, quantity) => {
    setStockData(prev => ({
      ...prev,
      [size]: Math.max(0, parseInt(quantity) || 0)
    }));
  };

  const addNewSize = () => {
    const newSize = prompt("Enter new size (e.g., S, M, L, XL):");
    if (newSize && !stockData[newSize]) {
      setStockData(prev => ({
        ...prev,
        [newSize]: 0
      }));
    }
  };

  const removeSize = (size) => {
    if (Object.keys(stockData).length > 1) {
      const newStockData = { ...stockData };
      delete newStockData[size];
      setStockData(newStockData);
    } else {
      alert("Cannot remove the last size variant.");
    }
  };

  return (
    <Modal title={`Update Stock - ${product.title}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Current stock levels for {product.title}
        </div>

        <div className="space-y-3">
          {Object.entries(stockData).map(([size, quantity]) => (
            <div key={size} className="flex items-center gap-3">
              <div className="w-16 font-medium text-gray-700">{size}</div>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(size, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <Button
                variant="danger"
                onClick={() => removeSize(size)}
                className="text-xs"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={addNewSize}
          className="w-full"
        >
          + Add New Size
        </Button>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Update Stock
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryManagement;