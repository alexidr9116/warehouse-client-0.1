import { Outlet } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { AdminRouters } from "../../routers/AdminRouters";
import { StaffRouters } from "../../routers/StaffRouters";
import { DefaultRouters } from "../../routers/DefaultRouters";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

export default function MainLayout() {
    const { user, isAuthenticated } = useAuth();
    return (
        <main className='px-auto container'>
            <Header />
            <div className="flex w-full">
                {isAuthenticated &&
                    <div className="hidden sm:block p-2">
                        <Navbar routers={(user && user.role.includes('admin') ? AdminRouters : (user.role.includes ('Staff') ? StaffRouters : DefaultRouters))}>
                        </Navbar>
                    </div>
                }
                <div className="flex overflow-x-auto justify-center w-full">
                    <Outlet />
                </div>
            </div>

            <Footer />
        </main>
    );
}