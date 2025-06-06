import { useEffect } from 'react'
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore'
import LoadingSpinner from '../components/LoadingSpiner';
import ProductCard from '../components/ProductCard';


const CategoryPage = () => {
  const { fetchProductByCategory, loading, products } = useProductStore();
  const { category } = useParams();

  useEffect(()=> {
    fetchProductByCategory(category)
  }, [fetchProductByCategory, category])

  if(loading) return <LoadingSpinner />

  return (
    <div className='min-h-screen'>
      <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:text-5xl lg:px-8 py-16'>
          <motion.h1 className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8' initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.h1>

          <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {products?.length === 0 && (
              <h2 className='text-3xl text-center font-semibold text-gray-300 col-span-full'>
                No Products Found
              </h2>
            )}
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
      </div>  
    </div>
  )
}

export default CategoryPage