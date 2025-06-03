import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from '../../lib/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpiner'

const PeopleAlsoBought = () => {

  const [ recommendations, setRecommendations ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(() => {
    
    const fetchRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("/products/recommended");
        setRecommendations(response.data)
      } catch (error) {
        toast.error( error.response.data.message ||'Failed to fetch recommendations')   
        setIsLoading(false)     
      }
      finally{
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if(isLoading){ return <LoadingSpinner /> }

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>
        People Also Bought
      </h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

      </div>
    </div>
  )
}

export default PeopleAlsoBought