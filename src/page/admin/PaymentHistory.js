import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_CLIENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import { fPrice, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';


const PER_COUNT = 10;
export default function PaymentHistory() {
    const {t} = useTranslation();
    const [filtered, setFiltered] = useState([]);
    const [histories, setHistories] = useState([]);
    const [searchFilter, setSearchFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [detailed, setDetailed] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleChangeSearch = (value) => {
        setSearchFilter(value);
    }
    const handleConfirm = (id)=>{
        setLoading(true)
        SEND_POST_REQUEST(API_ADMIN.confirmPayment,{id}).then(res=>{
            setLoading(false)
            if(res.status === 200){
                loadList();
            }
        }).catch(err=>{
            setLoading(false)
        })
    }
    const handleNextPage = () => {
        let current = currentPage;
        if (current < (Math.ceil(filtered.length / PER_COUNT) - 1)) {
            current++;

            setPageFiltered(filtered.slice(current * PER_COUNT, Math.min((current + 1) * PER_COUNT, filtered.length)));
            setCurrentPage(current);
        }
    }
    const handlePrevPage = () => {
        let current = currentPage;
        if (current >= 1) {
            current--;
            setPageFiltered(filtered.slice(current * PER_COUNT, Math.min((current + 1) * PER_COUNT, filtered.length)));
            setCurrentPage(current);
        }
    }
    const applyFilter = () => {

        const filter = (histories.filter((hs) => ((hs.invoice.includes(searchFilter) || hs.status.includes(searchFilter) || hs.payer.mobile.includes(searchFilter)))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }

    const loadList = () => {
        setLoading(true);
        SEND_GET_REQUEST(`${API_ADMIN.getPaymentHistories}`).then(res => {
            setLoading(false);
            if (res.status === 200 && res.data && res.data.data) {
                const data = res.data.data;
                setHistories(data)

            }
        }).catch(err => {

            setLoading(false);
        })
    }

    useEffect(() => {
        applyFilter();
    }, [histories, searchFilter])


    useEffect(() => {

        loadList();
    }, [])

    return (
        <Page title='Pay Histories' className="flex w-full flex-col gap-4 p-2">
            <div className='flex w-full justify-between '>
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full'>
                    <thead>
                        <tr>
                            <th>{t('table.invoice')}</th>
                            <th>{t('table.payer')}</th>
                            <th>{t('table.productCount')}</th>
                            <th>{t('table.paymentMethods')}</th>
                            <th>{t('table.total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={5}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((history, index) => (
                            <React.Fragment key={index}>
                                <tr key={index} className='cursor-pointer' onClick={() => {
                                    const _arr = detailed.slice(0, detailed.length);
                                    if (_arr.includes(`${index}`)) {
                                        setDetailed(_arr.filter((a) => (a !== `${index}`)));
                                    }
                                    else {
                                        _arr.push(`${index}`);
                                        setDetailed(_arr);
                                    }

                                }}>
                                    <th>
                                        {history?.invoice}
                                    </th>
                                    <td>
                                        {history?.payer?.firstName}{history?.payer?.lastName}- {history?.payer?.mobile}
                                    </td>
                                    <td>
                                        {history?.products?.length}
                                    </td>
                                    <td>
                                        {history?.status === "inprogress" &&
                                            <label className='badge badge-warning'>{history?.status}</label>
                                        }
                                        {history?.status === "paid" &&
                                            <label className='badge badge-success'>{history?.status},{history?.payMethods}</label>
                                        }
                                    </td>
                                    <td>
                                        {fPrice(history?.totalCost, '₮')}
                                    </td>
                                </tr>
                                {
                                    (detailed.includes(`${index}`)) &&
                                    <tr >
                                        <td colSpan={5}>
                                            <div className='w-full overflow-auto'>
                                                <table className="w-full table table-compact">
                                                    <thead>
                                                        <tr>
                                                            <th>Product Name</th>
                                                            <th>Barcode</th>
                                                            <th>Cost</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {history?.products?.map((p, i) => (
                                                            <tr key={`sub-${i}`}>
                                                                <td>
                                                                    {p.productName}
                                                                </td>
                                                                <td>
                                                                    {p.barcode}
                                                                </td>
                                                                <td>
                                                                    {fPrice(p.cost, '₮')}
                                                                </td>
                                                            </tr>
                                                        ))
                                                        }
                                                        {
                                                            history.status === "inprogress" &&
                                                            <tr>
                                                                <td colSpan={3}>
                                                                    <div className ="flex gap-2">
                                                                        <button className='btn btn-accent btn-sm' onClick={()=>handleConfirm(history._id)}>Confirmed</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        ))

                        }
                    </tbody>
                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-10 p-1  rounded-b-lg bg-stone-200 -mt-3 "}>
                <div className='flex items-center gap-2'>

                </div>
                <div className='flex items-center  '>
                    <label >{(currentPage + 1)} of {Math.ceil(filtered.length / PER_COUNT)}</label>
                    <IconButton onClick={handlePrevPage} disabled={(currentPage === 0)} ><ArrowBack></ArrowBack></IconButton>
                    <IconButton onClick={handleNextPage} disabled={(currentPage === (Math.ceil(filtered.length / PER_COUNT) - 1))} ><ArrowForward></ArrowForward></IconButton>
                </div>

            </div>
            {loading && <LoadingScreen message='loading..' />}
        </Page>
    )
}