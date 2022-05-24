import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useAuth from "../hook/useAuth";
import toast from 'react-hot-toast';
import Page from '../component/Page';
import { API_ADMIN, API_BILLING, SEND_POST_REQUEST, SEND_PUT_REQUEST } from "../utils/API";
import LoadingScreen from '../component/custom/LoadingScreen';
import QPayBilling from "../sections/billing/QPayBilling";
import BankBilling from "../sections/billing/BankBilling";

export default function BillingInfo() {
    const { user,initialize } = useAuth();
    const [checked, setChecked] = useState((user?.role.includes("admin")));
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(1);
    const {t} = useTranslation();

    
    const onSubmitQPay = (data) => {
        setLoading(true)
        SEND_POST_REQUEST(API_BILLING.saveBillingInfo, { ...data, role: "admin" }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                toast.success(res.message);
                initialize();
            }
            else {
                toast.error(res.message);
            }
        });

    }
    const onSubmitBank = (data) => {
        const iData = new FormData();
        
        const {
            bankQr, bankAccountName,bankAccountNumber,bankName } = data;

        iData.append("bankQr", bankQr);
        iData.append("bankName",bankName);
        iData.append("bankAccountName", bankAccountName);
        iData.append("bankAccountNumber", bankAccountNumber);

        if (typeof bankQr === "string") {
            if(bankQr === ""){
                toast.error("Select QR Image..");
                return;
            }
            setLoading(true)    
            SEND_PUT_REQUEST(API_ADMIN.editBankInformation, { ...data}).then(res => {
                setLoading(false)
                if (res.status === 200) {
                    toast.success(res.message);
                    initialize();
                }
                else {
                    toast.error(res.message);
                }

            }).catch(err=>{
                toast.error("Internal Server Error");
                setLoading(false)
            });
        }
        if (typeof bankQr === "object") {
            setLoading(true)
            SEND_PUT_REQUEST(API_ADMIN.addBankInformation, iData).then(res => {
                setLoading(false)
                if (res.status === 200) {
                    toast.success(res.message);
                    initialize();
                }
                else {
                    toast.error(res.message);
                }
            }).catch(err=>{
                toast.error("Internal Server Error");
                setLoading(false)
            });
        }
    }
    return (
        <Page title={`Billing Info`}>
            <div className="container px-5 py-8 text-gray-700">
                <p className=" font-bold text-2xl mb-5">{t('words.billing')}</p>
                <div className="grid md:grid-cols-2 gap-5 rounded-2xl shadow-lg bg-white">

                    <div className=" md:col-span-2   p-6 gap-3">

                        {/* <div className="w-full">
                            <label className="label cursor-pointer">
                                <span className="label-text mx-2 text-lg uppercase">work with admin</span>
                                <input type="checkbox" className="toggle toggle-accent" onChange={() => { setChecked(!checked) }} checked={checked} />
                            </label>
                        </div> */}
                        <div className="tabs mb-4" >
                            <div className={`tab tab-lifted ${currentTab === 1 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(1) }}>QPay</div>
                            <div className={`tab tab-lifted ${currentTab === 2 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(2) }}>Bank</div>
                            <div className="tab tab-lifted mr-6 flex-1 cursor-default"></div>
                        </div>
                        {currentTab === 1 &&
                            <QPayBilling onSubmit={onSubmitQPay} checked={checked} />
                        }
                        {currentTab === 2 &&
                            <BankBilling onSubmit={onSubmitBank} checked={checked} />
                        }

                    </div>
                </div>
            </div>
            {loading && <LoadingScreen message="Saving.." />}
        </Page>
    )


}
