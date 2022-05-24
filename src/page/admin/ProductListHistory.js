import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import AlertModal from "../../component/core/AlertModal";
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_CLIENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import { fPrice, fShortDate, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';

const PER_COUNT = 10;
export default function ProductListHistory() {
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [searchFilter, setSearchFilter] = useState("");
    
    const [currentPage, setCurrentPage] = useState(0);
    
    const [pageFiltered, setPageFiltered] = useState([]);
     
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
     
        const filter = (products.filter((product) => ((product.barcode.includes(searchFilter) || product.operation.includes(searchFilter) || product.value.includes(searchFilter)))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }
    const loadList = () => {
        if (warehouse && warehouse._id)
            SEND_GET_REQUEST(`${API_ADMIN.getProductsHistory}${warehouse._id}`).then(res => {

                if (res.status === 200 && res.data && res.data.data) {
                    const data = res.data.data;
                    setProducts(data)

                }
            })
    }
    useEffect(() => {
        SEND_GET_REQUEST(API_WAREHOUSE.getSelf).then(res => {
            if (res.status === 200) {
                setWarehouse(res.data.warehouse);
            }
            else {
                toast.error("Please select your warehouse");
            }
        })

    }, [])

    useEffect(() => {
        applyFilter();
    }, [products,  searchFilter])
    useEffect(() => {
        if (warehouse && warehouse._id)
            loadList();
    }, [warehouse])
    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4">
            <div className='flex w-full justify-between p-2'>
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    {/* <input type="checkbox" className="checkbox rounded-md checkbox-sm" onChange={handleSelectAll} /> */}
                                </label>
                            </th>
                            <th>Barcode</th>
                            <th>Mobile</th>
                            <th>Operation</th>
                            <th>Result</th>
                            <th>Amount</th>
                            <th>Value</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={8}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((product, index) => (
                            <tr key={index}>
                                <td>
                                    <label>
                                        {index+1}
                                    </label>
                                </td>
                                <td>
                                    {product.barcode}
                                </td>
                                <td>
                                    {product.mobile}
                                </td>
                                <td>
                                    {product.operation}
                                </td>
                                <td>
                                    <label className = {`badge ${product.result ==='success'?"badge-info":"badge-warning"}`}> {product.result}</label>
                                   
                                </td>
                                <td>
                                    {product.amount}
                                </td>
                                <td>
                                    {product.value}
                                </td>
                                <td>
                                    {fShortDate(product.timestamp)}
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
        </Page>
    )
}