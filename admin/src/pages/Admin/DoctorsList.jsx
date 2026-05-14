import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="w-full px-6 py-6">
      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        All Doctors
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors?.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800">
                {item.name}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                {item.speciality}
              </p>

              {/* Availability */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.available ? "Available" : "Not Available"}
                </span>

                {/*  FIXED CHECKBOX */}
                <input
                  type="checkbox"
                  checked={item.available}
                  onClick={() => changeAvailability(item._id)}
                  className="accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;