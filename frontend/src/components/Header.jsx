import React from 'react';
import { assets } from '../assets/assets';
const Header=()=>{
    return(
        <div>
             {/*----left side----*/}
        <div>
            <p>Book Appointment <br/>
            with trusted doctors
            </p>
            <div>
                <img src={assets.group_profiles} alt=""/>
                <p>
                    Simply browse and book appointments with top-rated doctors in your area.<br/> 
                    Our platform connects you with trusted healthcare professionals, ensuring you receive the care you deserve. 
                </p>
            </div>
            <a href="">
Book appointment <img src={assets.arrow_icon} alt=""/>
            </a>

        </div>



         {/*----right side----*/}
        <div>
              <img src={assets.header_img} alt=""/> 
                <div>

                </div>
            </div>
            </div>
    )
}
export default Header;
