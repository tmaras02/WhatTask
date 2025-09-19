import React, { useEffect, useRef, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { BadgeQuestionMark, ChevronDown, LogOut, Settings } from 'lucide-react';

const Navbar = ({user = {}, onLogout}) => {

    const menuref = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleMenuToggle = () => setMenuOpen((prev) => !prev)

    const handleLogout = () => {
        setMenuOpen(false)
        onLogout()
    }

    useEffect(()=>{
    const handleClickOutside = (event) =>{
      if(menuref.current && !menuref.current.contains(event.target)){
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown',handleClickOutside)
  },[])

    return (
    <header className=' sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
        <div className=' flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>
            {/*LOGO*/}
            <div className=' flex items-center gap-2 cursor-pointer group'
                onClick={() => navigate('/')}>
                {/*LOGO*/}
                <div className=' relative w-10 h-10 flex items-center rounded-xl bg-gradient-to-br 
                    from-red-500 via-orange-500 to-yellow-500 shadow-lg group-hover:shadow-orange-300/50
                    group-hover:scale-105 transition-all duration-300 '>
                    <BadgeQuestionMark className='  w-10 h-8 text-white'/>
                </div>
                {/* BRAND NAME */}
                <span className=' text-2x1 font-extrabold bg-gradient-to-r from-red-500 via-orange-500
                to-yellow-500 bg-clip-text text-transparent tracking-wide'>
                    WhatTask
                </span>
            </div>

            {/* RIGHT SIDE */}
            <div className=' flex items-center gap-4'>
                <button className=' p-2 text-gray-600 hover:text-orange-500 transition-colors duration-300
                hover:bg-orange-50 rounded-full'
                    onClick={() => navigate('/profile')}>
                    <Settings className=' w-5 h-5' />
                </button>

                {/* USER DROPDOWN */}
                <div ref={menuref} className=' relative'>
                    <button onClick={handleMenuToggle} className=' flex items-center gap-2 px-3
                     py-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors duration-300 border
                     border-transparent hover:border-orange-200'>
                        <div className=' relative'>
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className=' w-9 h-9 rounded-full
                                shadow-sm' />
                            ) : (
                                <div className=' w-8 h-8 flex items-center justify-center rounded-full
                                bg-gradient-to-br from-red-500 to-yellow-600 text-white font-semibold
                                shadow-md'>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className=' absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 
                            rounded-full border-2 border-white animate-pulse'/>
                        </div>
                        <div className='text-left hidden md:block'>
                            <p className=' text-sm font-medium text-gray-800'>{user.name}</p>
                            <p className=' text-xs text-gray-500 font-normal'>{user.email}</p>
                        </div>
                        <ChevronDown className={` w-4 h-4 text-gray-500 transition-transform duration-300
                            ${menuOpen ? 'rotate-180' : ''}`}/> 
                    </button>

                    {menuOpen && (
                        <ul className=' absolute top-14 right-0 w-56 bg-white rounded-2x1
                        shadow-xl border border-orange-100 z-50 overflow-hidden animate-fadeIn'>

                            <li className=' p-2'>
                                <button onClick={() => {
                                    setMenuOpen(false)
                                    navigate('/profile')
                                }}
                                    className=' w-full px-4 py-2.5 text-left hover:bg-orange-50 text-sm
                                    text-gray-700 transition-colors flex items-center gap-2 group' role='menuitem'>
                                    <Settings className=' w-4 h-4 text-gray-700' /> 
                                    Profile Settings
                                </button>
                            </li>

                            <li className=' p-2'>
                                <button onClick={handleLogout} className=' flex w-full
                                items-center gap-2 rounded-1g px-3 py-2 text-sm Ihover:bg-red-50 text-red-600'>
                                    <LogOut className=' w-4 h-4' />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>          
            </div>
        </div>
    </header>
  )
}

export default Navbar