import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Rating from '@mui/material/Rating';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_CLIENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST } from '../../utils/API';
import { fNumber, fPrice, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';


const PER_COUNT = 10;
export default function WarehouseRank() {
    const {t} = useTranslation();
    const [filtered, setFiltered] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [searchFilter, setSearchFilter] = useState("");
    const [dynValue, setDynValue] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [loading, setLoading] = useState([]);
    const [unit, setUnit] = useState('kg');
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
        const array = reviews.slice(0, reviews.length);
        if (dynValue > 0 && unit !== "")
            array.sort((a, b) => ((a.expected > b.expected) ? 1 : ((a.expected === b.expected) ? (a.expectedY > b.expectedY ? 1 : (a.avg < b.avg ? 1 : -1)) : -1)));

        const filter = (array.filter((review) => (review?.warehouse?.name.includes(searchFilter))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));

    }
    const loadList = () => {
        setLoadingMessage("loading")
        setLoading(true);
        SEND_GET_REQUEST(`${API_CLIENT.getWarehousesByRank}`).then(res => {
            setLoading(false);
            if (res.status === 200 && res.data && res.data.reviews) {
                const data = res.data.reviews;
                setReviews(data)

            }
        }).catch(err => {
            setLoading(false);
        })
    }
    const redrawTable = () => {

        setReviews((prev) => (prev.map((review, index) => {
            console.log(review)
            const _price = (unit === "kg") ? (review?.warehouse?.price) : (review?.warehouse?.price1);
            const _priceY = (unit === "kg") ? (review?.warehouse?.priceY) : (review?.warehouse?.price1Y);
            review.expected = _price * dynValue;
            review.expectedY = _priceY * dynValue;
            return review;
        })));


    }
    useEffect(() => {
        applyFilter();
    }, [reviews, searchFilter])

    useEffect(() => {
        loadList();
    }, [])

    useEffect(() => {
        if (unit !== "" && dynValue > 0) {
            redrawTable();
        }

    }, [unit, dynValue])
    return (
        <Page title='Warehouse Ranking' className="flex w-full flex-col gap-4  p-2">
            <div className='flex w-full sm:justify-between flex-col sm:flex-row p-2 gap-2'>
                <div className='flex border rounded-lg '>
                    <input type="number" className='input text-right grow w-20' onChange={(e) => { setDynValue(e.target.value) }} value={dynValue} />
                    <select className='select select-bordered grow-0' onChange={(e) => { setUnit(e.target.value) }} value={unit}>
                        <option value={''} disabled>{t('select.unit')}</option>
                        <option value={'kg'} >{t('words.priceWith')} Kg</option>
                        <option value={'m3'}>{t('words.priceWith')} M³</option>
                    </select>
                </div>
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th>{t('table.warehouse')}</th>
                            <th>{t('table.alwaysOpen')}</th>
                            <th>{t('table.price')}(kg)</th>
                            <th>{t('table.price')}(M³)</th>
                            <th>{t('table.expected')}</th>
                            <th>{t('table.rating')}</th>
                            <th>{t('table.reviews')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={7}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((review, index) => (

                            <tr key={index}>
                                <th>
                                    {review?.warehouse?.name}
                                </th>
                                <td>
                                    {review?.warehouse?.openAlways && "Yes" || "No"}
                                </td>
                                <td>
                                    {fPrice(review?.warehouse?.price, "₮")}, {fPrice(review?.warehouse?.priceY, "¥")}
                                </td>
                                <td>
                                    {fPrice(review?.warehouse?.price1, "₮")}, {fPrice(review?.warehouse?.price1Y, "¥")}
                                </td>
                                <td>
                                    {fPrice(review?.expected, "₮")}, {fPrice(review?.expectedY, "¥")}
                                </td>
                                <td>
                                    {
                                        review?.avg && <div className='flex items-center'> {fNumber(review.avg)} <Rating readOnly value={review?.avg} /></div>
                                    }
                                </td>
                                <td>
                                    {fNumber(review?.sum)}
                                </td>
                            </tr>
                        ))

                        }
                    </tbody>

                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-4 p-1  rounded-b-lg bg-stone-200 -mt-4"}>
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