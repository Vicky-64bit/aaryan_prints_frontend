import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { updateUser } from "../redux/slice/authSlice"; // ✅ our new thunk

const AccountAndInformation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Populate local state with Redux user data
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.firstName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Dispatch Redux thunk to update user
      const resultAction = await dispatch(updateUser(userData));
      if (updateUser.fulfilled.match(resultAction)) {
        toast.success("Details updated successfully!", { duration: 1000 });
        setIsEditing(false);
      } else {
        throw new Error(resultAction.payload || "Failed to update user");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user", { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    toast.info("Password change functionality is under development.", { duration: 2000 });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-4 md:mt-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Account & Information</h1>

      {/* Personal Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={userData.mobile}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Gender</label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg transition-colors duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="block text-sm font-medium text-gray-600">Name</p>
                <p className="w-full mt-1 p-2 bg-gray-100 rounded-md">{userData.name}</p>
              </div>
              <div>
                <p className="block text-sm font-medium text-gray-600">Email Address</p>
                <p className="w-full mt-1 p-2 bg-gray-100 rounded-md">{userData.email}</p>
              </div>
            </div>
            <div>
              <p className="block text-sm font-medium text-gray-600">Mobile Number</p>
              <p className="w-full mt-1 p-2 bg-gray-100 rounded-md">{userData.mobile}</p>
            </div>
            <div>
              <p className="block text-sm font-medium text-gray-600">Gender</p>
              <p className="w-full mt-1 p-2 bg-gray-100 rounded-md">{userData.gender}</p>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Password Management</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Change your password to keep your account secure.</p>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountAndInformation;
