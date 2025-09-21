import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Outlet,Route,Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import { Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Pending from './pages/Pending.jsx'
import CompletedPage from './pages/CompletedPage.jsx'
import Profile from './pages/Profile.jsx'

function App() {

  const navigate = useNavigate()

  const [currentUser,setCurrentUser] = useState(()=>{
    const storedUser = localStorage.getItem('currentUser')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(()=>{
    if(currentUser){
      localStorage.setItem('currentUser',JSON.stringify(currentUser))
    }
    else{
      localStorage.removeItem('currentUser')
    }
  },[currentUser])

  const handleAuthSubmit = data =>{
    const user = {
      email:data.email,
      name:data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }

    setCurrentUser(user)
    navigate('/',{replace:true})
  }

  const handelLogout = () =>{
    localStorage.removeItem('accessToken')
    setCurrentUser(null)
    navigate('/login', {replace:true})
  }

  const ProtectedLayout = ()=>(
    <Layout user={currentUser} onLogout={handelLogout}>
      <Outlet/>
    </Layout>
  )

  return (
    <Routes>

      <Route path='/login' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'> 
        <Login onSubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/signup')}/> </div>}/>

       <Route path='/signup' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <SignUp onSubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/login')}/> </div>}/>

       <Route element={currentUser ? <ProtectedLayout/> : <Navigate to='/login' replace/>}>
        <Route path='/' element={<Dashboard/>}/>
        <Route  path='pending' element={<Pending/>}/>
        <Route path='complete' element={<CompletedPage/>}/>
        <Route path='profile' element={<Profile user={currentUser} setCurrentUser = {currentUser} onLogout={handelLogout}/>}/>  
       </Route>

       <Route path='*' element={<Navigate to={currentUser ? "/" : "/login"} replace />}/>
      
    </Routes>
  )
}

export default App