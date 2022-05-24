import { useEffect, useState, useTransition } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Page from "../../component/Page";
import SearchInput from '../../component/core/SearchInput';

import TextMaxLine from '../../component/core/TextMaxLine';
import Image from '../../component/Image';
import { API_ADMIN, API_CLIENT, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import Drawer from '../../component/Drawer';
import LoadingScreen from '../../component/custom/LoadingScreen';
import toast from 'react-hot-toast';

export default function GetProducts() {
    const {t} = useTranslation();
    const { vendorId } = useParams();
    const [invoice, setInvoice] = useState('');
    const [payModal, setPayModal] = useState(false);
    const [current, setCurrent] = useState(null);
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('loading..');
    const navigate = useNavigate();
    const handleChangeSearch = () => {


    }
    const handleChangePage = () => {

    }
    const loadList = () => {
        if (vendorId)
            SEND_GET_REQUEST(`${API_CLIENT.getProducts}${vendorId}`).then(res => {
                console.log(res)
                if (res.status === 200 && res.data && res.data.data) {
                    const data = res.data.data;
                    setProducts(data)
                    setFiltered(data)
                }

            })

    }
    const handleQPay = (product) => {
        setLoadingMessage('Processing with QPay');
        setLoading(true);
      
        SEND_POST_REQUEST(API_CLIENT.buyProduct,
            {
                title:product.title,
                cost:product.price,
                vendorId:product.vendorId,
                index:product.index,
                productId:product._id,
            }
        ).then(res=>{
            setLoading(false);
            if(res.status === 200){
                setBankList(res.data.bankList.urls)
                setInvoice(res.data.bankList.invoice_id)
                setPayModal(true);
                
            }
            else{
                toast.error(res?.message||"Error while creating invoice")
            } 
        }).catch(err=>{
            setLoading(false);
            console.log(err)
        })

    }
    useEffect(() => {
        loadList();
    }, [])
    return (
        <Page title='Machine Management'>
            <div className="flex w-full gap-2 flex-col">
                <div className="flex w-full justify-center items-center">
                    <SearchInput handleChangeSearch={handleChangeSearch} />

                </div>
                <div className='grid grid-cols-2 gap-2 px-4 sm:grid-cols-4 md:grid-cols-6'>
                    {
                        filtered.map((product, index) => {
                            return (

                                <div className="card w-full bg-base-100 shadow-xl" key={index}>
                                    <figure>
                                        {product.status === 0 &&
                                            <Image alt={`product-${index}`} className="max-h-[130px]" src={`${ASSETS_URL.image}empty.jpg`} />
                                        }
                                        {product.status === 1 &&
                                            <Image alt={`product-${index}`} className="max-h-[130px]" src={`${ASSETS_URL.root}${product.img}`} />
                                        }

                                        <label className="badge badge-error badge-outline absolute right-1 top-1">Slot Index:{product.index}</label>

                                    </figure>
                                    <div className={`card-body p-1 text-center ${product.status === 0 ? 'text-stone-400' : 'text-black'}`}>
                                        <TextMaxLine maxLine={1}>
                                            {product.title}
                                        </TextMaxLine>
                                        <p>₮{product.price}</p>

                                        <div className='w-full'>
                                            <button className='btn btn-info btn-xs h-5 rounded-md btn-outline' disabled={(product.status === 0)} onClick={() => handleQPay(product)}>{t('words.take')}</button>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <Drawer
                    onClose={() => {

                        if (invoice !== "") {
                            setPayModal(false);
                            navigate(`/take-product/${invoice}`);
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
                {/* <Pagination totalCount={1} handleChangePage={handleChangePage} perPageCount={10} /> */}
            </div>
            {loading &&
                <LoadingScreen message={loadingMessage} />
            }
        </Page>
    )
}