import React, { useState } from 'react';
import { toast } from 'sonner';

const wishlistData = [
    {
        id: 1,
        image: 'https://placehold.co/400x500/E8DED1/000000?text=Shirt',
        title: 'Medium Grey Solid Casual Full Sleeves Mandarin Collar Men Slim Fit Casual Shirts',
        price: 1199,
    },
    {
        id: 2,
        image: 'https://placehold.co/400x500/E8DED1/000000?text=Shirt',
        title: 'Dark Blue Slim Fit Casual Shirt',
        price: 1599,
    },
    {
        id: 3,
        image: 'https://placehold.co/400x500/E8DED1/000000?text=Shirt',
        title: 'Black & Grey Striped Slim Fit Shirt',
        price: 999,
    },
    {
        id: 4,
        image: 'https://placehold.co/400x500/E8DED1/000000?text=Shirt',
        title: 'White Polo T-Shirt',
        price: 799,
    },
    {
        id: 5,
        image: 'https://placehold.co/400x500/E8DED1/000000?text=Shirt',
        title: 'Olive Green Casual Jacket',
        price: 2499,
    },
];

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState(wishlistData);

    const removeItem = (id) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success("Item removed from wishlist.", { duration: 1000 });
    };

    const moveToBag = (id) => {
        const itemToMove = wishlistItems.find(item => item.id === id);
        if (itemToMove) {
            // Here you would add the item to the bag/cart state or database
            removeItem(id);
            toast.success("Item moved to bag!", { duration: 1000 });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">My Wishlist</h1>
            {wishlistItems.length > 0 ? (
                <div className="flex flex-col space-y-4">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start bg-white rounded-lg shadow-md overflow-hidden p-4">
                            <img src={item.image} alt={item.title} className="w-32 h-40 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4" />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-base font-semibold text-gray-800 truncate mb-1">{item.title}</h3>
                                <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
                                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={() => moveToBag(item.id)}
                                        className="w-full sm:w-auto py-2 px-4 rounded-md font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        MOVE TO BAG
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="w-full sm:w-auto py-2 px-4 rounded-md font-semibold text-sm border-2 border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-600 transition-colors duration-200"
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Your wishlist is empty.</p>
                    <p className="text-sm mt-2">Add items you love to your wishlist and they will appear here!</p>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
