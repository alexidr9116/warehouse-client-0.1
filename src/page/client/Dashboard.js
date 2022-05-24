import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { API_DASHBOARD, SEND_POST_REQUEST } from "../../utils/API";
import { fNumber, fPrice, fShortDate, fSimpleDate } from "../../utils/uFormatter";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Icon } from "@iconify/react";
import Page from "../../component/Page";
import useAuth from "../../hook/useAuth";

export default function Dashboard() {
    const { t } = useTranslation();
    const {user} = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const [sentInfo, setSentInfo] = useState({ amount: 0, data: [] });
    const [receiveInfo, setReceiveInfo] = useState({ amount: 0, data: [] });
    const [systemInfo, setSystemInfo] = useState({});
    const [systemChartData, setSystemChartData] = useState({});
    const [invoices, setInvoices] = useState([]);
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    }
    useEffect(() => {
        
        async function information() {
            const _system = await SEND_POST_REQUEST(API_DASHBOARD.getSystemInformation, {});
            const _sent = await SEND_POST_REQUEST(API_DASHBOARD.getSentChart, {});
            const _receive = await SEND_POST_REQUEST(API_DASHBOARD.getReceiveChart, {});
 
            // if (_invoices.status === 200) {

            //     setInvoices(_invoices.data.list);
            // }
            if (_system.status === 200) {
                const _systemData = _system.data;
                const _allProducts = _systemData.allProducts;
                const _allPayHistory = _systemData.allPayHistory;
                const _allUsers = _systemData.allUsers;
                setInvoices(_allPayHistory.filter((invoice)=>(invoice.payer === user._id && invoice.payMethods === "qpay")));

                const info = {
                    allUsers:_allUsers.length,
                    invisible:_allUsers.filter(u=>u.status==="inactive").length,
                    active:_allUsers.filter(u=>u.status==="active").length,

                    allProducts: _allProducts.length,
                    china:_allProducts.filter(p=>p.position === "china").length,
                    ub:_allProducts.filter(p=>p.position === "ub").length,
                    coming:_allProducts.filter(p=>p.position === "coming").length,
                    
                    paidQPay: _allPayHistory.filter(b => b.payMethods === "qpay").length,
                    paidManually: _allPayHistory.filter(b => b.payMethods === "manually").length,
                }
                console.log(info,_allProducts)
                setSystemInfo(info);
                setSystemChartData([

                    { key: `${t('dashboard.china')}`, value: info.china },
                    { key: `${t('dashboard.coming')}`, value: info.coming },
                    { key: `${t('dashboard.ub')}`, value: info.ub },
                ])
                
            }
            if (_sent.status === 200) {
                const _sentData = _sent.data.months;
                let amount = 0;
                _sentData.forEach((d) => { amount += d.total });
                setSentInfo({ amount, data: _sentData });
                
            }
            if (_receive.status === 200) {
                const _receiveData = _receive.data.months;
                let amount = 0;
                _receiveData.forEach((d) => { amount += d.total });
                setReceiveInfo({ amount, data: _receiveData });
                
            }
        }
        information();
    }, [t]);
    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const mx = cx + (outerRadius) * cos;
        const my = cy + (outerRadius ) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.key}:{payload.value}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <text x={ex - (cos >= 0 ? 20 : -20) + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">Am-{`${value}`}</text>
                <text x={ex - (cos >= 0 ? 20 : -20) + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };
    return (

        <Page title="Dashboard">
            <div className="container p-2 ">
                <div className="flex flex-col sm:grid md:grid-cols-2 gap-2 items-center justify-center">
                    <div className="card bg-base-100 shadow-lg w-full  ">
                        <div className="card-body">
                            <h2 className="card-title divider text-sky-400">{t('dashboard.systemInformation')}</h2>
                            <div className="flex flex-col">
                                <div className="grid grid-cols-2">
                                    <div>
                                        <div className="text-lg font-bold">{t('dashboard.totalUsers')}-{fNumber(systemInfo?.allUsers)}</div>
                                        <div className="">{t('dashboard.active')}-{fNumber (systemInfo?.active)}</div>
                                        <div className="">{t('dashboard.inactive')}-{fNumber (systemInfo?.inactive)}</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold">{t('dashboard.allProducts')}-{systemInfo?.allProducts}</div>
                                        <div className=" ">{t('dashboard.china')}-{fNumber(systemInfo?.china)}</div>
                                        <div className=" ">{t('dashboard.coming')}-{fNumber(systemInfo?.coming)}</div>
                                        <div className=" ">{t('dashboard.ub')}-{fNumber(systemInfo?.ub)}</div>
                                    </div>
                                </div>
                                <div className="w-full h-[200px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart width={100} height={100}>
                                            <Pie
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape}
                                                data={systemChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#00d0ff"
                                                dataKey="value"
                                                onMouseEnter={onPieEnter}
                                            />

                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Sent Information */}
                    <div className="card bg-base-100 shadow-lg w-full  ">
                        <div className="card-body">
                            <h2 className="card-title divider text-sky-400"><label><Icon height={20} width={20} icon="akar-icons:arrow-up" /></label>{t('dashboard.sentInformation')}</h2>
                            <div className="flex flex-col">

                                <div className="text-lg font-bold">{t('dashboard.amount')}-{fPrice(sentInfo.amount,'₮')}</div>

                            </div>
                            <div className="w-full h-[260px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart width={350} height={200}
                                        data={sentInfo.data}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#00d0ff" activeDot={{ r: 8 }} />

                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                    {/* Receive Information */}
                    <div className="card bg-base-100 shadow-lg w-full  ">
                        <div className="card-body">
                            <h2 className="card-title divider text-sky-400"><label><Icon height={20} width={20} icon="akar-icons:arrow-down" /></label>{t('dashboard.receiveInformation')}</h2>
                            <div className="flex flex-col">

                                <div className="text-lg font-bold">{t('dashboard.amount')}-{fPrice(receiveInfo.amount,'₮')}</div>

                            </div>
                            <div className="w-full h-[260px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart width={350} height={200}
                                        data={receiveInfo.data}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}

                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#00d0ff" activeDot={{ r: 8 }} />

                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                    {/* Invoice Information */}
                    <div className="card bg-base-100 shadow-lg w-full  ">
                        <div className="card-body">
                            <h2 className="card-title divider text-sky-400"><label><Icon height={20} width={20} icon="la:file-invoice-dollar" /></label>{t('dashboard.invoiceHistory')}</h2>
                            <div className="flex flex-col w-full h-[295px] overflow-auto">
                                <div className="min-w-[550px]">
                                    {invoices.map((invoice, index) => {
                                        return (
                                            <div className="grid grid-cols-12 items-center border-0 border-b-[1px]" key={index}>

                                                <label>{index + 1}</label>
                                                <label className="col-span-4">{invoice.invoice}</label>
                                                <label className={`col-span-2 text-xs max-w-[70px] overflow-hidden text-ellipsis text-white badge ${invoice.isPaid ? "badge-info" : "badge-warning"}`}>{fPrice(invoice.totalCost,'₮')}</label>
                                                <label className="col-span-3 text-xs">{fShortDate(invoice.created)}</label>

                                                <Link className="btn btn-xs btn-info btn-outline col-span-2" to = {`/client/invoice/${invoice._id}`}>Ebarimt</Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </Page >

    )
}