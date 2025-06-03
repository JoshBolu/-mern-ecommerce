import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Loader } from 'lucide-react'

import createProductInputFieldData from '../data/createProductInputFieldData';
import InputFields from './InputFields';

import { useProductStore } from '../stores/useProductStore';

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProduct = () => {

    const { loading, createProduct } = useProductStore()

    const fileInputRef = useRef(null)

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        inStock: "",
        category: "",
        image: ""
    }) 

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createProduct(newProduct)
        setNewProduct({name: "", description: "", price: "", inStock: "", category: ""})
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    }

    const handleFormData = (e) => {
        const { name, value } = e.target        
        return setNewProduct({ ...newProduct, [name]: value})
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()

            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result})
            }
            reader.readAsDataURL(file);
        }
    }

    const createProductField = createProductInputFieldData.map((field) => {
        return (
            <InputFields 
                key={field.id} 
                htmlFor={field.htmlFor} 
                label={field.label} 
                icon={field.icon} 
                field={field.field} 
                inputId={field.inputId} 
                type={field.type} 
                name={field.htmlFor} 
                value={newProduct[field.htmlFor]} 
                placeholder={field.placeholder}
                onChange={field.type === "file"? handleImageChange : handleFormData}  
                categories={categories}
                inputRef={field.type === "file"? fileInputRef : undefined } // pass ref only for file input  
                />
                
        )
    })

    return (
        <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' initial={{ opacity:0 , y: -20}} animate={{ opacity:1, y: 0}} transition={{ duration: 0.8}} > 
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                {createProductField}   

                <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'>
                    {loading? (
                        <>
                            <Loader className='animate-spin mr-2 h-5 w-5'/>
                            loading...
                        </>
                    ):(
                        <>
                            <PlusCircle className='h-5 w-5 mr-2' />
                            Create Product
                        </>
                    )}
                </button>  
            </form>            
        </motion.div>
    )
}

export default CreateProduct
