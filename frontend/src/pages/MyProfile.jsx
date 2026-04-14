import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [userData, setUserData] = useState({
    name: "Gayatri Gade",
    email: "gayatri@email.com",
    phone: "+91 9876543210",
    address: "Pune, Maharashtra",
    gender: "Female",
    dob: "2003-05-15",
  });

  return (
    <div className="min-h-[80vh] px-6 md:px-16 py-10 text-gray-800">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        My <span className="text-blue-500">Profile</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Left - Image */}
        <div className="flex flex-col items-center gap-4">
          <img
            className="w-40 h-40 rounded-full object-cover border"
            src={assets.profile_pic}
            alt="Profile"
          />

          {isEdit && (
            <input type="file" className="text-sm" />
          )}
        </div>

        {/* Right - Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            {isEdit ? (
              <input
                className="border px-3 py-2 rounded w-full"
                value={userData.name}
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
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{userData.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-500">Address</p>
            {isEdit ? (
              <input
                className="border px-3 py-2 rounded w-full"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{userData.address}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            {isEdit ? (
              <select
                className="border px-3 py-2 rounded w-full"
                value={userData.gender}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            ) : (
              <p className="font-medium">{userData.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            {isEdit ? (
              <input
                type="date"
                className="border px-3 py-2 rounded w-full"
                value={userData.dob}
                onChange={(e) =>
                  setUserData({ ...userData, dob: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{userData.dob}</p>
            )}
          </div>

        </div>
      </div>

      {/* Button */}
      <div className="mt-8">
        <button
          onClick={() => setIsEdit(!isEdit)}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          {isEdit ? "Save" : "Edit Profile"}
        </button>
      </div>

    </div>
  );
};

export default MyProfile;