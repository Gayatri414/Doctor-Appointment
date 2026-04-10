import React from "react";
import { doctors } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const TopDoctors = () => {

    const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-800">

      {/* Heading */}
      <h1 className="text-3xl font-bold">
        Top Doctors to Book
      </h1>

      {/* Description */}
      <p className="text-gray-500 text-center max-w-xl">
        Simply browse through our extensive list of trusted doctors
      </p>

      {/* Doctors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full px-6">

        {doctors.slice(0, 10).map((item, index) => (
          <div onClick={()=>
navigate(`/appointment/${item._id}`)
          }
            key={index}
            className="border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-lg"
          >

            {/* Doctor Image */}
            <img
              className="w-full h-40 object-cover"
              src={item.image}
              alt={item.name}
            />

            {/* Content */}
            <div className="p-3">

              {/* Availability */}
              <div className="flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
              </div>

              {/* Name */}
              <p className="font-semibold text-lg">
                {item.name}
              </p>

              {/* Speciality */}
              <p className="text-gray-500 text-sm">
                {item.speciality}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* Button */}
      <button className="bg-blue-500 text-white px-6 py-2 rounded-full mt-6 hover:bg-blue-600 transition-all duration-300">
        More
      </button>

    </div>
  );
};

export default TopDoctors;