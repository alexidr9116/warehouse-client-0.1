export const AdminRouters = [
    {
        path: "/dashboard",
        value: "menu.dashboard",
    },
    {
        path: "/client/profile",
        value: "menu.profile",
    },
    {
        path: "/client/billing",
        value: "menu.billing",
    },
    {
        path: "/client/get-products",
        value: "menu.myOrder",
    },
    {
        path: "/client/set-delivery-products",
        value: "menu.deliveryType",
    },
    
    {
        path: "/client/get-invoices",
        value: "menu.invoice",
    },
    {
        path: "/warehouse-rank",
        value: "menu.warehouseRank",
    },
    {
        path:'/client/notification',
        value:'menu.notification'
    },
    {
        path: "#",
        value: "Management",
        elements: [
            {
                path: "/admin/warehouse",
                value: "menu.warehouse",
            },
            {
                path: "/admin/goods",
                value: "menu.goods",
            },
            {
                path: "/admin/reviews",
                value: "menu.reviews",
            },
            {
                path: "/admin/pay-histories",
                value: "menu.payHistory",
            },
            {
                path: "/admin/reported-reviews",
                value: "menu.reportedReview",
            },
            {
                path: "/admin/product-history",
                value: "menu.goodsHistory",
            },
            {
                path: "/admin/users",
                value: "menu.users",
            },
        ],
    },
 
]