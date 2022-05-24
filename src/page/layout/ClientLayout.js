import { Outlet } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { AdminRouters } from "../../routers/AdminRouters";
import { DefaultRouters } from "../../routers/DefaultRouters";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";


export default function ClientLayout() {
    const { user, isAuthenticated } = useAuth();
    return (
        <main className='min-h-screen overflow-hidden relative'>
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
}