import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  //  Fetch doctor info
  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  //  Generate slots (AM/PM fixed)
  const getAvailableSlots = () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9 PM

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10
            ? currentDate.getHours() + 1
            : 10
        );
        currentDate.setMinutes(
          currentDate.getMinutes() > 30 ? 30 : 0
        );
      } else {
        currentDate.setHours(10, 0, 0, 0); // start 10 AM
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        // AM/PM format 
        let formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div className="mt-10">

        {/*  Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-6 bg-white shadow-md rounded-xl p-5">

          {/* LEFT IMAGE */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-600 p-5 rounded-2xl flex justify-center items-center">
            <img
              className="w-full sm:w-72 h-72 object-cover rounded-xl shadow-lg border border-white"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1">

            {/* Name */}
            <p className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>

            {/* Degree */}
            <div className="flex items-center gap-3 mt-2 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>

              <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-gray-50">
                {docInfo.experience}
              </button>
            </div>

            {/* About */}
            <div className="mt-4">
              <p className="flex items-center gap-2 font-medium text-gray-700">
                About
                <img className="w-4" src={assets.info_icon} alt="" />
              </p>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {docInfo.about}
              </p>
            </div>

            {/* Fees */}
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:
              <span className="text-gray-600 ml-1">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/*  SLOT SECTION */}
        <div className="mt-8">

          <p className="font-medium text-gray-700 text-lg">
            Booking Slots
          </p>

          {/* Days */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-3 px-5 rounded-xl cursor-pointer min-w-[70px] transition-all
                ${
                  slotIndex === index
                    ? "bg-blue-600 text-white shadow-md"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                <p className="text-sm">
                  {item[0] &&
                    new Date(item[0].datetime).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    )}
                </p>
                <p className="text-lg font-medium">
                  {item[0] &&
                    new Date(item[0].datetime).getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex flex-wrap gap-3 mt-5">
            {docSlots[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm px-4 py-2 rounded-full cursor-pointer transition-all
                ${
                  slotTime === item.time
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                {item.time}
              </p>
            ))}
          </div>

          {/* Book Button */}
          <button className="mt-6 bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 transition-all">
            Book Appointment
          </button>

        </div>
        {/* Listing related doctors can be done here using the RelatedDoctors component */}
<RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
      </div>
    )
  );
};

export default Appointment;