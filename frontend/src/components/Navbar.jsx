import { Link } from 'react-router-dom'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
    const { user, logout } = useUserStore();
    const { cart } = useCartStore();
    const userIsAdmin = user&&user.role === "admin"? true: false;
    // const userIsAdmin = true

    return (
        <header className=' fixed top-0 left-0 w-full bg-gray-900 z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto flex justify-between w-full items-center px-4 py-3'>
                <Link to="/" className='text-2xl font-bold text-emerald-400 flex items-center'>E-Commerce</Link>
                <nav className='flex flex-wrap items-center gap-4'>
                    <Link to={"/"} className='text-grey-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>
                    {user && (
                        <Link to={"/cart"} className='relative group text-grey-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                            <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                            <span className='hidden sm:inline'>Cart</span>
                            {cart.length != 0 && <span className='absolute -top-2 -left-2 bg-emerald-500 text-gray-900 rounded-full p-2 w-2 h-2 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out flex justify-center items-center'>{cart.length}</span>}
                        </Link>
                    )}
                    {userIsAdmin && (
                        <Link to={"/adminDashboard"} className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'>
                            <Lock className='inline-block mr-1' size={18} />
                            <span className='hidden sm:inline'>Dashboard</span>
                        </Link>
                    )}
                    { user ? (
                        <button className='bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center transition' onClick={logout}>
                            <LogOut className='inline-block mr-1' size={18} />
                            <span className='hidden sm:inline'>Logout</span>
                        </button>
                    ) : (
                        <>
                            <Link to={"/signUp"} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out ">
                                <UserPlus className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Sign Up</span>
                            </Link>
                            <Link to={"/login"} className="bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out ">
                                <LogIn className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Login</span>
                            </Link>
                        </>
                        
                    )}
                </nav>
            </div>
            
        </header>
    
  )
}

export default Navbar