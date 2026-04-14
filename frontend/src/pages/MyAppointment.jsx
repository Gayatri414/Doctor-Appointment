import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);

  return (
    <div className="px-6 md:px-16 py-10 min-h-[80vh]">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        My <span className="text-blue-500">Appointments</span>
      </h1>

      {/* Appointments List */}
      <div className="flex flex-col gap-6">

        {doctors.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >

            {/* Image */}
            <div className="w-full md:w-40">
              <img
                className="w-full h-40 object-cover rounded-lg"
                src={item.image}
                alt={item.name}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-sm text-gray-700">

              <p className="text-lg font-semibold text-gray-900">
                {item.name}
              </p>

              <p className="text-gray-500">
                {item.speciality}
              </p>

              <p className="mt-2 font-medium">Address:</p>
              <p>{item.address?.line1}</p>
              <p>{item.address?.line2}</p>

              <p className="mt-2">
                <span className="font-medium">Date & Time:</span>{" "}
                25 July, 2024 | 8:30 PM
              </p>

            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 justify-center">

              <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                Pay Online
              </button>

              <button className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition">
                Cancel Appointment
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyAppointment;