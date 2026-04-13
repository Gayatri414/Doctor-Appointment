import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="px-6 md:px-16 py-10 text-gray-800">

      {/* Heading */}
      <div className="text-center text-3xl font-bold mb-10">
        <p>
          ABOUT <span className="text-blue-500">US</span>
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row gap-10 items-center">

        {/* Image */}
        <div className="w-full md:w-[40%] overflow-hidden rounded-xl shadow-md">
          <img
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
            src={assets.about_image}
            alt="About"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-5 md:w-[60%] text-base leading-relaxed">

          <p>
            Welcome to our platform, where your health and well-being are our
            top priorities. We aim to simplify the process of booking
            appointments with trusted doctors and healthcare professionals.
          </p>

          <p>
            Our system provides a seamless experience, allowing users to browse,
            compare, and choose doctors based on their specialization,
            availability, and expertise.
          </p>

          <b className="text-lg text-gray-900">
            Our Vision
          </b>

          <p>
            We envision a future where healthcare is easily accessible to
            everyone. Our mission is to bridge the gap between patients and
            doctors through technology, ensuring timely and efficient medical
            care.
          </p>

        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why <span className="text-blue-500">Choose Us</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p className="text-gray-500 text-sm">
              Book appointments with just a few clicks anytime, anywhere.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Verified Doctors</h3>
            <p className="text-gray-500 text-sm">
              All doctors are verified professionals with trusted experience.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-500 text-sm">
              Our support team is available anytime to assist you.
            </p>
          </div>

        </div>
      </div>

      {/* Stats Section */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">

  {/* Card */}
  <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition min-h-[120px]">
    <p className="text-3xl font-bold text-blue-500 whitespace-nowrap">
      100+
    </p>
    <p className="text-gray-500 text-sm mt-2 whitespace-nowrap">
      Doctors
    </p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition min-h-[120px]">
    <p className="text-3xl font-bold text-blue-500 whitespace-nowrap">
      10K+
    </p>
    <p className="text-gray-500 text-sm mt-2 whitespace-nowrap">
      Patients
    </p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition min-h-[120px]">
    <p className="text-3xl font-bold text-blue-500 whitespace-nowrap">
      500+
    </p>
    <p className="text-gray-500 text-sm mt-2 whitespace-nowrap">
      Appointments
    </p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition min-h-[120px]">
    <p className="text-3xl font-bold text-blue-500 whitespace-nowrap">
      24/7
    </p>
    <p className="text-gray-500 text-sm mt-2 whitespace-nowrap">
      Support
    </p>
  </div>

</div>

    </div>
  );
};

export default About;