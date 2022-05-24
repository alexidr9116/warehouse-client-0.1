import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import TextMaxLine from '../../component/core/TextMaxLine';
import Image from '../../component/Image';
import Page from '../../component/Page'
import { API_CLIENT, ASSETS_URL, SEND_GET_REQUEST, SEND_POST_REQUEST } from '../../utils/API';
import { Icon } from '@iconify/react';
import BLE from '../../utils/BLE';
import LoadingScreen from '../../component/custom/LoadingScreen';

export default function TakeProduct() {
    const { invoice } = useParams();
    const {t} = useTranslation();
    const [history, setHistory] = useState({});
    const [vendor, setVendor] = useState({});
    const [loading,setLoading] = useState(false);
    const [bleConnect,setBleConnect]  = useState(false);
    
    const handleBleSuccess = ()=>{
        setBleConnect(false);
        
        const params = {
            type: vendor.type,
            deviceNumber:vendor.deviceNumber,
            productId:history.productId,
            vendorId:vendor.vendorId,
            slotId:history.product.index,
            realInvoice:invoice,
        }
        SEND_POST_REQUEST(`${API_CLIENT.takeProduct}`,params).then(res=>{
            setLoading(false);
            if(res.status === 200){
                toast.success(res.message);
            }
            else{
                toast.error(res?.message||"Server Error ");
            }
        }).catch(err=>{
            console.log(err);
            setLoading(false);
            toast.error("Internal Server Error ");
        })
    }
    // take product button action
    const handleTakeProduct = ()=>{
        const params = {
            type: vendor.type,
            deviceNumber:vendor.deviceNumber,
            productId:history.productId,
            vendorId:vendor.vendorId,
            slotId:history.product.index,
            realInvoice:invoice,
        }
       
        if(params.type === 'ble'){
            setBleConnect(true);
        } 
        else{
            setLoading(true);
            SEND_POST_REQUEST(`${API_CLIENT.takeProduct}`,params).then(res=>{
                setLoading(false);
                if(res.status === 200){
                    toast.success(res.message);
                }
                else{
                    toast.error(res?.message||"Server Error ");
                }
            }).catch(err=>{
                console.log(err);
                setLoading(false);
                toast.error("Internal Server Error ");
            })
        }

    }

    const reload = ()=>{
        SEND_GET_REQUEST(`${API_CLIENT.getPayHistory}${invoice}`).then(res => {
            if (res.status === 200) {
                console.log(res.data);
                setVendor(res.data.vendor);
                setHistory(res.data.history);
            }
            else {
                toast.error(res?.message || "Received error from system");
            }
        })
    }
    useEffect(() => {
        reload();
    }, [])

    return (
        <Page title="Take Product">
            <div className="flex flex-col gap-2 w-full text-center p-4 items-center">

                <div className="card w-full bg-base-100 shadow-xl sm:w-[400px] mb-2" >
                    <button className='btn-circle btn-sm btn btn-info  absolute right-2 top-2' onClick={()=>reload()}><Icon icon={'fa:refresh'} /> </button>

                    <label className='text-lg mt-4'>{t('take_product.vendor_id')}: {vendor?.vendorId}</label>
                    <label className='text-sm text-stone-500'>{t('take_product.vendor_type')}: {vendor?.type}</label>
                    <figure>
                        {history?.product?.status === 0 &&
                            <Image alt={`product`} className="h-[130px] max-w-[350px]" src={`${ASSETS_URL.image}empty.jpg`} />
                        }
                        {history?.product?.status === 1 &&
                            <Image alt={`product`} className="h-[130px] max-w-[350px]" src={`${ASSETS_URL.root}${history?.product?.img}`} />
                        }


                    </figure>

                    <div className={`card-body p-1 text-center ${history?.product?.status === 0 ?
                        'text-stone-400' : 'text-black'}`}>
                        <div className='w-full'>
                            <label className="badge badge-error badge-outline ">{t('take_product.slot_index')}:{history?.product?.index}</label>
                        </div>
                        <TextMaxLine maxLine={1}>
                            {history?.productName}
                        </TextMaxLine>
                        <p className='text-stone-500'>₮{history?.cost}</p>

                        <div className='w-full mb-2'>
                            <button className='btn btn-info btn-sm rounded-md btn-outline' disabled={((history?.status !== "paid") || (history?.taken === 1))} onClick = {handleTakeProduct}>{t('take_product.get_product')}</button>
                        </div>

                    </div>
                </div>
                
                {vendor?.type === 'ble' && 
                <div className="card w-full bg-base-100 shadow-xl sm:w-[400px] p-3" >
                    <BLE 
                        vendorId={vendor.vendorId} 
                        connect={bleConnect} 
                        disconnect = {!bleConnect}
                        onSuccessReceived ={handleBleSuccess} 
                        command = {history.product.index} 
                    />
                </div>
                }
            </div>
            {loading && <LoadingScreen message='Taking your product' />}
        </Page>
    )
}