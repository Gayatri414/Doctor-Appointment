import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext);

  // Default profile icon (SVG)
  const ProfileIcon = ({ className = "w-40 h-40" }) => (
    <div className={`${className} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-600`}>
      <svg 
        className="w-1/2 h-1/2 text-white" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  );

  //  UPDATE PROFILE API
  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData?.name || "");
      formData.append("phone", userData?.phone || "");
      
      // Handle address properly - if it's an object, stringify it, if it's a string, convert to object
      const addressData = typeof userData?.address === 'object' 
        ? userData.address 
        : { line1: userData?.address || "", line2: "" };
      
      formData.append("address", JSON.stringify(addressData));
      formData.append("gender", userData?.gender || "Male");
      formData.append("dob", userData?.dob || "");

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        backendUrl + "/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Profile Updated");
        setIsEdit(false);
        // Reload user data
        await loadUserProfileData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Loading state
  if (!userData) {
    return (
      <div className="min-h-[80vh] px-6 md:px-16 py-10 bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-6 md:px-16 py-10 text-gray-100 bg-gray-900">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 text-white">
        My <span className="text-blue-400">Profile</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Profile Icon */}
        <div className="flex flex-col items-center gap-4">
          {image ? (
            <img
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-600"
              src={URL.createObjectURL(image)}
              alt="Profile"
            />
          ) : userData?.image ? (
            <img
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-600"
              src={userData.image}
              alt="Profile"
              onError={(e) => { 
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Default Profile Icon - shown when no image */}
          {!image && !userData?.image && <ProfileIcon />}
          
          {/* Fallback icon for broken images */}
          {userData?.image && (
            <ProfileIcon className="w-40 h-40" style={{ display: 'none' }} />
          )}

          {isEdit && (
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-400">Full Name</p>
            {isEdit ? (
              <input
                className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded w-full focus:border-blue-400 focus:outline-none"
                value={userData?.name || ""}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            ) : (
              <p className="font-medium text-gray-100">{userData?.name || "Not Added"}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium text-gray-100">{userData?.email || "Not Added"}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            {isEdit ? (
              <input
                className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded w-full focus:border-blue-400 focus:outline-none"
                value={userData?.phone || ""}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            ) : (
              <p className="font-medium text-gray-100">{userData?.phone || "Not Added"}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-400">Address</p>
            {isEdit ? (
              <input
                className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded w-full focus:border-blue-400 focus:outline-none"
                value={typeof userData.address === 'object' ? userData.address?.line1 || "" : userData.address || ""}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
              />
            ) : (
              <p className="font-medium text-gray-100">
                {typeof userData.address === 'object' 
                  ? (userData.address?.line1 || "Not Added")
                  : (userData.address || "Not Added")
                }
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <p className="text-sm text-gray-400">Gender</p>
            {isEdit ? (
              <select
                className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded w-full focus:border-blue-400 focus:outline-none"
                value={userData?.gender || "Male"}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            ) : (
              <p className="font-medium text-gray-100">{userData?.gender || "Not Added"}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            {isEdit ? (
              <input
                type="date"
                className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded w-full focus:border-blue-400 focus:outline-none"
                value={userData?.dob || ""}
                onChange={(e) =>
                  setUserData({ ...userData, dob: e.target.value })
                }
              />
            ) : (
              <p className="font-medium text-gray-100">{userData?.dob || "Not Added"}</p>
            )}
          </div>

        </div>
      </div>

      {/* Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            if (isEdit) {
              updateProfile();   //  save
            } else {
              setIsEdit(true);   // edit mode
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isEdit ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

    </div>
  );
};

export default MyProfile;