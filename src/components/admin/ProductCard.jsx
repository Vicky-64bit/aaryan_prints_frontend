import React from 'react';
import Card from './Card';
import Button from './Button';
import { calculateTotalStock } from './utils/helper';

const ProductCard = ({ product, onEdit, onToggle, onDelete }) => {
  // Use countInStock instead of calculating from stock object
  const totalStock = product.countInStock || 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={product.images?.[0]?.url || "/placeholder-image.jpg"}
          alt={product.images?.[0]?.altText || product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhYSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
          }}
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            product.enabled
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.enabled ? "Active" : "Inactive"}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {product.name} {/* Changed from title to name */}
            </h3>
            <div className="text-sm text-gray-600 mb-1">
              {product.category} • ₹{product.price}
              {product.discountPrice > 0 && (
                <span className="ml-2 text-red-600 line-through">
                  ₹{product.discountPrice}
                </span>
              )}
            </div>
            <div
              className={`text-sm font-medium ${
                totalStock <= 5 ? "text-red-600" : "text-gray-600"
              }`}
            >
              Stock: {totalStock}
            </div>
            {product.isFeatured && (
              <div className="text-xs text-orange-600 font-medium mt-1">
                ⭐ Featured
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button variant="default" onClick={onEdit} className="flex-1 min-w-[60px]">
            Edit
          </Button>
          <Button variant="ghost" onClick={onToggle} className="flex-1 min-w-[80px]">
            {product.enabled ? "Disable" : "Enable"}
          </Button>
          <Button variant="danger" onClick={onDelete} className="flex-1 min-w-[70px]">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;