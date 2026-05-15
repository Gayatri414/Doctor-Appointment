import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!docImg) {
        toast.error("Please upload image");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({
          line1: address1,
          line2: address2,
        })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Doctor Added Successfully!");

        setDocImage(null);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Add New Doctor
        </h1>
        <p className="text-gray-400">Fill in the details to add a new doctor to the system.</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
      >

        {/* Image Upload Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📷</span>
            </div>
            Doctor Photo
          </h3>
          
          <div className="flex items-center gap-6">
            <label htmlFor="img" className="cursor-pointer group">
              <div className="relative">
                <img
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                  className="w-24 h-24 object-cover rounded-xl border-2 border-gray-600 group-hover:border-green-500 transition-all duration-300 shadow-lg"
                />
                <div className="absolute inset-0 bg-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center transform translate-x-1 translate-y-1">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
            </label>

            <input
              type="file"
              id="img"
              hidden
              accept="image/*"
              onChange={(e) => setDocImage(e.target.files[0])}
            />

            <div>
              <p className="text-gray-300 font-medium">Upload Doctor Image</p>
              <p className="text-gray-500 text-sm">JPG, PNG or GIF (max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter doctor's full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Experience</label>
              <select
                className="input"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                    {i + 1} Year{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🏥</span>
            </div>
            Professional Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Speciality</label>
              <select
                className="input"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option>General Physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Degree</label>
              <input
                className="input"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g., MBBS, MD"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Consultation Fees ($)</label>
              <input
                className="input"
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Enter consultation fees"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📍</span>
            </div>
            Address Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Address Line 1</label>
              <input
                className="input"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Street address, building name"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Address Line 2</label>
              <input
                className="input"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="City, state, postal code"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            About Doctor
          </h3>
          
          <textarea
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write a brief description about the doctor's expertise, achievements, and background..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Doctor...
              </>
            ) : (
              <>
                <span className="text-lg">👨‍⚕️</span>
                Add Doctor to System
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;