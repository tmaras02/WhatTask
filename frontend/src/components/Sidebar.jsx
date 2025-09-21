
import React ,{useEffect, useState} from 'react'
import { menuItems, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, TIP_CARD,LINK_CLASSES } from '../assets/dummy.jsx'
import { Lightbulb, Menu, Sparkle, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({user,tasks}) => {

      const [mobileOpen, setMobileOpen] = useState(false)
      //const [showModal, setShowModal] = useState(false)

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter((t) => t.completed).length || 0

    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const userName = user?.name || 'User'
    const initial = userName.charAt(0).toUpperCase()

    useEffect(()=>{
      document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
      return () => {
        document.body.style.overflow = 'auto'
      }
    },[mobileOpen])

    const renderMenuItems = (isMobile = false) => (
      <ul className='space-y-2'>
          {menuItems.map(({text,path,icon}) => (
            <li key={text}>
              <NavLink to={path} className={({ isActive }) =>[
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-start"
              ].join(' ')} onClick={() => setMobileOpen(false)}>
                <span className={LINK_CLASSES.icon}>
                  {icon}
                </span>
                <span className={`${isMobile ? "block" : "hidden lg:block"} ${LINK_CLASSES.text}`}>
                  {text}
                </span>
              </NavLink>
            </li>
          ))}
      </ul>
    )

  return (
    <>
       {/* Sidebar component can be used to navigate through different sections of the application */}
       <div className={SIDEBAR_CLASSES.desktop}>
          <div className='p-5 border-b border-gray-100 lg:block hidden'> 
            <div className='flex items-center gap-3'>
               <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-yellow-400 flex items-center justify-center text-white shadow-md font-bold'>
                  {initial}
               </div>

               <div>
                  <h1 className='text-lg font-bold text-gray-800'>Hey, {userName}</h1>
                  <p className='text-sm text-orange-500 font-medium flex items-center gap-1'><Sparkle className='h-3 w-3'/> Let's do some tasks! </p>
               </div>
            </div>
          </div>
          <div className='p-4 space-y-6 overflow-y-auto flex-1'> 
              <div className={PRODUCTIVITY_CARD.container}>
                <div className={PRODUCTIVITY_CARD.header}>
                  <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
                  <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
                </div>
                <div className={PRODUCTIVITY_CARD.barBg}>
                  <div className={PRODUCTIVITY_CARD.barFg} style={{ width: `${productivity}%` }}/>
                </div>
              </div>

              {renderMenuItems()}

              <div className='mt-auto pt-6 lg:block hidden'>
                <div className={TIP_CARD.container}>
                   <div className='flex items-center gap-2'>
                      <div className={TIP_CARD.iconWrapper}>
                         <Lightbulb className='w-5 h-5 text-orange-600' />
                      </div>

                      <div>
                          <h3 className={TIP_CARD.title}>Tip of the Day</h3>
                          <p className={TIP_CARD.description}>Stay focused and break tasks into smaller steps for better productivity!</p>
                          {/* TODO: Add dynamic tip fetching */}
                      </div>
                   </div>
                </div>
              </div>
          </div>
       </div>

       {/* MOBILE MENU */}
       {!mobileOpen && (
        <button className={SIDEBAR_CLASSES.mobileButton} onClick={() => setMobileOpen(true)}>
          <Menu className='w-5 h-5' />
        </button>
       )}

       {/* MOBILE DRAWER*/}
       {mobileOpen && (
        <div className='fixed inset-0 z-40'>
            <div className={SIDEBAR_CLASSES.mobileDrawerBackdrop} onClick={() => setMobileOpen(false)}/>
            
            <div className={SIDEBAR_CLASSES.mobileDrawer} onClick={(e) => e.stopPropagation()}>
              <div className='flex justify-between items-center mb-4 border-b pb-2'>
                <h2 className='text-lg font-bold text-orange-600'> Menu </h2>
                <button className='text-gray-500 hover:text-orange-600' onClick={() => setMobileOpen(false)}>
                   <X className='w-5 h-5' />
                </button>
              </div>

                 <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-yellow-400 flex items-center justify-center text-white shadow-md font-bold'>
                       {initial}
                    </div>

                    <div>
                       <h1 className='text-lg font-bold mt-16 text-gray-800'>Hey, {userName}</h1>
                       <p className='text-sm text-orange-500 font-medium flex items-center gap-1'><Sparkle className='h-3 w-3'/> Let's crush some Tasks! </p>
                   </div>
                 </div>
                 {renderMenuItems(true)}
            </div>
        </div>
       )}
    </>
  )
}

export default Sidebar