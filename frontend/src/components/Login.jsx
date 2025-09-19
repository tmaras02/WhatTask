import { Lock, LogIn, Mail,Eye,EyeOff } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { BUTTONCLASSES, INPUTWRAPPER} from '../assets/dummy'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const INITIAL_FORM ={
  email: '',
  password: '',
}

const Login = ({onSubmit,onSwitchMode}) => {

    const [showPassword, setShowPassword] = React.useState(false)
    const [rememberMe, setRememberMe] = React.useState(false)
    const [formData, setFormData] = React.useState(INITIAL_FORM)
    const [loading, setLoading] = React.useState(false)
    
    const navigate = useNavigate()
    const url = 'http://localhost:4000'

    useEffect(()=>{
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if(token){
        (async () => {
          try {
            const {data} = await axios.get(`${url}/api/user/me`, {
              headers: {Authorization: `Bearer ${token}`},
            })
            if(data.success){
              onSubmit?.({token, userId, ...data.user})
              toast.success("Session restored")
              navigate('/')
          }else{
            localStorage.clear()
          }
            } catch(err)  {
            toast.error("Failed to fetch user data, please log in again")
            localStorage.clear()
          }
        })()
      }
    },[ onSubmit])

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if(!rememberMe){
        toast.error('You must enable "Remember Me" to login')
        return
      }
      setLoading(true)      

      try {
        const {data} = (await axios.post(`${url}/api/user/login`, formData))
        
        if(!data.token){
          throw new Error( data.message || "Login failed, please try again")
        }
        
        localStorage.setItem("token", data.token)

        localStorage.setItem("userId", data.user.id)
        setFormData(INITIAL_FORM)
        
        onSubmit?.({token: data.token, userId: data.user.id, ...data.user})
        toast.success("Login successful!")
        
        setTimeout(() => {navigate('/',)}, 1000)
      } 
      catch (err) {      
        const msg = err.response?.data?.message || err.message
        toast.error(msg)
      }finally{
        setLoading(false)
      }
    }

    const handleSWitchMode = () => {
      toast.dismiss()
      onSwitchMode?.()
    }

    const fields=[
      {
        id:1,
        name: 'email',
        type: 'email',
        placeholder: 'Email Address',
        icon:Mail
      },
      {
        id:2,
        name: 'password',
        type: showPassword ? 'text' : 'password',
        placeholder: 'Password',
        icon:Lock,
        isPassword: true
      }
    ]

  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-orange-100 rounded-xl p-8'>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar/>
      <div className='mb-6 text-center'>
        <div className='w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center'>
            <LogIn className='w-8 h-8 text-white ' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Welcome Back!</h2>
        <p className='text-gray-500 text-sm mt-1'>Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {fields.map(({id,name, type, placeholder, icon:Icon , isPassword}) => (
          <div className={INPUTWRAPPER} key={id}>
            <Icon className='text-orange-500 w-5 h-5' />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({...formData, [name]: e.target.value})}
              className='w-full px-2 focus:outline-none text-sm text-gray-700'
              required
            />
            {isPassword &&(
              <div onClick={() => setShowPassword((prev) => !prev)} className=' text-gray-500 ml-2 hover:text-orange-500 transition-colors'>
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </div>
            )}
          </div>
        ))}

        <div className='flex items-center'>
           <input type='checkbox'
            id='rememberMe'
            checked={rememberMe}
            onChange={()=>setRememberMe(!rememberMe)} 
            className='h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded'
            required
            />
            <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>Remember Me</label>
        </div>
        <button type='submit' className={BUTTONCLASSES} disabled={loading}>
          {loading ? ('Logging In...' ) : (
            <> <LogIn className='w-4 h-4 ' />
              Log In
            </>
          )}
        </button>
      </form>
      <p className='text-center text-sm text-gray-600 mt-6'>
          Don't have an account? {' '}
          <button type='button' className='text-orange-600 hover:text-orange-600 hover:underline 
           font-medium transition-colors duration-200' onClick={handleSWitchMode}>
            Sign Up
          </button>
      </p>
    </div>
  )
}

export default Login