import React, { useState } from 'react';
import { toast } from 'sonner';

const initialAddresses = [
    {
        id: 1,
        name: 'VICKY',
        addressLine1: '1/1, Kirodi Kund',
        addressLine2: 'Jhunjhunu, Rajasthan',
        pincode: '333307',
        mobile: '6378141023',
    },
    {
        id: 2,
        name: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Jaipur, Rajasthan',
        pincode: '302001',
        mobile: '9876543210',
    },
];

const Addresses = () => {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [showForm, setShowForm] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success("Address deleted successfully!", { duration: 1000 });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newAddress = {
            name: formData.get('name'),
            addressLine1: formData.get('addressLine1'),
            addressLine2: formData.get('addressLine2'),
            pincode: formData.get('pincode'),
            mobile: formData.get('mobile'),
        };

        if (currentAddress) {
            setAddresses(addresses.map(addr => addr.id === currentAddress.id ? { ...newAddress, id: currentAddress.id } : addr));
            toast.success("Address updated successfully!", { duration: 1000 });
        } else {
            setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
            toast.success("Address added successfully!", { duration: 1000 });
        }
        setShowForm(false);
        setCurrentAddress(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 mt-4 md:mt-0">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Addresses</h1>
                <button
                    onClick={() => { setShowForm(true); setCurrentAddress(null); }}
                    className="px-4 py-2 rounded-md font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
                >
                    Add New Address
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentAddress ? "Edit Address" : "Add New Address"}</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="name" placeholder="Name" defaultValue={currentAddress?.name} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="text" name="mobile" placeholder="Mobile" defaultValue={currentAddress?.mobile} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="text" name="addressLine1" placeholder="Address Line 1" defaultValue={currentAddress?.addressLine1} required className="w-full p-3 border rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="text" name="addressLine2" placeholder="Address Line 2" defaultValue={currentAddress?.addressLine2} className="w-full p-3 border rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="text" name="pincode" placeholder="Pincode" defaultValue={currentAddress?.pincode} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button type="button" onClick={() => { setShowForm(false); setCurrentAddress(null); }} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                                Cancel
                            </button>
                            <button type="submit" className="px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                                {currentAddress ? "Update Address" : "Save Address"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <div key={address.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <p className="font-semibold text-lg text-gray-800">{address.name}</p>
                                <p className="text-gray-600">{address.addressLine1}</p>
                                <p className="text-gray-600">{address.addressLine2}</p>
                                <p className="text-gray-600">
                                    {address.pincode}
                                </p>
                                <p className="font-medium text-gray-700 mt-2">Mobile: {address.mobile}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button onClick={() => handleEdit(address)} className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors duration-200">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => handleDelete(address.id)} className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors duration-200">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <p>No addresses found. Add a new address to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Addresses;
