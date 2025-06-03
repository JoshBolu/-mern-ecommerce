import { create } from 'zustand';
import axios from "../../lib/axios"
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    signUp: async ({name, email, password, confirmPassword}) => {
        set({ loading: true });
        if(password !== confirmPassword) {
            set({ loading: false});
            return toast.error("Passwords do not match");
        }

        try{
            const res = await axios.post('/auth/signUp', {name, email, password});
            set({ user: res.data.user, loading: false });
            toast.success(res.data.message)
        }
        catch(error){
            set({loading: false});
            if(error.response.data.error){
                toast.error(error.response.data.error)
            }
            else if(error.response.data.message){
                toast.error(error.response.data.message)
            }
            else if(error.response.data){
                toast.error(error.response.data)
            }
            else{
                toast.error("An error occurred during sign up")
            }
        }
    },
    login: async ({email, password}) => {
        set({ loading: true });
        try{
            const res = await axios.post('/auth/login', {email, password});
            set({ user: res.data.user, loading: false });
            toast.success(res.data.message)
            console.log(get().user);
            
        }
        catch(error){
            set({loading: false});
            if(error.response.data.error){
                toast.error(error.response.data.error)
            }
            else if(error.response.data.message){
                toast.error(error.response.data.message)
            }
            else if(error.response.data){
                toast.error(error.response.data)
            }
            else{
                toast.error("An error occurred during login")
            }
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get('/auth/profile');
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
            console.log(error.response.data.message);
        }
    },
    logout: async () => {
        try{
            const res = await axios.post('/auth/logout');
            set({ user: null});
            toast.success(res.data.message)
        }
        catch(error){
            console.log(error)
            if(error.response.data.error){
                toast.error(error.response.data.error)
            }
            else if(error.response.data.message){
                toast.error(error.response.data.message)
            }
            else if(error.response.data){
                toast.error(error.response.data)
            }
            else{
                toast.error("An error occurred during logout")
            }
        }
    },
    refreshToken: async()=> {
        if(get().checkingAuth) return;

        set({ checkingAuth: true });
        try{
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false})
            return response.data
        }
        catch(error){
            set({ checkingAuth: false, user: null });
            throw error; 
        }
    },
}))

// TODO Implement the axios interceptor to refresh the token when it expires in 15m
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 & !originalRequest._retry){
            originalRequest._retry = true;

            try {
                // if refresh token is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise
                    return axios(originalRequest)
                }
                // start a new refrsh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null

                return axios(originalRequest)
            } catch ( refreshError) {
                // if refresh fails redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)