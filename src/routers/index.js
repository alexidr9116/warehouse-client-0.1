import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import LoadingScreen from '../component/custom/LoadingScreen';
import MainLayout from '../page/layout/MainLayout';
import AuthGuard from "../guard/Auth";
import ClientGuard from "../guard/Client";
import ChStaffGuard from "../guard/ChStaff";
import MnStaffGuard from "../guard/MnStaff";
import AdminGuard from "../guard/Admin";
import SuperAdminGuard from "../guard/SuperAdmin";
import GuestGuard from "../guard/Guest";
import ClientLayout from '../page/layout/ClientLayout';

const Loadable = (Component) => (props) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    )
}
export default function Router() {
    return useRoutes([
        {
            path: '/admin',
            element: <AdminGuard><MainLayout /></AdminGuard>,
            children: [
                { element: <GetProducts />, path: 'get-products/:vendorId' },
                { element: <Reviews />, path: 'reviews' },
                { element: <WarehouseSetting />, path: 'warehouse' },
                { element: <GoodsRegister />, path: 'register-new-good' },
                { element: <GetProductsHistory />, path: 'product-history' },
                { element: <PaymentHistory />, path: 'pay-histories' },
                { element: <GetProducts />, path: 'goods' },
                { element: <SuperAdminGuard><UsersList /></SuperAdminGuard>, path: 'users' },
                { element: <SuperAdminGuard><ReportedReviews /></SuperAdminGuard>, path: 'reported-reviews' }
            ]

        },
        {
            path: '/auth',
            element: <MainLayout />,
            children: [
                { element: <GuestGuard><Login /></GuestGuard>, index: true },
                { element: <GuestGuard><Login /></GuestGuard>, path: 'login' },
                { element: <GuestGuard><VerifyOTP /></GuestGuard>, path: 'verify-otp' }
            ]

        },
        {
            path: '/client',
            element: <MainLayout />,
            children: [
                { element: <ClientGuard><Products /></ClientGuard>, path: 'get-products' },
                { element: <ClientGuard><DeliveryTypeSetting /></ClientGuard>, path: 'set-delivery-products' },
                { element: <ClientGuard><MyInvoices /></ClientGuard>, path: 'get-invoices' },
                { element: <ClientGuard><InvoiceDetail /></ClientGuard>, path: 'invoice/:id' },
                { element: <ClientGuard><Notifications /></ClientGuard>, path: 'notification' },
                { element: <ClientGuard><Profile /></ClientGuard>, path: 'profile' },
                { element: <ClientGuard><Billing /></ClientGuard>, path: 'billing' }
            ]
        },
        {
            path: '/staff',
            element: <MainLayout />,
            children: [
                { element: <ChStaffGuard><StaffGoodsRegister /></ChStaffGuard>, path: 'register-goods' },
                { element: <ChStaffGuard><StaffGoodsList /></ChStaffGuard>, path: 'goods-list' },
                { element: <ChStaffGuard><StaffGoodsLeftChina /></ChStaffGuard>, path: 'left-goods' },
                { element: <MnStaffGuard><StaffGoodsArrived /></MnStaffGuard>, path: 'arrived-goods' },
            ]
        },
        {
            path: '/',
            element: <ClientLayout />,
            children: [
                { element: <ClientHome />, index: true },
                { element: <WarehouseDetails />, path: 'warehouse-review/:warehouseId' },
                { element: <ProductReviews />, path: 'product-review/:reviewId' },
                { element: <WarehouseRank />, path: 'warehouse-rank' },
                { element: <ClientGuard><Dashboard /></ClientGuard>, path: 'dashboard' },
            ]

        },
        // // Main Routes
        {
            path: '*',
            element: <ClientLayout />,
            children: [
                // { path: 'coming-soon', element: <ComingSoon /> },
                { path: 'maintenance', element: <Maintenance /> },
                // { path: 'pricing', element: <Pricing /> },
                // { path: 'payment', element: <Payment /> },
                { path: '500', element: <Page500 /> },
                { path: '404', element: <Page404 /> },
                { path: '403', element: <Page403 /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
    ])
}

const Login = Loadable(lazy(() => import("../page/auth/Login")));
const VerifyOTP = Loadable(lazy(() => import("../page/auth/VerifyOTP")));
const Profile = Loadable(lazy(() => import("../page/Profile")));
const WarehouseSetting = Loadable(lazy(() => import("../page/admin/WarehouseSetting")));
const Billing = Loadable(lazy(() => import("../page/BillingInfo")));
const ClientHome = Loadable(lazy(() => import("../page/client/Home")));
const Products = Loadable(lazy(() => import("../page/client/MyProducts")));
const MyInvoices = Loadable(lazy(() => import("../page/client/MyInvoices")));
const WarehouseRank = Loadable(lazy(() => import("../page/client/WarehouseRank")));
const InvoiceDetail = Loadable(lazy(() => import("../page/client/InvoiceDetail")));
const WarehouseDetails = Loadable(lazy(() => import("../page/client/WarehouseDetails")));
const ProductReviews = Loadable(lazy(() => import("../page/client/ProductReviews")));
const Notifications =  Loadable(lazy(() => import("../page/client/Notifications")));
const Dashboard = Loadable(lazy(() => import("../page/client/Dashboard")));
const DeliveryTypeSetting = Loadable(lazy(() => import("../page/client/DeliveryTypeSetting")));

const GoodsRegister = Loadable(lazy(() => import("../page/admin/GoodsRegister")));

const StaffGoodsRegister = Loadable(lazy(() => import("../page/staff/GoodsRegister")));
const StaffGoodsLeftChina = Loadable(lazy(() => import("../page/staff/GoodsLeftChina")));
const StaffGoodsArrived = Loadable(lazy(() => import("../page/staff/GoodsArriveUb")));
const StaffGoodsList = Loadable(lazy(() => import("../page/staff/StaffProductList")));

const UsersList = Loadable(lazy(() => import("../page/admin/UsersList")));
const PaymentHistory = Loadable(lazy(() => import("../page/admin/PaymentHistory")));
const Reviews = Loadable(lazy(() => import("../page/admin/ReportReviews")));
const ReportedReviews = Loadable(lazy(() => import("../page/admin/ReportedReviewManage")));
const GetProducts = Loadable(lazy(() => import("../page/admin/ProductList")));
const GetProductsHistory = Loadable(lazy(() => import("../page/admin/ProductListHistory")));


const Page500 = Loadable(lazy(() => import('../page/Page500')));
const Page403 = Loadable(lazy(() => import('../page/Page403')));
const Page404 = Loadable(lazy(() => import('../page/Page404')));
const Maintenance = Loadable(lazy(() => import('../page/Maintenance')));
