import { Icon } from '@iconify/react';
import { ArrowBack } from '@mui/icons-material';
import { IconButton, Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Barcode from 'react-barcode';
import { useParams, Link } from 'react-router-dom';
import TextMaxLine from '../../component/core/TextMaxLine';

import Page from "../../component/Page";
import { API_CLIENT, ASSETS_URL, SEND_GET_REQUEST } from '../../utils/API';
import { fNumber, fShortDate } from '../../utils/uFormatter';

export default function ProductReviews() {
    const { reviewId } = useParams();
    const [review, setReview] = useState({});
    useEffect(() => {
        SEND_GET_REQUEST(`${API_CLIENT.getProductReview}${reviewId}`).then(res => {
            
            if (res.status === 200) {
                setReview(res.data.review);
            }
            else{
                toast.error(res?.message || "Internal server error");
            }
        }).catch(err => {
            console.log(err);
        })

    }, [reviewId]);
    return (
        <Page title="Product Review Detail" className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
            <div className="flex justify-center p-6 flex-col items-start" >
                <Link to = "/" className='mb-5 flex items-center'><IconButton><ArrowBack></ArrowBack></IconButton> Back to Home</Link>

                <div>
                    <Barcode value={`${review?.product?.barcode}`} height={150} />
                    
                </div>
                <label className='mt-10 text-lg '>Barcode#{`${review?.product?.barcode}`}</label>
            </div>
            <div className=" flex flex-col sm:flex-row gap-2 p-4 max-w-md">

                <div className="flex flex-col">
                    <p className="text-xl font-bold mb-2">
                        {review?.product?._id}#
                    </p>
                    Comment:
                    <TextMaxLine maxLine={5} children={review?.comment} className='mb-5 text-gray-500' />
                    <label>Was it delivered on time?</label>
                    <div className='flex items-center mb-2'>
                        <Rating readOnly value={review?.timeRate || 0} />
                        <label >({fNumber(review?.timeRate)})</label>
                    </div>
                    <label>Has the safety been delivered?</label>
                    <div className='flex items-center  mb-2'>
                        <Rating readOnly value={review?.brokenRate || 0} />
                        <label >({fNumber(review?.brokenRate)})</label>
                    </div>
                    <label>Is the price right for you?</label>
                    <div className='flex items-center  mb-2'>
                        <Rating readOnly value={review?.priceRate || 0} />
                        <label >({fNumber(review?.priceRate)})</label>
                    </div>
                    <label>Do you recommend this warehouse?</label>
                    <div className='flex items-center  mb-2'>
                        <Rating readOnly value={review?.recommendRate || 0} />
                        <label >({fNumber(review?.recommendRate)})</label>
                    </div>
                    <div className='divider' />
                    <div className='flex items-center'>
                        <Rating readOnly value={review?.rate || 0} />
                        <label >({fNumber(review?.rate)})</label>
                    </div>
                    <div className='divider' />
                    <p className='mb-2'>Publisher:{(review?.writer?.firstName === "")?`Mobile Number-${review?.writer?.mobile}`:`${review?.writer?.firstName} ${review?.writer?.lastName}`}</p>
                    <p className=''>Publish:{fShortDate(review?.createdAt)}</p>
                </div>
            </div>

        </Page>
    )
}