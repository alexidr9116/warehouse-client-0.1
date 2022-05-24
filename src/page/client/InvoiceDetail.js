import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { API_PAYMENT, SEND_POST_REQUEST } from "../../utils/API";
import { useTranslation } from "react-i18next";
import QRcode from "react-qr-code";
import toast from 'react-hot-toast'
import Page from "../../component/Page";
import { fPrice, fShortDate } from "../../utils/uFormatter";
import { Link, useParams } from "react-router-dom";

EbarimtInvoiceModal.propTypes = {
    onClose: PropTypes.func,
    invoiceID: PropTypes.string,
};

export default function EbarimtInvoiceModal() {
    const [ebarimt, setEbarimt] = useState({});
    const [invoice, setInvoice] = useState({});
    const { id } = useParams();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        SEND_POST_REQUEST(API_PAYMENT.getEbarimt, { id }).then(
            (res) => {
                setLoading(false)
                if (res.status === 200) {
                    setEbarimt(res.data.ebarimt.data);
                    setInvoice(res.data.invoice);
                }
                else {
                    toast.error(res?.message || "Whoops, Can not get Ebarimt");
                }
            }
        );
    }, [id]);
    return (
        <Page title="Invoice Detail" className="w-full justify-center flex">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex md:col-span-2 items-center text-red-400">
                    <Icon
                        icon="arcticons:ebarimt"
                        width={80}
                        height={80}
                        className="text-bold"
                    />
                    <label className="text-2xl font-bold mt-2">EBARLIMT.MN</label>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-600 text-lg">Invoice From</label>
                    <p>Name:{invoice?.from?.firstName} {invoice?.from?.lastName}</p>
                    <p>Email:{invoice?.from?.email}</p>
                    <p>Mobile:{invoice?.from?.mobile}</p>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-600 text-lg">Invoice To</label>
                    <p>Name:{invoice?.to?.firstName} {invoice?.to?.lastName}</p>
                    <p>Email:{invoice?.to?.email}</p>
                    <p>Mobile:{invoice?.to?.mobile}</p>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full table table-compact">
                        <tbody>
                            {invoice && invoice?.products?.map((product, index) => (
                                <tr key={index}>
                                    <td>{(index+1)}</td>
                                    <td>{product.barcode}</td>
                                    <td>{product.productName}</td>
                                    <td>{fPrice(product.cost, "₮")}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={3} className='text-right'>Total</td>
                                <td >{fPrice(invoice.totalCost, "₮")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col mb-3 gap-2">
                    {!loading &&
                        <>
                            <label>Created:{fShortDate(ebarimt?.created_date)}</label>
                            <label>Amount:{fPrice(ebarimt?.amount,'₮')}</label>
                            <label>CTA:{ebarimt?.city_tax_amount}</label>
                            <label>VTA:{ebarimt?.vat_amount}</label>
                            <label>Branch:{ebarimt?.merchant_branch_code}</label>
                        </>
                    }

                    {loading &&
                        <>
                            <div className="flex items-center">Created:<div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse"></div></div>
                            <div className="flex items-center">Amount:<div className="h-2 bg-slate-200 rounded w-1/3 animate-pulse "></div></div>
                            <div className="flex items-center">CTA:<div className="h-2 bg-slate-200 rounded w-1/4 animate-pulse "></div></div>
                            <div className="flex items-center">VTA:<div className="h-2 bg-slate-200 rounded w-1/4 animate-pulse"></div></div>
                            <div className="flex items-center">Branch:<div className="h-2 bg-slate-200 rounded w-1/3 animate-pulse "></div></div>
                        </>
                    }
                </div >
                <div className="flex flex-col items-center justify-center mb-5 md:col-span-2">
                    <div className="font-bold text-lg flex w-full items-center justify-center">
                        Lottery:{ebarimt?.ebarimt_lottery} {loading && <div className="h-5 bg-slate-200 rounded w-1/3 animate-pulse"></div>}
                    </div>
                    <QRcode value={`${ebarimt?.ebarimt_qr_data}`} size={150} />

                </div>
                <div className="flex justify-center md:col-span-2">
                    <Link to="/client/get-invoices" className="btn  btn-accent rounded-full">Go to back</Link>
                </div>
            </div >
        </Page >
    );
}
