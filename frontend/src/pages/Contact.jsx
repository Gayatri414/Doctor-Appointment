import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-6 md:px-16 py-10 text-gray-800">

      {/* Heading */}
      <div className="text-center text-3xl font-bold mb-10">
        <p>
          CONTACT <span className="text-blue-500">US</span>
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 items-center">

        {/* Image */}
        <div className="w-full md:w-[40%]">
          <img
            className="w-full rounded-xl shadow-md"
            src={assets.contact_image}
            alt="Contact"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 md:w-[60%] text-base">

          <p className="text-xl font-semibold text-gray-900">
            OUR OFFICE
          </p>

          <p className="text-gray-600">
            123 Health Street,<br />
            Pune, Maharashtra,<br />
            India
          </p>

          <p className="text-gray-600">
            📞 Phone: +91 98765 43210
          </p>

          <p className="text-gray-600">
            📧 Email: support@healthcare.com
          </p>

          <p className="text-gray-600">
            🕒 Working Hours: Mon - Sat (9:00 AM - 8:00 PM)
          </p>

        </div>

      </div>
      {/* Careers Section */}
<div className="mt-16">

  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
    Careers at <span className="text-blue-500">Prescripto</span>
  </h2>

  {/* Content */}
  <div className="flex flex-col md:flex-row gap-10 items-center">

    {/* Left Text */}
    <div className="md:w-[60%] flex flex-col gap-5 text-base leading-relaxed">

      <p>
        Join Prescripto and be part of a mission-driven team transforming the
        healthcare experience. We are always looking for passionate individuals
        who want to make a difference in people's lives.
      </p>

      <p>
        Whether you are a developer, designer, or healthcare professional, we
        offer opportunities to grow, innovate, and contribute to meaningful
        solutions.
      </p>

      <p>
        We believe in collaboration, continuous learning, and building products
        that truly impact society.
      </p>

      {/* Button */}
      <button className="w-fit bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
        Explore Jobs
      </button>

    </div>

    {/* Right Card */}
    <div className="md:w-[40%] bg-white shadow-lg rounded-xl p-6 text-center">

      <h3 className="text-lg font-semibold mb-3">
        Why Work With Us?
      </h3>

      <ul className="text-gray-600 text-sm space-y-2">
        <li>🚀 Growth Opportunities</li>
        <li>🤝 Collaborative Culture</li>
        <li>💡 Innovative Projects</li>
        <li>🌍 Real-world Impact</li>
      </ul>

    </div>

  </div>

</div>

    </div>
  );
};

export default Contact;