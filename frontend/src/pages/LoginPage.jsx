import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LogIn, Loader, ArrowRight } from 'lucide-react'

import loginInputFieldData from '../data/loginInputFieldData'
import InputFields from '../components/InputFields'

import { useUserStore } from '../stores/useUserStore'

const LoginPage = () => {
  const [ formData, setFormData ] = useState({
    email: "",
    password: ""
  });

  const { loading, login } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  const handleFormData = (e) => {
    const { name, value } = e.target
    return setFormData({ ...formData, [name]: value})
  }

  const inputFieldsComponents = loginInputFieldData.map((field) => {
    return(
      <InputFields
        key={field.id}
        label={field.label}
        field={field.field}
        htmlFor={field.htmlFor}
        name={field.htmlFor}
        icon={field.icon}
        type={field.type}
        inputId={field.inputId}
        placeholder={field.placeholder}
        value={formData[field.htmlFor]}
        onChange={handleFormData}
      />
    )
  })

  return (
    <div className="flex flex-col gap-8 justify-center py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y:-20}} animate={{opacity: 1, y:0}} transition={{ duration: 0.8, delay: 0.2}} className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Login to your Account</h2>        
      </motion.div>

      <motion.div initial={{ opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{ duration: 0.8, delay: 0.2}} className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFieldsComponents}
            <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'>
              {loading? (
                <>
                  <Loader className='animate-spin mr-2 h-5 w-5'/>
                  loading...
                </>
              ):(
                <>
                  <LogIn className='h-5 w-5 mr-2' />
                  Login
                </>
              )}
            </button>
            <p className="text-gray-400 text-center text-sm mt-8">Don't have an account? <Link to={"/signUp"} className="text-emerald-400 ml-1.5 hover:text-emerald-700 transition duration-200 ease-in-out" >Sign up now <ArrowRight className='inline mr-2 mb-0.5 h-4 w-4' aria-hidden="true" /> </Link></p>            
          </form>
        </div>     
      </motion.div>
    </div>  
  )
}

export default LoginPage