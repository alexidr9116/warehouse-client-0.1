import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import Rating from '@mui/material/Rating';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, CancelOutlined, CheckSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AlertModal from "../../component/core/AlertModal";
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import { API_ADMIN, API_CLIENT, API_PAYMENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import { fPrice, fSimpleDate } from '../../utils/uFormatter';
import LoadingScreen from '../../component/custom/LoadingScreen';
import useAuth from '../../hook/useAuth';
import ReviewWriteModal from './ReviewWriteModal';
import Image from '../../component/Image';
import Drawer from '../../component/Drawer';
import { useNavigate } from 'react-router-dom';
import ManuallyDialog from '../../sections/payment/ManuallyDialog';

const PER_COUNT = 10;
export default function MyProducts() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [filtered, setFiltered] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [bank, setBank] = useState({});
    const [payOwner, setPayowner] = useState({});
    const [searchFilter, setSearchFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [products, setProducts] = useState([]);           // selected products
    const [checked, setChecked] = useState([]);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [reviewModal, setReviewModal] = useState(false);
    const [invoice, setInvoice] = useState('');
    const [payModal, setPayModal] = useState(false);
    const [payment, setPayment] = useState('');
    const [manuallyPaidModal, setManullyPaidModal] = useState(false);
    const [bankList, setBankList] = useState([]);
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
        let lFilter = locationFilter;
        if (locationFilter === "all") {
            lFilter = "";
        }

        const filter = (products.filter((product) => ((product.barcode.includes(searchFilter) || product.position.includes(searchFilter) || `${product.mobile}`.includes(searchFilter)) && product.position.includes(lFilter))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }

    const loadList = () => {
        setLoadingMessage("Fetching Data from DB")
        setLoading(true);
        SEND_GET_REQUEST(`${API_CLIENT.getProducts}${user.mobile}`).then(res => {
            setLoading(false);
            if (res.status === 200 && res.data && res.data.data) {
                const data = res.data.data;
                const reviews = res.data.reviews;
                // console.log(reviews);
                data.map(row => {
                    if (reviews.length === 0) {
                        row.review = null;
                    }
                    reviews && reviews.map(review => {
                        if (row._id === review.productId) {
                            row.review = review;
                        }
                    });
                })
                setProducts(data)

            }
        }).catch(err => {
            setLoading(false);
        })
    }
    const handleReview = (id) => {
        setSelected(id);
        setReviewModal(true);

    }
    const handleManuallyPay = () => {
        setLoadingMessage("Processing with Bank System")
        setLoading(true);
        SEND_POST_REQUEST(API_WAREHOUSE.payProductWithBank, {
            warehouseId: payOwner?._id,
            productIds: checked,

        }).then(res => {
            setLoading(false)
            if (res.status === 200) {
                loadList();
            }
            else {
                toast.error(res?.message || "Error while creating invoice");
            }
        }).catch(err => {
            console.log(err);
            setLoading(false)
            toast.error("Internal Server Error");
        });
    }
    const handlePay = () => {
        setLoadingMessage("Processing with QPay System")
        setLoading(true);
        SEND_POST_REQUEST(API_WAREHOUSE.payProduct, {
            // cost: product.price,
            warehouseId: payOwner?._id,
            // name: product.title,
            // barcode: product.barcode,
            productIds: checked,
            // mobile:product.mobile,
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setBankList(res.data.bankList.urls)
                setInvoice(res.data.bankList.invoice_id)
                setPayModal(true);

            }
            else {
                toast.error(res?.message || "Error while creating invoice");
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            toast.error("Internal Server Error");
        })
    }
    const handleSelectAll = (e) => {


        if (e.target.checked) {
            const owner = ((payOwner && payOwner?._id) ? payOwner : { ...pageFiltered[0]?.warehouse });
            const _bank = ((bank && bank?.bankName) ? bank : { ...pageFiltered[0]?.owner?.bank });
            setChecked(pageFiltered.filter((product) => (product.warehouseId === owner._id && product.deliveryType && product.deliveryType !== "")).map(p => p._id));
            setBank({ ..._bank });
            setPayowner(owner);
        }
        else {
            setPayowner({});
            setChecked([]);
        }
    }

    const handleSelectOne = (e) => {
        const selectedWarehouse = payOwner?._id || "";

        if (e.target.checked) {
            if (!checked.includes(e.target.id)) {
                let copy = checked.slice(0, checked.length);

                if (selectedWarehouse === "") {

                    const product = pageFiltered.filter(p => p._id === e.target.id)[0];
                    if (product.deliveryType && product.deliveryType !== "") {

                        copy.push(e.target.id);
                        setChecked(copy);
                        setBank({ ...product?.owner?.bank });
                        setPayowner({ ...product?.warehouse });
                    }

                }
                else {
                    const product = pageFiltered.filter(p => p._id === e.target.id)[0];

                    if (product.warehouseId === selectedWarehouse && product.deliveryType && product.deliveryType !== "") {
                        copy.push(e.target.id);
                        setChecked(copy);
                        setBank({ ...product?.owner?.bank });
                        setPayowner({ ...product?.warehouse });
                    }
                }
            }
        }
        else {
            if (checked.includes(e.target.id)) {
                setChecked(checked.filter((id) => (id !== e.target.id)));
            }
        }
    }

    const handleUpdateReview = (review) => {

        setPageFiltered((prev) => (prev.map((p, index) => {
            if (p._id === review.productId) {
                p.review = review;


            }
            return p;
        })));
        setReviewModal(false);
    }
    const handleApply = () => {
        if (payment === "qpay")
            handlePay();
        if (payment === "manually") {
            setSelectedProducts(pageFiltered.filter((product) => (checked.includes(product._id))));

            setManullyPaidModal(true);
        }
    }
    const handleCancel = () => {
        setManullyPaidModal(false)
        setChecked([]);
        setBank({});
        setPayowner({});
    }
    useEffect(() => {
        applyFilter();
    }, [products, locationFilter, searchFilter])

    useEffect(() => {
        loadList();
    }, []);
    useEffect(() => {
        document.getElementsByClassName('select-all')[0].indeterminate = (checked.length > 0 && checked.length < pageFiltered.length);
        if (checked.length === 0) {
            setPayowner({});
        }
        else {


        }
    }, [checked]);
    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4">
            <div className='flex w-full justify-between p-2'>
                <select className='select select-bordered ' onChange={(e) => { (setLocationFilter(e.target.value)) }} value={locationFilter}>
                    <option value='' disabled>{t('select.location')}</option>
                    <option value='all'>{t('select.all')}</option>
                    <option value='china'>{t('select.ch')}</option>
                    <option value='coming'>{t('select.coming')}</option>
                    <option value='ub'>{t('select.ub')}</option>
                    <option value='delivery'>{t('select.delivery')}</option>
                    
                </select>
                <SearchInput handleChangeSearch={handleChangeSearch} />
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='table w-full table-compact'>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="select-all checkbox rounded-md checkbox-sm" onClick={handleSelectAll} onChange={() => { }} checked={(checked.length === pageFiltered.length)} />
                                </label>
                            </th>
                            <th>{t('table.payment')}</th>
                            <th>{t('table.barcode')}</th>
                            <th>{t('table.deliveryType')}</th>
                            <th>{t('table.price')}</th>
                            <th>{t('table.total')}</th>
                            <th>{t('table.warehouse')}</th>
                            <th>{t('table.regTime')}</th>
                            <th>{t('table.ubTime')}</th>
                            <th>{t('table.rating')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={10}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((product, index) => (

                            <tr key={index}>

                                <th>
                                    <label >
                                        <input type="checkbox" className="checkbox rounded-md checkbox-sm mt-2" id={product._id} onClick={handleSelectOne} checked={checked.includes(product._id)} onChange={() => { }} />
                                    </label>
                                </th>
                                <td>
                                    {product?.payStatus === "inprogress" &&
                                        <label className={`text-white badge badge-warning`}>{product?.payStatus}</label>}
                                    {product?.payStatus === "paid" &&
                                        <label className={`text-white badge badge-success`}>{product?.payStatus},{product?.payMethods}</label>}
                                    {product?.payStatus === "unpaid" &&
                                        <label className={`text-white badge badge-error`}>{product?.payStatus}</label>}
                                </td>
                                <td>
                                    {product?.barcode}
                                </td>
                                <td>
                                    {product?.deliveryType}
                                </td>
                                <td>
                                    {fPrice(product?.price, '₮')}
                                </td>
                                <td>
                                    +{fPrice(product?.deliveryCost, '₮')} = {fPrice((product?.price + product?.deliveryCost), '₮')}
                                </td>
                                <td>
                                    {product?.warehouse?.name}
                                </td>
                                <td>
                                    {fSimpleDate(product?.registeredAt)}
                                </td>
                                <td>
                                    {product?.arrivedUbAt ? fSimpleDate(product?.arrivedUbAt) : ''}
                                </td>

                                <td>
                                    {
                                        product.review && <div className='flex items-center'> {product.review.rate} <Rating readOnly value={product?.review?.rate} /></div>
                                    }
                                    {!product.review && <button onClick={() => handleReview(product?._id)} className=' btn btn-accent btn-sm rounded-full'>Write Review</button>}
                                </td>
                            </tr>
                        ))
                        }
                        {checked && checked.length >= 1 && payOwner && payOwner.payMethods &&
                            <tr>
                                <td colSpan={10} className="text-stone-500 font-bold">
                                    Selected:{checked.length}, Total Cost: {fPrice(pageFiltered.reduce((prev, current) => {
                                        if (checked.includes(current._id)) {
                                            return prev + current.totalCost;
                                        }
                                        return prev;
                                    }, 0), "₮")}, Supported Payments:{payOwner.payMethods}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-4 p-1  rounded-b-lg bg-stone-200 -mt-3"}>
                <div className='flex items-center gap-2'>
                    {checked && checked.length >= 1 && payOwner && payOwner.payMethods &&
                        // <button className='btn btn-accent btn-sm max-w-xs' onClick={handlePay}>Pay to '{payOwner?.warehouseName}'</button>
                        // onChange={handlePay} value={payment}
                        <>
                            <select className='select select-bordered select-sm' onChange={(e) => setPayment(e.target.value)} value={payment} >
                                <option value="" disabled >Select Option</option>
                                <option value="qpay" disabled={(payOwner.payMethods === 'manually')}>{t('words.qpay')}</option>
                                <option value="manually" disabled={(payOwner.payMethods === 'qpay')}>{t('words.manually')}</option>
                            </select>
                            {payment !== "" &&
                                <div className="flex">
                                    <IconButton onClick={handleApply} ><CheckSharp /></IconButton>
                                    <IconButton onClick={handleCancel}><CancelOutlined /></IconButton>
                                </div>
                            }
                        </>
                    }
                </div>
                <div className='flex items-center  '>
                    <label >{(currentPage + 1)} of {Math.ceil(filtered.length / PER_COUNT)}</label>
                    <IconButton onClick={handlePrevPage} disabled={(currentPage === 0)} ><ArrowBack></ArrowBack></IconButton>
                    <IconButton onClick={handleNextPage} disabled={(currentPage === (Math.ceil(filtered.length / PER_COUNT) - 1))} ><ArrowForward></ArrowForward></IconButton>
                </div>

            </div>
            <Drawer
                onClose={() => {

                    if (invoice !== "") {
                        setPayModal(false);
                        loadList();
                    }
                    else {

                    }
                }}
                open={payModal}
                side="bottom"
                className="bg-white p-8 h-2/3 "
            >
                {bankList.map((item, index) =>
                    <div className={`flex gap-5 items-center mb-3 border-b cursor-pointer}`}
                        key={index}
                    // onClick={() => { item.enable && handleCheck(item) }}
                    >
                        <div>
                            <Image src={item.logo}
                                width={50} height={50}
                            />
                        </div>
                        <a className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap" href={item.link}>

                            <label>{item.name}</label><br />
                            <label className="text-sm">{item.description}</label>
                        </a>
                    </div>
                )}
            </Drawer>
            {manuallyPaidModal && <ManuallyDialog bank={bank} products={selectedProducts} warehouse={payOwner} onAccept={handleManuallyPay} onClose={handleCancel} />}
            {reviewModal && <ReviewWriteModal onUpdateReview={handleUpdateReview} onClose={() => setReviewModal(false)} id={selected} />}
            {loading &&
                <LoadingScreen message={loadingMessage} />
            }
        </Page>
    )
}