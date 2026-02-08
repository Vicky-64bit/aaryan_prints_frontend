import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ProductGrid from '../products/ProductGrid';

const similarProducts = [
  {
    id: 1,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+1',
    offer: 'Flat 50%',
    title: 'FOREVER GLAM',
    description: 'Cream Tone-tone Slingback Pointed Heel Sandals',
    price: '₹ 1899',
  },
  {
    id: 2,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+2',
    offer: 'Flat 50%',
    title: 'AJILE',
    description: 'White Striped Johnny Polo Cropped Rugby Top',
    price: '₹ 1199',
  },
  {
    id: 3,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+3',
    offer: 'Flat 50%',
    title: 'RANGMANCH',
    description: 'Purple Foil Print A-line Peplum Kurta',
    price: '₹ 1299',
  },
  {
    id: 4,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+4',
    offer: 'Flat 50%',
    title: 'RANGMANCH',
    description: 'Beige Watercolour Floral Print A-line Kurta',
    price: '₹ 1299',
  },
  {
    id: 5,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+5',
    offer: 'Flat 50%',
    title: 'MARIGOLD LANE',
    description: 'Yellow Wall Print Layered Collar A-line Kurta',
    price: '₹ 1699',
  },
  {
    id: 6,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+6',
    offer: 'Flat 50%',
    title: 'RANGMANCH',
    description: 'Pink Floral Print Flared Dress',
    price: '₹ 1499',
  },
  {
    id: 7,
    image: 'https://placehold.co/400x500/E5E7EB/1F2937?text=Product+7',
    offer: 'Flat 50%',
    title: 'FOREVER GLAM',
    description: 'Black Suede Pointed Toe Heels',
    price: '₹ 1999',
  },
];

const productsInBag = [
  {
    id: 1,
    image: 'https://placehold.co/300x400/E8DED1/000000?text=Shirt',
    name: 'Medium Grey Solid Casual Full Sleeves Mandarin Collar Men Slim Fit Casual Shirts',
    price: 1199,
    size: '40',
    quantity: 1,
  },
];

const BagPage = () => {
  const [items, setItems] = useState(productsInBag);

  const bagTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCharge = bagTotal >= 1000 ? 0 : 100;
  const totalPayableAmount = bagTotal + shippingCharge;

  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleCheckout = () => {
    navigate("/checkout");
  }
  
  return (
    <div className="bg-gray-100 rounded-2xl mt-26 mb-4 min-h-screen p-4 sm:p-8">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto mb-4 text-sm text-gray-500">
        My Bag
      </nav>

      {/* Free Shipping Alert */}
      <div className="max-w-7xl mx-auto p-3 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md mb-6 md:flex md:justify-center">
        Your order is eligible for free shipping.
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Product List Section */}
        <div className="md:col-span-2">
          {/* Items Header */}
          <div className="hidden md:flex justify-between items-center bg-white px-6 py-4 rounded-t-lg mb-4 shadow-sm">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.066l-6.95 7.942a.75.75 0 01-1.293 0l-4.15-4.5a.75.75 0 011.088-1.004l3.52 3.84L16.204 4.29A.75.75 0 0116.704 4.153z" clipRule="evenodd" />
              </svg>
              <span>{items.length} / {items.length} ITEMS SELECTED</span>
            </div>
            <div className="flex space-x-4 text-gray-500">
              <button className="flex items-center text-gray-500 hover:text-gray-700">
                {/* Heart Icon from react-icons/fa */}
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={() => removeItem(items[0].id)}>
                {/* Trash Icon from react-icons/fa */}
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a24 24 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 284.2l12.8 184.4c1.5 20.2 18.2 35.8 38.6 35.8h232.8c20.3 0 37.1-15.6 38.6-35.8l12.8-184.4H53.2z"></path></svg>
              </button>
            </div>
          </div>

          {/* Product Card */}
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 sm:p-6 mb-4 rounded-lg md:rounded-b-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex items-center h-5 mr-3">
                  <input id={`item-${item.id}`} type="checkbox" checked={true} readOnly className="form-checkbox text-orange-500 h-4 w-4 rounded" />
                </div>
                <div className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40 bg-gray-200 rounded-md overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 ml-4 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-gray-900 font-medium text-sm md:text-base">PEOPLE</h3>
                    <p className="mt-1 text-gray-600 text-xs md:text-sm">{item.name}</p>
                    <p className="mt-1 text-gray-900 font-semibold text-sm md:text-base">₹{item.price}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between space-x-2 md:space-x-4">
                    <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-600">
                      <span>Size:</span>
                      <select className="border border-gray-300 rounded-md p-1 focus:ring-orange-500 focus:border-orange-500">
                        <option>40</option>
                        <option>42</option>
                        <option>44</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-600">
                      <span>Qty:</span>
                      <select 
                        className="border border-gray-300 rounded-md p-1 focus:ring-orange-500 focus:border-orange-500"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      >
                        {[...Array(5).keys()].map(i => <option key={i+1}>{i+1}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center ml-auto space-y-2">
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                    {/* Trash Icon from react-icons/fa */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a24 24 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 284.2l12.8 184.4c1.5 20.2 18.2 35.8 38.6 35.8h232.8c20.3 0 37.1-15.6 38.6-35.8l12.8-184.4H53.2z"></path></svg>
                  </button>
                  <button className="text-gray-400 hover:text-pink-500">
                    {/* Heart Icon from react-icons/fa */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
                  </button>
                  <button onClick={() => removeItem(item.id)} className="md:hidden text-gray-500 hover:text-red-500">
                    {/* Trash Icon from react-icons/fa */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a24 24 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 284.2l12.8 184.4c1.5 20.2 18.2 35.8 38.6 35.8h232.8c20.3 0 37.1-15.6 38.6-35.8l12.8-184.4H53.2z"></path></svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 md:hidden flex justify-end">
                <button className="text-sm font-medium text-orange-500 hover:text-orange-600">
                  MOVE TO WISHLIST
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="hidden md:flex flex-col items-center mb-6">
            <div className="p-3 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md text-center">
              All India <span className="font-bold">FREE</span> shipping on orders above ₹1000
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary ({items.length} Item)</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Bag Total</span>
              <span>₹{bagTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-orange-500">
              <span>Coupons</span>
              <span className="cursor-pointer hover:underline">LOGIN/REGISTER TO APPLY COUPON</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping Charges*</span>
              <span className="text-green-500">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total Payable Amount</span>
              <span>₹{totalPayableAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">(including tax)</p>
            <button onClick={handleCheckout} className="w-full py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold transition-colors duration-200">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
      <div>

      </div>
     <div className="mt-20 w-[90%] mx-auto flex flex-col ">
            <h2 className="text-2xl text-center font-medium mb-4">
                Trending Now
            </h2>
            
            <ProductGrid products={ similarProducts }/>
            </div>
    </div>
    
  );
};

export default BagPage;
