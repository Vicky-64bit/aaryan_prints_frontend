import React, { useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri"; 
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slice/cartSlice";


const CartContent = ({cart, userId, guestId}) => {
 
  const dispatch = useDispatch();
  const handleAddToCart = (productId, delta, quantity, size, color)=>{
    const newQuantity = quantity + delta;
    if(newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      )
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({productId, guestId, userId, size, color}))
  }


  return (
    <div className="space-y-4">
      {cart.products.length > 0 ? (
        cart.products.map((product) => (
          <div
            key={product.productId}
            className="flex p-3 bg-white border border-gray-100 rounded-xl shadow-sm transition duration-150 hover:shadow-md"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded-lg"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x96/f3f4f6/57534e?text=ITEM"; }}
            />

            {/* Product Details & Controls */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
              {/* Name, Price, and Delete Button Row */}
              <div className="flex justify-between items-start">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-medium capitalize">
                    Size: {product.size} | Color: {product.color}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  className="p-1 flex-shrink-0 text-gray-400 hover:text-red-600 transition duration-150"
                  aria-label={`Remove ${product.name} from cart`}
                  onClick={() => {
                      handleRemoveFromCart(product.productId, product.size, product.color)
                    }}
                >
                  <RiDeleteBin3Line className="w-5 h-5" />
                </button>
              </div>

              {/* Quantity Controls and Unit Price */}
              <div className="flex justify-between items-end mt-2">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-0.5">
                  <button
                    className="w-7 h-7 flex items-center justify-center text-lg font-medium text-gray-600 hover:text-white hover:bg-orange-600 rounded-full transition duration-150"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={() => {
                      handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }}
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-gray-800 w-4 text-center">
                    {product.quantity}
                  </span>
                  <button
                    className="w-7 h-7 flex items-center justify-center text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-full transition duration-150 shadow-md"
                    aria-label={`Increase quantity of ${product.name}`}
                    onClick={() => {
                      handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Total Price for this item */}
                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold text-orange-600">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 italic mt-1">
                    ({Number(product.price).toFixed(2)})
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium">Your cart is empty.</p>
          <p className="text-sm mt-1">Time to fill it up with some style!</p>
        </div>
      )}
    </div>
  );
};

export default CartContent;
