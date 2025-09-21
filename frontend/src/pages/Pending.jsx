
import React, { useMemo } from 'react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy.jsx'
import { Clock, Filter, ListChecks, Plus } from 'lucide-react'
import TaskItem from '../components/TaskItem.jsx'
import TaskModal from '../components/TaskModal.jsx'

const Pending = () => {

  const {tasks= {}, refreshTasks} = useOutletContext()
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter((t) => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no'))
    
    return filtered.sort((a, b) => {
      if(sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if(sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      
      const order = {high:3, medium:2, low:1}

      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()]
    })
  },[tasks, sortBy])

  return (
    <div className={layoutClasses.container}>
       <div className={layoutClasses.headerWrapper}>
         <div>
           <h1 className='text-2xl md:text-2xl font-bold text-gray-800 flex items-center gap-2'>
             <ListChecks className='text-orange-500' /> Pending Task
           </h1>
           <p className='text-sm text-gray-500 mt-1 ml-7'>
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} {' '}
            needing your attention
           </p>
         </div>

         <div className={layoutClasses.sortBox}>
            <div className='flex items-center gap-2 text-gray-700 font-medium'>
               <Filter className='w-4 h-4 text-orange-500'/>
               <span className='text-sm'>Sort by:</span>
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={layoutClasses.select}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>

            <div className={layoutClasses.tabWrapper}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setSortBy(opt.id)}
                className={layoutClasses.tabButton(sortBy === opt.id)}>
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>
         </div>
       </div>

      <div onClick={()=> setShowModal(true)}
        className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-orange-200 
        rounded-xl hover:border-orange-400 bg-orange-50/50 cursor-pointer transition-colors mb-5'>     
        <Plus className='w-5 h-5 text-orange-500 mr-2'/>
        <span className='text-gray-600 font-semibold'>Add New Task</span>
      </div>

      <div className='space-y-4'>
      {sortedPendingTasks.length === 0 ? (
        <div className={layoutClasses.emptyState}>
          <div className='max-w-xs mx-auto py-6'>
            <div className={layoutClasses.emptyIconBg}>
              <Clock className='w-8 h-8 text-orange-500' />
            </div>
            
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              All caught Up!
            </h3>

            <p className='text-sm text-gray-500 mb-4'>
              No pending tasks - great work
            </p>

            <button className={layoutClasses.emptyBtn} onClick={()=>setShowModal(true)}>
              Add New Task
            </button>
          </div>
        </div>
      ):(
        sortedPendingTasks.map(task =>(
          <TaskItem key={task._id || task.id}  task={task} showCompleteCheckbox onDelete={()=> handleDelete(task._id || task.id)}
            onToggleComplete = {() => handetToggleComplete(
              task._id || task.id,
              task.completed
            )}
            onEdit={()=> {setShowModal(true) ; setTaskToEdit(task); }}
            onRefresh={refreshTasks}
          />
        ))
      )}
      </div>
      <TaskModal isOpen={!!selectedTask || showModal}
      onClose={()=>{setShowModal(false); setSelectedTask(null); refreshTasks()}}
      taskToEdit={selectedTask}
      />
    </div>
  )
}

export default Pending
