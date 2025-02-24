import Footer from './layout/Footer'
import Header from './components/NavBar'
import { Outlet } from "react-router-dom"
import { useSelector } from 'react-redux'

export default function Layout() {

    const user = useSelector((state) => state.auth.user); // Fetch user from global state

    return (
        <div className=' pt-14 flex flex-col min-h-screen'>
            {/* Show Navbar only if the user is NOT an organizer */}
            {user?.role !== "organizer" && <Header />}
            <div className="flex-grow">
                <Outlet />
            </div>
            {user?.role !== "organizer" && <Footer />}           
        </div>
    )
}