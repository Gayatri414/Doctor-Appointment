import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [profileData, setProfileData] = useState(false);

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
        headers: { Authorization: `Bearer ${dToken}` }
      });

      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about
      };

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, {
        headers: { Authorization: `Bearer ${dToken}` }
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div>

      <div className="flex flex-col gap-4 m-5">

        <div>
          <img className="bg-primary/80 w-full sm:max-w-64 rounded-lg" src={profileData.image} alt="" />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">

          {/* Doc Info */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{profileData.name}</p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{profileData.experience}</button>
          </div>

          {/* Doc About */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About:</p>
            <textarea 
              className="w-full text-sm text-gray-600 pt-1 border rounded px-3 py-2" 
              rows={5} 
              value={profileData.about} 
              onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
            />
          </div>

          <p className="text-neutral-800 font-medium mt-4">
            Appointment fee: 
            <input 
              className="border rounded px-2 py-1 ml-2" 
              type="number" 
              value={profileData.fees} 
              onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
            />
          </p>

          <div className="flex items-center gap-1 pt-2">
            <p>Address:</p>
            <p className="text-sm">
              <input 
                className="border rounded px-2 py-1" 
                type="text" 
                value={profileData.address?.line1} 
                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
              />
              <br />
              <input 
                className="border rounded px-2 py-1 mt-1" 
                type="text" 
                value={profileData.address?.line2} 
                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
              />
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))} 
              checked={profileData.available} 
              type="checkbox" 
              id="available" 
            />
            <label htmlFor="available">Available</label>
          </div>

          <button 
            onClick={updateProfile} 
            className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
};

export default DoctorProfile;