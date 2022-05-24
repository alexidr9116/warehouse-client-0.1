import axios, { SERVER_ADDRESS } from "./axios";
const API_DASHBOARD = {
    getSystemInformation:   "api/warehouse/admin/dashboard/system",
    getSentChart:           "api/warehouse/admin/dashboard/sent",
    getReceiveChart:        "api/warehouse/admin/dashboard/receive",
    
}
const API_PAYMENT = {
    getEbarimt:         "api/warehouse/payment/ebarimt",
}
const API_ADMIN = {
    getStaffProducts:   "api/warehouse/admin/staff-products/list/",
    arrivedUb:          "api/warehouse/admin/product/arrived-ub",
    leftChina:          "api/warehouse/admin/product/left-china",
    admins:             "api/warehouse/admin/admin-management",
    sendSmsNotify:       "api/warehouse/admin/product/sms-notify",
    addWarehouse:      "api/warehouse/admin/warehouse/add",
    deleteMiniVendor:   "api/warehouse/admin/vendor/delete",
    editWarehouse:     "api/warehouse/admin/warehouse/edit",
    changeVendorOwner:     "api/warehouse/admin/vendor/set-owner",
    reportReview:              "api/warehouse/admin/review/report",
    addProduct:         "api/warehouse/admin/product/add",
    editProduct:        "api/warehouse/admin/product/edit",
    getWarehouseReview:        "api/warehouse/admin/warehouse/reviews/",
    getReportedReviews:        "api/warehouse/admin/review/reported",
    changeLocation:        "api/warehouse/admin/product/change-location",
    getProducts:        "api/warehouse/admin/products/list/",
    getPaymentHistories:    "api/warehouse/payment/histories",
    editBankInformation:        "api/warehouse/admin/bank/edit",
    addBankInformation:        "api/warehouse/admin/bank/add",
    getProductsHistory:        "api/warehouse/admin/products/history/",
    deleteProduct:      "api/warehouse/admin/product/delete",
    users:                  "api/warehouse/admin/user-management",
    removeUser:             "api/warehouse/admin/user/remove",
    changeUserStatus:        "api/warehouse/admin/user/change-active",
    changeAdminStatus:        "api/warehouse/admin/user/switch-admin",
    deleteReviewAndBlock:   "api/warehouse/admin/review/delete-and-block",
    deleteReview:           "api/warehouse/admin/review/delete",
    confirmPayment:         "api/warehouse/admin/payment/confirm",
}
const API_CLIENT = {
    readNotification:       "api/warehouse/notification/read",
    deleteNotification:       "api/warehouse/notification/delete",
    getProductByBarcode:    "api/warehouse/product/get-by-barcode",
    setDeliveryType:        "api/warehouse/product/set-delivery-type",
    getWarehousesByRank:   "api/warehouse/warehouse/rank",
    getLatestReviews:   "api/warehouse/review/latest",
    getWarehouseReview:   "api/warehouse/review/detail/",
    getProductReview:   "api/warehouse/review/product/",
    getTopWarehouse:   "api/warehouse/review/top-warehouses",
    writeReview:        "api/warehouse/review/write",
    getProducts:        "api/warehouse/product/list/",
    getDeliveryProducts:        "api/warehouse/product/delivery-list/",
    getInvoices:        "api/warehouse/payment/invoice/self",
    getReceivedNotifications:    "api/warehouse/notification/received",
}
const API_WAREHOUSE = {
    getSelf:            "api/warehouse/warehouse/self",
    getProducts:        "api/warehouse/product/list/",
    payProduct:         "api/warehouse/product/pay",
    payProductWithBank:         "api/warehouse/product/pay-with-bank",
    getPayHistory:      "api/warehouse/payment/history/",
    
}
const API_AUTH = {
    login: "api/warehouse/auth/login",
    register: "api/warehouse/auth/register",
    verifyPassword: "api/warehouse/auth/verify-password",
    verifyOTP: "api/warehouse/auth/verify-otp",
    setProfileWithImage: "api/warehouse/auth/set-profile-with-image",
    setProfileWithoutImage: "api/warehouse/auth/set-profile-without-image",
    changePassword: "api/warehouse/auth/change-password",
}
const API_BILLING = {
    saveBillingInfo :'api/warehouse/auth/set-billing'
}
const ASSETS_URL = {
    root: SERVER_ADDRESS,
    image: `${SERVER_ADDRESS}uploads/images/`
}
const SEND_PUT_REQUEST = async(url, data) => {
    const response = await axios.put(url, data);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    } else {
        return [];
    }
}
const SEND_POST_REQUEST_WITH_FORM_DATA = async(url, data) => {
    const response = await axios.post(url, data);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    } else {
        return [];
    }
}
const SEND_DELETE_REQUEST = async(url, id, callback) => {
    const response = await axios.delete(`${url}/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        return [];
    }
}
const SEND_POST_REQUEST = async(url, data, callbak) => { 
    const response = await axios.post(url, data);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    } else {
        return [];
    }
    // });


}
const SEND_GET_REQUEST = async(url, data) => {
    const response = await axios.get(url, data);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    } else {
        return [];
    }
}
export {
    SEND_DELETE_REQUEST,
    SEND_POST_REQUEST,
    SEND_GET_REQUEST,
    SEND_PUT_REQUEST,
    SEND_POST_REQUEST_WITH_FORM_DATA,
    ASSETS_URL, 
    API_AUTH,
    API_ADMIN,
    API_CLIENT,
    API_BILLING,
    API_DASHBOARD,
    API_PAYMENT,
    API_WAREHOUSE
};