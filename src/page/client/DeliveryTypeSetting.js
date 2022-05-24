import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, CancelOutlined, CheckBoxOutlineBlank, CheckCircleRounded, CheckSharp, ConfirmationNumberRounded } from '@mui/icons-material';
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

const PER_COUNT = 10;
export default function DeliveryTypeSetting() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    
    const [payOwner, setPayowner] = useState({});
    const [searchFilter, setSearchFilter] = useState("");
    
    const [currentPage, setCurrentPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [checked, setChecked] = useState([]);
    const [pageFiltered, setPageFiltered] = useState([]);
    const [reviewModal, setReviewModal] = useState(false);
    const [invoice, setInvoice] = useState('');
    const [payModal, setPayModal] = useState(false);
    const [deliveryType, setDeliveryType] = useState('');
    const [changed, setChanged] = useState([]);
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
        

        const filter = (products.filter((product) => ((product.barcode.includes(searchFilter) || product.position.includes(searchFilter) || `${product.mobile}`.includes(searchFilter)))));

        setFiltered(filter);

        setPageFiltered(filter.slice(currentPage * PER_COUNT, Math.min((currentPage + 1) * PER_COUNT, filter.length)));
    }

    const loadList = () => {
        setLoadingMessage("Loading")
        setLoading(true);
        SEND_GET_REQUEST(`${API_CLIENT.getDeliveryProducts}${user.mobile}`).then(res => {
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
    const handleApply = (id) => {
        SEND_POST_REQUEST(API_CLIENT.setDeliveryType, { data: changed }).then(res => {
            setChecked([])
            setChanged([]);
            if (res.status === 200) {
                toast.success(res.message)
            }
            else {

                toast.error(res.message);
            }
        }).catch(err => {
            setChecked([])
            setChanged([]);
            console.log(err);
            toast.error("Internal server error");
        })

    }
    const handleCancle = () => {
        setChecked([]);
        setChanged([])
        loadList();
    }
    const handleDeliveryType = (e) => {
        const type = e.target.value;
        const changedValues = [];

        if (type === "general") {
            const arr = pageFiltered.slice(0, pageFiltered.length);
        
            for (const product of arr) {
        
                if (checked.includes(product._id)) {
                    product.deliveryCost = product.price * (payOwner?.deliveryCost1 || 10) / 100;
                    product.deliveryType = type;

                    changedValues.push({ id: product._id, deliveryType: type, deliveryCost: product.deliveryCost });
                }
            }
            setPageFiltered(arr);
            setChanged(changedValues);
        }
        if (type === "pick-box") {
            const arr = pageFiltered.slice(0, pageFiltered.length);
            for (const product of arr) {

                if (checked.includes(product._id) && product.price < (payOwner?.deliveryCost2 || 40000)) {
                    product.deliveryCost = 0;
                    product.deliveryType = type;
                    changedValues.push({ id: product._id, deliveryType: type, deliveryCost: product.deliveryCost });
                }
            }
            setPageFiltered(arr);
            setChanged(changedValues);

        }
        if (type === "personal") {
            const arr = pageFiltered.slice(0, pageFiltered.length);
            for (const product of arr) {

                if (checked.includes(product._id)) {
                    product.deliveryCost = payOwner?.deliveryCost3 || 0;
                    product.deliveryType = type;

                    changedValues.push({ id: product._id, deliveryType: type, deliveryCost: product.deliveryCost });
                }
            }
            setPageFiltered(arr);
            setChanged(changedValues);

        }
        setDeliveryType(e.target.value);

    }
    const handleSelectAll = (e) => {


        if (e.target.checked) {
            const owner = ((payOwner && payOwner.warehouseId) ? payOwner : { warehouseId: pageFiltered[0]?.warehouseId, ...pageFiltered[0]?.warehouse });
            setChecked(pageFiltered.filter((product) => (product.warehouseId === owner.warehouseId)).map(p => p._id));
            setPayowner(owner);
        }
        else {
            setPayowner({});
            setChecked([]);
        }
    }


    const handleSelectOne = (e) => {
        const selectedWarehouse = payOwner?.warehouseId || "";

        if (e.target.checked) {
            if (!checked.includes(e.target.id)) {
                let copy = checked.slice(0, checked.length);
                if (selectedWarehouse === "") {
                    copy.push(e.target.id);
                    setChecked(copy);
                    const owner = pageFiltered.filter(p => p._id === e.target.id)[0];
                    setPayowner({ warehouseId: owner?.warehouseId, ...owner.warehouse});

                }
                else {
                    const owner = pageFiltered.filter(p => p._id === e.target.id)[0];

                    if (owner.warehouseId === selectedWarehouse) {
                        copy.push(e.target.id);
                        setChecked(copy);
                        setPayowner({ warehouseId: owner?.warehouseId, ...owner.warehouse});
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

    useEffect(() => {
        applyFilter();
    }, [products, searchFilter])

    useEffect(() => {
        loadList();
    }, []);
    useEffect(() => {
        document.getElementsByClassName('select-all')[0].indeterminate = (checked.length > 0 && checked.length < pageFiltered.length);
        if (checked.length === 0) {
            setPayowner({});
        }
    }, [checked]);
    return (
        <Page title='Product Management' className="flex w-full flex-col gap-4  p-2">
            <div className='flex w-full justify-between'>

                <SearchInput handleChangeSearch={handleChangeSearch} button={false} />
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
                            <th>{t('table.warehouse')}</th>
                            <th>{t('table.location')}</th>
                            <th>{t('table.barcode')}</th>
                            <th>{t('table.deliveryType')}</th>
                            <th>{t('table.price')}</th>
                            <th>{t('table.total')}</th>

                            <th>{t('table.regTime')}</th>
                            <th>{t('table.ubTime')}</th>

                        </tr>
                    </thead>
                    <tbody>
                        {pageFiltered.length === 0 && <tr><td colSpan={9}><div className='text-lg text-center p-4'>No data display</div></td></tr>}
                        {pageFiltered && pageFiltered.map((product, index) => (
                            <tr key={index}>
                                <th>
                                    <label >
                                        <input type="checkbox" className="checkbox rounded-md checkbox-sm mt-2" id={product._id} onClick={handleSelectOne} checked={checked.includes(product._id)} onChange={() => { }} />
                                    </label>
                                </th>

                                <td>
                                    {product?.warehouse?.name}
                                </td>

                                <td className="uppercase">
                                    {product?.position}
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
                                    {fSimpleDate(product?.registeredAt)}
                                </td>
                                <td>
                                    {product?.arrivedUbAt ? fSimpleDate(product?.arrivedUbAt) : ''}
                                </td>


                            </tr>
                        ))

                        }
                        {payOwner && payOwner?.name &&
                        <tr>
                            <td colSpan={9}>
                                {t('words.warehouse')}:{payOwner?.name},{t('client.deliveryCost1')}:{fPrice(payOwner?.deliveryCost1,'₮')}%,{t('client.deliveryCost2')}:less than{fPrice(payOwner?.deliveryCost2,'₮')} ,{t('client.deliveryCost3')}:{fPrice(payOwner?.deliveryCost3,'₮')} 
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>

            </div>
            <div className={"flex justify-between w-full items-center mb-4 p-1  rounded-b-lg bg-stone-200 -mt-3"}>
                <div className='flex items-center gap-2'>
                    {checked && checked.length >= 1 &&
                        <select className='select select-bordered select-sm' onChange={handleDeliveryType} value={deliveryType}>
                            <option value="" disabled >{t('select.deliveryOption')}</option>
                            <option value="general">{t('select.general')}</option>
                            <option value="pick-box">{t('select.box')}</option>
                            <option value="personal">{t('select.personal')}</option>
                        </select>
                    }
                    {changed.length >= 1 &&
                        <div className="flex">
                            <IconButton onClick={handleApply} ><CheckSharp /></IconButton>
                            <IconButton onClick={handleCancle}><CancelOutlined /></IconButton>
                        </div>
                    }
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