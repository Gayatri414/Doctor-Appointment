import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { userData, setUserData, backendUrl, token } = useContext(AppContext);

  //  UPDATE PROFILE API
  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

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
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    userData && (
      <div className="min-h-[80vh] px-6 md:px-16 py-10 text-gray-800">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-blue-500">Profile</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Image */}
          <div className="flex flex-col items-center gap-4">
            <img
              className="w-40 h-40 rounded-full object-cover border"
              src={image ? URL.createObjectURL(image) : (userData.image || assets.profile_pic)}
              alt="Profile"
            />

            {isEdit && (
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-sm"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              {isEdit ? (
                <input
                  className="border px-3 py-2 rounded w-full"
                  value={userData.name || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{userData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              {isEdit ? (
                <input
                  className="border px-3 py-2 rounded w-full"
                  value={userData.phone || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{userData.phone || "Not Added"}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <p className="text-sm text-gray-500">Address</p>
              {isEdit ? (
                <input
                  className="border px-3 py-2 rounded w-full"
                  value={userData.address || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{userData.address || "Not Added"}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              {isEdit ? (
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={userData.gender || "Male"}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              ) : (
                <p className="font-medium">{userData.gender || "Not Added"}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  className="border px-3 py-2 rounded w-full"
                  value={userData.dob || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                />
              ) : (
                <p className="font-medium">{userData.dob || "Not Added"}</p>
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
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            {isEdit ? "Save" : "Edit Profile"}
          </button>
        </div>

      </div>
    )
  );
};

export default MyProfile;