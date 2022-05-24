import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Page from "../../component/Page";
import { HomeHero, HomeReview, HomeTopCategory,HomeStart } from '../../sections/home';
import { API_CLIENT, SEND_GET_REQUEST } from "../../utils/API";
export default function ClientHome() {
    const [barcode, setBarcode] = useState('');
    const [checked, setChecked] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [latestReviews,setLatestReviews] = useState([]);
    const [topRated,setTopRated] = useState([]);
    const handleResult = (result, err) => {
        if (!!result) {
            setBarcode(result?.text);
        }
        console.log(result, err)
    }
    const handleClick = () => {
        navigate(`/get-products/${barcode}`, { replace: true })
    }
    useEffect(()=>{
        SEND_GET_REQUEST(API_CLIENT.getLatestReviews).then(res=>{
            if(res.status === 200){
                setLatestReviews(res.data.reviews);
             
            }
        }).catch(err=>{
            console.log(err)
        })
        SEND_GET_REQUEST(API_CLIENT.getTopWarehouse).then(res=>{
            if(res.status === 200){
                setTopRated(res.data.warehouses);
            }
        }).catch(err=>{
            console.log(err)
        })
    },[])
    return (
        <Page title='Client Home'>
            <HomeHero />
            <HomeReview reviews={latestReviews} />
            <HomeTopCategory warehouses = {topRated} />
            <HomeStart />
        </Page>
    );
}