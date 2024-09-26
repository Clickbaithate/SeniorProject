import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';


const SettingsPage = () => {

  return (
    <div className='page-layout'>
        <div className='content-area'>
            <Sidebar/>
            <div className='section-title'>
                <h2>
                    Settings
                </h2>
            </div>
        </div>
    </div>
    );
};

export default SettingsPage;
