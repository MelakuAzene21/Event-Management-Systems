import Footer from './layout/Footer'
import Header from './components/NavBar'
import { Outlet } from "react-router-dom"
import { useSelector } from 'react-redux'

export default function Layout() {

    const user = useSelector((state) => state.auth.user); // Fetch user from global state

    return (
        <div className='  flex flex-col min-h-screen'>
            {/* Show Navbar only if the user is NOT an organizer */}
            {user?.role !== "organizer" && <Header />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {user?.role !== "organizer" && <Footer />}           
        </div>
    )
}