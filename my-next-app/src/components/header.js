"use client";

import Link from 'next/link'; 
import React, {createContext, useContext} from "react"; 
import "../components/header.css";

const Header = () => {
    return (
      <header className="headerContainer">
        <div className="header">
            <div className = "left">
                <h1 className="text-lg font-semibold">Teamable Analytics</h1>
                <h2 className = "text">How Does it Work?</h2>
            </div>
            <div className = "right">
                <Link href="/admin-stats" className="pr-4 text-gray-500 hover:text-white"> Admin Stats</Link>
                <Link href="/logout" className="text-gray-500 hover:text-white">Logout</Link>
          </div>
        </div>
        <div className = "headerSecondContainer">
            <div className = "headerSecond">
                <ul className="flex space-x-12">
                    <li>
                        <Link href="../">Sections</Link>
                    </li>
                    <li>
                        <Link href="../">Students</Link>
                    </li>
                    <li>
                        <Link href="../">Attributes</Link>
                    </li>
                    <li>
                        <Link href="">Projects</Link>
                    </li>
                    <li>
                        <Link href="">Surveys</Link>
                    </li>
                    <li>
                        <Link href="/team">Teams</Link>
                    </li>
                    <li>
                        <Link href="">Evaluations</Link>
                    </li>
                </ul>
            </div>
        </div>
          
      </header>
    );
  };
  
  export default Header;