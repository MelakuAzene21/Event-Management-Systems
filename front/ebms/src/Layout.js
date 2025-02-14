import Footer from './layout/Footer'
import Header from './components/NavBar'
import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <div className=' pt-16 flex flex-col min-h-screen'>
            <Header />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}