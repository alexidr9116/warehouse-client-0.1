import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import Rating from '@mui/material/Rating';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST } from '../../utils/API';
import { fPrice, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';

import TextMaxLine from '../../component/core/TextMaxLine';
import ReportReviewModal from './ReportModal';
import ReportActionModal from './ReportActionModal';



const PER_COUNT = 10;
export default function ReportedReviewManage() {
    const {t} = useTranslation();
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [reportModal, setReportModal] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [loading, setLoading] = useState([]);
    const [selected, setSelected] = useState({});
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

        const filter = (products.filter((review) => ((review?.warehouse?.name.includes(searchFilter) || review?.product?.barcode.includes(searchFilter) || `${review?.product?.mobile}`.includes(searchFilter)))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }
    const handleReview = (review) => {
        setReportModal(true)
        setSelected(review);
    }
    const loadList = () => {
        setLoadingMessage("Fetching Data from DB")
        setLoading(true);
        SEND_GET_REQUEST(`${API_ADMIN.getReportedReviews}`).then(res => {
            setLoading(false);
            if (res.status === 200 && res.data && res.data.reviews) {
                const data = res.data.reviews;
                setProducts(data)

            }
        }).catch(err => {
            setLoading(false);
        })
    }
    const handleUpdateReview = (id) => {
        setPageFiltered((prev) => (prev.filter((p, index) => (p._id !== id))));
        setReportModal(false);
    }
    useEffect(() => {
        applyFilter();
    }, [products, searchFilter])

    useEffect(() => {

        loadList();
    }, [])
    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4">
            <div className='flex w-full justify-between p-2'>

                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th>{t('table.publisher')}</th>
                            <th>{t('table.payment')}</th>
                            <th>{t('table.barcode')}</th>
                            <th>{t('table.price')}</th>
                            <th>{t('table.regTime')}</th>
                            <th>{t('table.ubTime')}</th>
                            <th>{t('table.comment')}</th>
                            <th>{t('table.published')}</th>
                            <th>{t('table.rating')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={10}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((review, index) => (

                            <tr key={index}>
                                <th>
                                    {review?.publisher?.firstName} {review?.publisher?.lastName}-{review?.publisher?.mobile}
                                </th>

                                <td>{review?.warehouse?.name}</td>
                                <td>
                                    {review?.product?.payStatus !== "unpaid" &&
                                        <label className={`text-white badge badge-success`}>{review?.product?.payStatus},{review?.product?.payMethods}</label>}
                                    {review?.product?.payStatus === "unpaid" &&
                                        <label className={`text-white badge badge-warning`}>{review?.product?.payStatus}</label>}
                                </td>
                                <td>
                                    {review?.product?.barcode}
                                </td>

                                <td>
                                    {fPrice(review?.product?.price, '₮')}
                                </td>

                                <td>
                                    {fSimpleDate(review?.product?.registeredAt)}
                                </td>
                                <td>
                                    {review?.product?.arrivedUbAt ? fSimpleDate(review?.product?.arrivedUbAt) : ''}
                                </td>
                                <td>
                                    {fSimpleDate(review?.createdAt)}
                                </td>
                                <td>
                                    {
                                        review && <div className='flex items-center'> {review.rate} <Rating readOnly value={review?.rate} /></div>
                                    }
                                </td>
                                <td>
                                    {review && <button onClick={() => handleReview(review)} className=' btn btn-accent btn-sm rounded-full'>{t('words.view')}</button>}
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
            {reportModal && <ReportActionModal onUpdateReview={handleUpdateReview} onClose={() => setReportModal(false)} id={selected._id} review={selected} />}
            {loading &&
                <LoadingScreen message={loadingMessage} />
            }
        </Page>
    )
}