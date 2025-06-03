import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    featuredProducts: [],
    loading: false,

    setProducts: (products) => set({products}),

    createProduct: async (productData) => {
        set({loading: true})
        try {
            const res = await axios.post('/products', productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }));
            toast.success("Product Successfully Added")
        } catch (error) {
            console.log(error)
            set({loading: false})
            toast.error(error.response.data.err);            
        }
    },
    getAllProducts: async () => {
        set({loading: true})
        try {
            const response = await axios.get('/products');
            set({products: response.data, loading: false })
        } catch (error) {
            set({loading: false})
            toast.error(error.response.data.err || "failed to fetch products")
        }
    },
    fetchProductByCategory: async (category)=> {
        set({loading: true})
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({products: response.data, loading: false})
        } catch (error) {
            set({ loading: false })         
            toast.error(error.response.data.err || "failed to fetch products")   
        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({loading: true})
        try {
            const response = await axios.patch(`/products/${productId}`)
            // will Update the isFeatured prop of the product
            set((prevProductsState) => ({
                products: prevProductsState.products.map((product) => product._id === productId? {...product, isFeatured: response.data.isFeatured}: product),
                loading: false
            }))
        } catch (error) {
            set({loading: false})
            toast.error(error.response.data.err || "can't toogle featured product")
        }
    },
    fetchFeaturedProducts: async ()=> {
        set({loading: true})
        try {
            const response = await axios.get("/products/featured");
            set({ featuredProducts: response.data, loading: false })            
        } catch (error) {
            console.error(error)
        }
        finally{
            set({loading: false})
        }
    },
    deleteProduct: async (productId) => {
        set({loading: true})
        try {
            const response = await axios.delete(`/products/${productId}`)
            // will Update the product and remove the deleted one
            set((prevProductsState) => ({
                products: prevProductsState.products.filter((product) => product._id != productId),
                loading: false
            }))
            toast.success(response.data.message)
        } catch (error) {
            set({loading: false})
            toast.error(error.response.data.err || "can't toogle featured product")
        }
    }
}))