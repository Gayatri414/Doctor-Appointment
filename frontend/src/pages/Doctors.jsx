import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality.toLowerCase().trim() ===
            decodeURIComponent(speciality).toLowerCase().trim()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 text-sm">

          {/* GENERAL */}
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            General physician
          </p>

          {/* GYNECOLOGIST */}
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "Gynecologist"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Gynecologist
          </p>

          {/* DERMATOLOGIST */}
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "Dermatologist"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Dermatologist
          </p>

          {/* PEDIATRICIAN */}
          <p
            onClick={() =>
              speciality === "Pediatrician"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatrician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "Pediatrician"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Pediatrician
          </p>

          {/* GASTRO */}
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Gastroenterologist
          </p>

          {/* NEURO */}
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer transition-all
            ${
              speciality === "Neurologist"
                ? "bg-indigo-100 text-black border-indigo-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Neurologist
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <img
                className="w-full h-40 object-cover"
                src={item.image}
                alt={item.name}
              />

              <div className="p-3">
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p>Available</p>
                </div>

                <p className="font-semibold text-lg">{item.name}</p>

                <p className="text-gray-500 text-sm">
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Doctors;