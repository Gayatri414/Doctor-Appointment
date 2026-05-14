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

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) return toast.error("Please upload image");

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
        toast.success("Doctor Added");

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
    }
  };

  return (
    <div className="w-full p-6">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-1000">
          Add Doctor
        </h2>

        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-6">
          <label htmlFor="img" className="cursor-pointer">
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              className="w-20 h-20 object-cover rounded-lg border hover:opacity-80 transition"
            />
          </label>

          <input
            type="file"
            id="img"
            hidden
            onChange={(e) => setDocImage(e.target.files[0])}
          />

          <p className="text-gray-500 text-sm">
            Upload Doctor Image
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Doctor Name"
            required
          />

          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <select
            className="input"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i}>{i + 1} Year</option>
            ))}
          </select>

          <input
            className="input"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="Fees"
            required
          />

          <select
            className="input"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option>General Physician</option>
            <option>Gynecologist</option>
            <option>Dermatologist</option>
            <option>Pediatrician</option>
          </select>

          <input
            className="input"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="Degree"
            required
          />

          <div>
            <input
              className="input mb-2"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Address Line 1"
            />
            <input
              className="input"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Address Line 2"
            />
          </div>

        </div>

        {/* About */}
        <textarea
          className="w-full mt-5 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About doctor"
          rows={4}
        />

        {/* Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;