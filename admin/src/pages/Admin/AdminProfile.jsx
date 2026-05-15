import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Default admin icon component
  const AdminIcon = ({ className = "w-32 h-32" }) => (
    <div className={`${className} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-600`}>
      <svg 
        className="w-1/2 h-1/2 text-white" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
      </svg>
    </div>
  );

  const getAdminProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(backendUrl + '/api/admin/profile', {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        setAdminData(data.admin);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Admin profile error:", error);
      toast.error(error.response?.data?.message || "Failed to load admin profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminProfile = async () => {
    try {
      const updateData = {
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || "",
        address: adminData?.address || ""
      };

      const { data } = await axios.put(backendUrl + '/api/admin/profile', updateData, {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setAdminData(data.admin); // Use the updated admin data from response
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    if (aToken) {
      getAdminProfile();
    }
  }, [aToken]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin <span className="text-blue-400">Profile</span>
        </h1>
        <p className="text-gray-400">Manage your administrator account settings</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Profile Icon */}
          <div className="flex flex-col items-center gap-4">
            <AdminIcon />
            <div className="text-center">
              <p className="text-gray-400 text-sm">Administrator</p>
              <p className="text-blue-400 text-xs">System Admin</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  value={adminData?.name || ""}
                  onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-white font-medium py-3">
                  {adminData?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  value={adminData?.email || ""}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-white font-medium py-3">
                  {adminData?.email || "Not set"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  value={adminData?.phone || ""}
                  onChange={(e) => setAdminData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-white font-medium py-3">
                  {adminData?.phone || "Not set"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                  rows="3"
                  value={adminData?.address || ""}
                  onChange={(e) => setAdminData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-white font-medium py-3">
                  {adminData?.address || "Not set"}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700/50">
          {isEditing ? (
            <>
              <button
                onClick={updateAdminProfile}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  getAdminProfile(); // Reset to original data
                }}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;