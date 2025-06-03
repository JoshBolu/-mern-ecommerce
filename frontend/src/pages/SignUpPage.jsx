import { useState } from "react";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { UserPlus, ArrowRight, Loader } from "lucide-react";


import inputFieldData from "../data/signUpInputFieldData";
import InputFields from "../components/InputFields";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { signUp, loading } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    signUp(formData)
  }

  const handleFormData = (e) => {
    const { name, value } = e.target
    return setFormData({...formData, [name]: value})    
  }

  const inputFieldsComponents = inputFieldData.map((field) => {
    return (
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
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y:-20}} animate={{opacity: 1, y:0}} transition={{ duration: 0.8, delay: 0.2}} className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">Create your account</h2>
      </motion.div>

      <motion.div initial={{ opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{ duration: 0.8, delay: 0.2}} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFieldsComponents}
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50" disabled={loading}>
              {loading? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign Up
                </>
              )}
            </button>
          </form>
          
          <p className="text-gray-400 text-center text-sm mt-8">Already have an acount <Link to='/login' className="text-emerald-400 ml-1.5 hover:text-emerald-700 transition duration-200 ease-in-out">Login here <ArrowRight className="inline mr-2 h-4 w-4 mb-0.5" aria-hidden="true" /></Link></p>
        </div>
      </motion.div>

        
        
    </div>
  )
}

export default SignUpPage