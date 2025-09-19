
import React, { useCallback, useEffect, useState } from 'react'
import { baseControlClasses, DEFAULT_TASK, priorityStyles } from '../assets/dummy.jsx'
import { AlignLeft, Calendar, CheckCircle, Flag, PlusCircle, Save ,X} from 'lucide-react'


const API_BASE = 'http://localhost:4000/api/tasks'

const TaskModal = ({isOpen, onClose, taskToEdit, onSave, onLogout}) => {

    const [taskData,setTaskData] = useState(DEFAULT_TASK)
    const [error,setError]=useState(null)
    const [loading,setLoading] = useState(false)
    const today = new Date().toLocaleString().split(':')[0]

    useEffect(()=>{
        if(!isOpen) return;

        if(taskToEdit){
            const normalized = taskToEdit.completed === 'yes' || taskToEdit.completed === true ? "yes" : "no"
            setTaskData({
                ...DEFAULT_TASK,
                title:taskToEdit.title || " ",
                description:taskToEdit.description || " ",
                completed:normalized,
                dueDate:taskToEdit.dueDate?.split('T')[0] || '',
                id:taskToEdit._id,
                priority:taskToEdit.priority || 'Low',
            })
        }else{
            setTaskData(DEFAULT_TASK)
        }
        setError(null)
        
    },[isOpen,taskToEdit])

    const handleChange =  ((e) =>{
      const {name,value} = e.target
      setTaskData(prev=> ({...prev,[name]:value}))
    },[])

    const getHeaders = useCallback(()=>{
      const accessToken = localStorage.getItem('accessToken') 
      if(!accessToken){
        throw new Error('no auth Token found')
      }
      return {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`
      }
    })

    const handleSubmit = useCallback(async(e)=>{
        e.preventDefault()
        if(taskData.dueDate < today){
            setError('Due date must be today or later')
            return
        }
        setLoading(true)
        setError(null)
        try {
            const isEdit = Boolean(taskData.id)
            const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`;
            const response = await fetch(url,{
              method:isEdit ? 'PUT' : 'POST',
              headers:getHeaders(),
              body:JSON.stringify(taskData),
            });
            if(!response.ok){
              if(response.status===401) return onLogout?.()
                const err = await response.json()
              throw new Error(err.message || 'Failed to save task')
            }
            const saved = await response.json();
            onSave?.(saved)
            onClose()
        } catch (error) {  
            console.error(error)      
            setError(error.message || 'an error is occoured in taskmodel')  
        }
        finally{
          setLoading(false)
        }
    },[taskData,today,getHeaders,onLogout,onSave,onClose])
    if(!isOpen){
      return null
    }
  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4'>
      <div className='bg-white border border-orange-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animated-fadeIn'>
         <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
              {taskData.id ? <Save className='text-orange-500 w-5 h-5' /> : 
                <PlusCircle className='text-orange-500 w-5 h-5' />} 
              {taskData.id ? 'Edit Task' : 'Create New Task'}
            </h2>

            <button onClick={onClose} className='p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-500 hover:text-orange-700'>
               <X className='w-5 h-5'/>
            </button>
         </div>
         {/*  FORM TO FILL TO CREATE A TASK */}
         <form onSubmit={handleSubmit} className='space-y-4'>
            {error && <div className='text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100'>{error}</div>}
            <div>
                <label className='block text-sm font-medium text-orange-100 mb-1'>
                    Task Title
                </label>

                <div className='flex items-center border border-orange-100 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-200'>
                   <input type="text" name='title' required value={taskData.title} onChange={handleChange} className='w-full focus:outline-none text-sm' placeholder='Enter task title'/>
                </div>
            </div>
            <div>
                 <label className='flex items-center gap-1 text-sm font-medium text-orange-100 mb-1'>
                    <AlignLeft  className='h-4 w-4 text-orange-500'/>
                </label>
                <textarea name='description' row="3"
                onChange={handleChange} value={taskData.description}
                className={baseControlClasses} placeholder='Enter task description'/>
            </div>

            <div className='grid grid-cols-2 gap-4'>
               <div>
                  <label className='flex items-center gap-1 text-sm font-medium text-orange-100 mb-1'>
                    <Flag  className='h-4 w-4 text-orange-500'/> Priority
                  </label>
                  <select name='priority' value={taskData.priority} onChange={handleChange} className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}>
                    <option>Low</option>
                     <option>Medium</option>
                      <option>High</option>
                  </select>
               </div>

               <div>
                 <label className='flex items-center gap-1 text-sm font-medium text-orange-100 mb-1'>
                    <Calendar  className='h-4 w-4 text-orange-500'/> Due Date
                  </label>
                  <input type="date" name='dueDate' required min={today}  value={taskData.dueDate} onChange={handleChange} className={baseControlClasses}/>
               </div>
            </div>

            <div>
                <label className='flex items-center gap-1 text-sm font-medium text-orange-100 mb-1'>
                    <CheckCircle  className='h-4 w-4 text-orange-500'/> Due Date
                </label>

                <div className='flex gap-4'>
                  {[{val:"yes" , label:"completed"}, {val:"no",label:"In Progress"}].map(({val,label})=>(
                    <label key={val} className='flex items-center'>
                    <input type='radio' name='completed'  value={val} checked={taskData.completed===val}
                     onChange={handleChange} className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded '/>
                      <span className='ml-2 text-sm text-gray-700'>{label}</span>
                     </label>
                  ))}
                </div>
            </div>

            <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-orange-600 to-yellow-400 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200'>
              {loading ? "Saving...." : (taskData.id ? <>
               <Save className='w-4 h-4'/> Update Task
              </> : <>
               <PlusCircle className='w-4 h-4' /> Create Task
              </>)}
            </button>
         </form>
      </div>
    </div>
  )
}

export default TaskModal