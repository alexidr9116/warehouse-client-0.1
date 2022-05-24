import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_CLIENT,  SEND_POST_REQUEST } from '../../utils/API';
import { fPrice, fShortDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PER_COUNT = 10;
export default function MyInvoices() {
    const {t} = useTranslation(); 
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchFilter, setSearchFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [loading, setLoading] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState("");
    const handleChangeSearch = (value) => {
        setSearchFilter(value);
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

        const filter = (products.filter((product) => (product?.warehouse?.name.includes(searchFilter) || product?.payMethods.includes(searchFilter))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }
    const loadList = () => {
        setLoadingMessage("Loading..")
        setLoading(true);
        SEND_POST_REQUEST(`${API_CLIENT.getInvoices}`).then(res => {
            setLoading(false);
            if (res.status === 200 && res.data && res.data.historyArray) {
                const data = res.data.historyArray;
                setProducts(data)

            }
        }).catch(err => {
            setLoading(false);
        })
    }

    useEffect(() => {
        applyFilter();
    }, [products, searchFilter])

    useEffect(() => {
        loadList();
    }, []);

    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4">
            <div className='flex w-full justify-between p-2'>
                {/* <select className='select select-bordered ' onChange={(e) => { (setLocationFilter(e.target.value)) }} value={locationFilter}>
                    <option value='' disabled>Select Location..</option>
                    <option value='all'>All</option>
                    <option value='china'>China</option>
                    <option value='coming'>Coming</option>
                    <option value='ub'>Ulaanbaatar</option>
                    <option value='delivery'>Delivery</option>
                    <option value='completed'>Completed</option>
                </select> */}
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full '>
                    <thead>
                        <tr>
                            <th>{t('table.warehouse')}</th>
                            <th>{t('table.invoice')}</th>
                            <th>{t('table.price')}</th>
                            <th>{t('table.productCount')}</th>
                            <th>{t('table.time')}</th>
                            <th>{t('table.payment')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={8}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((history, index) => (

                            <tr key={index}>

                                <td>
                                    {history?.warehouse?.name}
                                </td>
                                <td>
                                    {history?.status === "paid" && history?.payMethods === "qpay" &&
                                        <Link to={`/client/invoice/${history._id}`} className='text-accent cursor-pointer' >{history?.invoice}</Link>
                                    }
                                    {(history?.status === 'unpaid' || history?.payMethods !== "qpay") && <label>{history?.invoice}</label>}

                                </td>

                                <td>
                                    {fPrice(history?.totalCost, '₮')}
                                </td>
                                <td>
                                    {history?.productIds?.length}
                                </td>
                                <td>
                                    {fShortDate(history?.updated)}
                                </td>
                                <td>
                                    {history?.payMethods}
                                </td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-4 p-1  rounded-b-lg bg-stone-200 -mt-3"}>
                <div className='flex items-center gap-2'>
                </div>
                <div className='flex items-center  '>
                    <label >{(currentPage + 1)} of {Math.ceil(filtered.length / PER_COUNT)}</label>
                    <IconButton onClick={handlePrevPage} disabled={(currentPage === 0)} ><ArrowBack></ArrowBack></IconButton>
                    <IconButton onClick={handleNextPage} disabled={(currentPage === (Math.ceil(filtered.length / PER_COUNT) - 1))} ><ArrowForward></ArrowForward></IconButton>
                </div>

            </div>
            {loading &&
                <LoadingScreen message={loadingMessage} />
            }
        </Page>
    )
}