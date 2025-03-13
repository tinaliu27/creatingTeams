"use client";

import Header from "../../components/header";
import React, { useState, useEffect } from 'react'; 
import Footer from "../../components/footer"; 
import "../selectTeam/selectTeam.css";
import TeamHeader from "../../components/teamHeader"; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function SelectTeam() {
    return  (
        <div className = "teamContents">
           <Header/>
           <div className="pageContents">
                
           </div>
           <Footer/>

        </div>
    );
}
