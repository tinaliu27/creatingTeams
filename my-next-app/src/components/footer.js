"use client";

import Link from 'next/link';
import React, {createContext, useContext} from "react"; 
import "../components/footer.css";

const Footer = () => {
    return (
        <footer className = "footerContainer">
            <div className = "footer">
                <ul className="footerNames">
                    <li>Developed by:</li>
                    <li>Jeff Bulmer</li>
                    <li>Opey Adeyemi</li>
                    <li>Mathew de Vin</li>
                    <li>Keyvan Khademi</li>
                    <li>Bri Marshinew</li>
                    <li>Dr. Bowen Hui</li>
                    <li>Callum Takasaka</li>
                    <li>Kanishka Verma</li>
                </ul>
            </div>
            <div className = "footerSecond">
                <img src="/img/ubcLogo.jpg" alt="UBC Logo" width="300px"/>
            </div>
        </footer>
    );
}; 

export default Footer; 