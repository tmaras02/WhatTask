import { UserPlus } from 'lucide-react'
import React from 'react'
import {BUTTONCLASSES, FIELDS, Inputwrapper} from '../assets/dummy.jsx'
import {MESSAGE_SUCCESS} from '../assets/dummy.jsx'
import {MESSAGE_ERROR} from '../assets/dummy.jsx'
import axios from 'axios'

const API_URL = 'http://localhost:4000'
const INITIAL_FORM ={
  name: '',
  email: '',
  password: '',
}

const SignUp = ({onSwitchMode}) => {

  const [formData, setFormData] = React.useState(INITIAL_FORM)
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState({text:"", type:""})

  const handleSubmit= async(e) =>{
    e.preventDefault()
    setLoading(true)
    setMessage({text: "", type: ""})
    
    try {
      const {data} = await axios.post(`${API_URL}/api/user/register`, formData)
      console.log("Signup successfull", data);
      setMessage({text: "Registration successfull! Please log in.", type: "success"})
      setFormData(INITIAL_FORM)
    }
    catch (err) {
      console.error("Singup error:", err);
      setMessage({text: err.response?.data?.message || "An error occurred, please try again.", type: "error"})
    }finally{
      setLoading(false)
    }
    
  }
  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-orange-200 rounded-xl p-8'>
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center'>
            <UserPlus className='w-8 h-8 text-white ' />    
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Create an Account</h2>
        <p className='text-gray-500 text-sm mt-1'>Join us to manage your tasks efficiently</p>
      </div>
      {message.text && (
        <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {FIELDS.map(({name, type, placeholder,icon:Icon} )=>(
            <div className={Inputwrapper} key={name}>
              <Icon className='text-orange-500 w-5 h-5 mr-2'/>

              <input 
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) => setFormData({...formData, [name]: e.target.value})}
                className='w-full text-sm focus:outline-none text-gray-700'
                required
              />
            </div>
          ))}
          <button type='submit' disabled={loading} className={BUTTONCLASSES} >
            {loading ? 'Creating Account...' : <><UserPlus className='w-4 h-4' />Sign Up</>}
          </button>
        </form>
        <p className='text-center text-sm text-gray-600'>
          Already have an account? {' '}
          <button onClick={onSwitchMode} className='text-orange-600 hover:text-orange-700 hover:underline 
           font-medium transition-colors duration-200' >
            Login
          </button>
        </p>
    </div>
  )
}

export default SignUp