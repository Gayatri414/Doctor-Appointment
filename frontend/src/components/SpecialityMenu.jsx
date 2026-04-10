import React from 'react'
import { specialityData } from '../assets/assets';
import { Link, useLocation } from 'react-router-dom';

const SpecialityMenu = () => {

    const location = useLocation();

    // ❌ Hide on doctors page
    if (location.pathname.startsWith('/doctors')) {
        return null;
    }

    return(
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>

            <h1 className='text-3xl font-bold'>Find by Speciality</h1>

            <p className='text-gray-500 text-center sm:w-1/3 text-sm'>
                Simply browse through our extensive list of trusted doctors,
                schedule your appointment hassle-free
            </p>

            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>

                {specialityData.map((item,index)=>(
                    <Link 
                        key={index}
                        to={`/doctors/${item.speciality}`}
                        state={{
                            speciality: item.speciality,
                            description: `Find experienced ${item.speciality} doctors and book appointments easily.`
                        }}
                        className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-500'
                    >
                        <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
                        <p className='text-sm font-medium'>{item.speciality}</p>
                    </Link>
                ))}

            </div>

        </div>
    )
}

export default SpecialityMenu;