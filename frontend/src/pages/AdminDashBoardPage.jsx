import { motion } from "framer-motion"
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react"
import { useState } from "react"
import { useEffect } from "react"
import CreateProduct from "../components/CreateProduct"
import ProductsList from "../components/ProductsList"
import AnalyticsTab from "../components/AnalyticsTab"
import { useProductStore } from "../stores/useProductStore"

const tabs = [
  {id: "create", label: "Create Product", icon: PlusCircle },
  {id: "products", label: "Products", icon: ShoppingBasket },
  {id: "analytics", label: "Analytics", icon: BarChart },
]

const AdminDashBoardPage = () => {
  const [ activeTab, setActiveTab] = useState("create")

  const { getAllProducts } = useProductStore()

  useEffect(() => {
      getAllProducts()
    }, [getAllProducts])

  const tabsMap = tabs.map( (tab)  => {
    return <button key = {tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
      <tab.icon className="mr-2 h-5 w-5" />                  
      {tab.label}
    </button>
  })

  return (
    <div className="min-h-scree text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1 className="text-4xl font-bold mb-8 text-emerald-400 text-center" initial={{ opacity:0 , y: -20}} animate={{ opacity:1, y: 0}} transition={{ duration: 0.8}} > 
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabsMap}
        </div>
        
        <motion.div initial={{ opacity:0 , y: -20}} animate={{ opacity:1, y: 0}} transition={{ duration: 0.8}} >
          {activeTab === "create" && <CreateProduct />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}  
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashBoardPage