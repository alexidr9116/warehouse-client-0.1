import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import AlertModal from "../../component/core/AlertModal";
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_CLIENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import { fPrice, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';

const PER_COUNT = 10;
export default function StaffProductList() {
    const [location, setLocation] = useState('');
    const [checkModal, setCheckModal] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [searchFilter, setSearchFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [smsModal, setSmsModal] = useState(false);
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
        let lFilter = locationFilter;
        if (locationFilter === "all") {
            lFilter = "";
        }

        const filter = (products.filter((product) => ((product.barcode.includes(searchFilter) || product.position.includes(searchFilter) || `${product.mobile}`.includes(searchFilter)) && product.position.includes(lFilter))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }
    const loadList = () => {
        if (warehouse && warehouse._id)
            SEND_GET_REQUEST(`${API_ADMIN.getStaffProducts}${warehouse._id}`).then(res => {

                if (res.status === 200 && res.data && res.data.data) {
                    const data = res.data.data;
                    setProducts(data)

                }
            })
    }
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(pageFiltered.map((product) => product._id));
        }
        else {
            setSelected([]);
        }
    }

 
    const handleSelectOne = (e) => {
        if (e.target.checked) {
            if (!selected.includes(e.target.id)) {
                let copy = selected.slice(0, selected.length);
                copy.push(e.target.id);

                setSelected(copy);
            }
        }
        else {

            if (selected.includes(e.target.id)) {
                setSelected(selected.filter((id) => (id !== e.target.id)));
            }
        }
    }
    const handleChangeLocation = (e) => {
        setLocation(e.target.value);
        setCheckModal(true);
    }
   const handleAccept = () => {

        SEND_POST_REQUEST(`${API_ADMIN.changeLocation}`, { selected, position: location }).then(res => {
            setCheckModal(false);
            if (res.status === 200) {
                loadList();
                if (location === "ub" || location === "coming")
                    setSmsModal(true);
            }
            else {
                toast.error(res.message);
            }
        }).catch(err => {
            setCheckModal(false);
            toast.error("Server Error");
        });
    }
    useEffect(() => {
        if (smsModal && (location === "coming" || location === "ub")) {
            SEND_POST_REQUEST(`${API_ADMIN.sendSmsNotify}`, { selected, position: location }).then(res => {
                setSmsModal(false);

                if (res.status === 200) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }
            }).catch(err => {

                setSmsModal(false);
                toast.error("Server Error");
            });
        }
    }, [smsModal])
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
    }, [products, locationFilter, searchFilter])
    useEffect(() => {
        if (warehouse && warehouse._id)
            loadList();
    }, [warehouse])

    useEffect(()=>{
        
        document.getElementsByClassName('select-all')[0].indeterminate = (selected.length >0 && selected.length<pageFiltered.length);
        
        
    },[selected]);
    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4">
            <div className='flex w-full justify-between p-2'>
                <select className='select select-bordered ' onChange={(e) => { (setLocationFilter(e.target.value)) }} value={locationFilter}>
                    <option value='' disabled>Select Status..</option>
                    <option value='all'>All</option>
                    <option value='china'>China</option>
                    <option value='coming'>Coming</option>
                    <option value='ub'>Ulaanbaatar</option>
                    <option value='delivery'>Delivery</option>
                    <option value='completed'>Completed</option>
                </select>
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="select-all checkbox rounded-md checkbox-sm" onClick={handleSelectAll} onChange = {()=>{}} checked = {(selected.length === pageFiltered.length)} />
                                </label>
                            </th>
                            <th>Barcode</th>
                            <th>Mobile</th>
                            <th>Price(¥)</th>
                            <th>Location</th>
                            <th>PayStatus</th>
                            <th>RegTime</th>
                            <th>UbTime</th>

                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={8}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((product, index) => (
                            <tr key={index}>
                                <th>
                                    <label >
                                        <input type="checkbox" className="checkbox rounded-md checkbox-sm mt-2" id={product._id} onClick={handleSelectOne} checked={selected.includes(product._id)} onChange = {()=>{}} />
                                    </label>

                                </th>
                                <td>
                                    {product.barcode}
                                </td>
                                <td>
                                    {product.mobile}
                                </td>
                                <td>
                                    {fPrice(product.priceY, '¥')}
                                </td>
                                <td>
                                    {product.position}
                                </td>
                                <td>
                                {product?.payStatus === "paid" && <label className={`text-white badge uppercase badge-success`}>{product?.payStatus},{product?.payMethods}</label>}
                                {product?.payStatus === "unpaid" && <label className={`text-white badge uppercase badge-error`}>{product?.payStatus}</label>}
                                {product?.payStatus === "inprogress" && <label className={`text-white badge uppercase badge-warning`}>{product?.payStatus}</label>}
                                </td>
                                <td>
                                    {fSimpleDate(product.registeredAt)}
                                </td>
                                <td>
                                    {product.arrivedUbAt ? fSimpleDate(product.arrivedUbAt) : ''}
                                </td>

                            </tr>
                        ))

                        }
                    </tbody>
                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-10 p-1  rounded-b-lg bg-stone-200 -mt-3 "}>
                <div className='flex items-center gap-2'>
                    {/* <input type="checkbox" className='checkbox ml-1' onChange={handleSelectAll} /> */}
                    {selected && selected.length >= 1 &&
                        <select className='select select-bordered select-sm' onChange={handleChangeLocation} value={location}>
                            <option value="" disabled >Select Option</option>
                            <option value="coming">Left from China</option>
                            <option value="payment" disabled >Select Action</option>
                            <option value="remove">Delete ({selected.length}) </option>
                        </select>
                    }
                </div>
                <div className='flex items-center  '>
                    <label >{(currentPage + 1)} of {Math.ceil(filtered.length / PER_COUNT)}</label>
                    <IconButton onClick={handlePrevPage} disabled={(currentPage === 0)} ><ArrowBack></ArrowBack></IconButton>
                    <IconButton onClick={handleNextPage} disabled={(currentPage === (Math.ceil(filtered.length / PER_COUNT) - 1))} ><ArrowForward></ArrowForward></IconButton>
                </div>

            </div>
            {checkModal &&
                <AlertModal description={`Do you want to change selected good's status to ${location}? If you will proceed this action, SMS will be send to clients`} title='Change Product`s Status, Really?' onAccept={handleAccept} onCancel={() => setCheckModal(false)} />
            }
            {smsModal &&
                <LoadingScreen message="Sending SMS Notification" />
            }

        </Page>
    )
}