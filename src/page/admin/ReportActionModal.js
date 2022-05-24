
import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import Rating from '@mui/material/Rating';

import { API_ADMIN, API_CLIENT, ASSETS_URL, SEND_DELETE_REQUEST, SEND_GET_REQUEST, SEND_POST_REQUEST, SEND_PUT_REQUEST } from "../../utils/API";
import { fPrice, fShortDate } from "../../utils/uFormatter";

export default function ReportActionModal({ onClose, id, onUpdateReview, review }) {

    const [loading, setLoading] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const handleDelete = ()=>{
        setLoading(true);
       
        SEND_POST_REQUEST(`${API_ADMIN.deleteReview}`, { id }).then(res => {

            setLoading(false);
            if (res.status === 200) {
                onUpdateReview(id);
            }
            else {
                toast.error(res?.message || "Internal Server Error");
            }
        }).catch(err => {

            setLoading(false);
            toast.error("Internal Server Error");
        })

    }
    const handleDeleteAndBlock = ()=>{
        setLoading(true);
        SEND_POST_REQUEST(`${API_ADMIN.deleteReviewAndBlock}`, { id,  writer:review?.publisher?._id }).then(res => {

            setLoading(false);
            if (res.status === 200) {
                onUpdateReview(id);
            }
            else {
                toast.error(res?.message || "Internal Server Error");
            }
        }).catch(err => {

            setLoading(false);
            toast.error("Internal Server Error");
        })
    }
    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    const getLabelText = (value) => {
        return `${labels[value]}`;
    }

    useEffect(() => {

    }, [])

    return (
        <div className={`modal modal-open bg-black/0 `}>
            <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
            <div className='z-50 bg-white rounded-xl p-5 px-3 h-full overflow-y-auto'>
                <p className="text-center font-bold text-xl mb-3"> Reported Review  </p>
                <div className='grid  w-full p-5'>
                    <div>
                        <div className="w-full ">
                            <p className="">Publisher</p>
                            <div className='flex items-center mb-2'>
                                {review?.publisher?.firstName} {review?.publisher?.lastName} - {review?.publisher?.mobile}
                            </div>
                            
                        </div>
                        <div className="w-full m-2">
                            <p className="">Product # {review?.product?.barcode},{review?.product?.title} </p>
                            <p className="">Price {fPrice(review?.product?.price,"₮")} </p>
                            <p className="">RegTime {fShortDate(review?.product?.registeredAt)} </p>
                            <p className="">UBTime {fShortDate(review?.product?.arrivedUbAt)} </p>
                            <p className="">Paid? {review?.product?.payStatus === "paid" ? "Yes":"No"} </p>
                        </div>
                        <div className="w-full ">
                            <p className="">Was it delivered on time?</p>
                            <div className='flex items-center mb-2'><Rating value={review?.timeRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.timeRate > 0 ? getLabelText(review?.timeRate) : ''}</div>
                        </div>

                        <div className="w-full ">
                            <p className="">Has the safety been delivered?</p>
                            <div className='flex items-center mb-2'><Rating value={review?.brokenRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.brokenRate > 0 ? getLabelText(review?.brokenRate) : ''}</div>

                        </div>
                        <div className="w-full ">
                            <p className="">Is the price right for you?</p>
                            <div className='flex items-center mb-2'><Rating value={review?.priceRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.priceRate > 0 ? getLabelText(review?.priceRate) : ''}</div>
                        </div>
                        <div className="w-full">
                            <p className="">Do you recommend this warehouse?</p>
                            <div className='flex items-center mb-2'><Rating value={review?.recommendRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.recommendRate > 0 ? getLabelText(review?.recommendRate) : ''}</div>
                        </div>
                        <div className="w-full  items-center">
                            <p className="">Publisher Comment</p>
                            <textarea defaultValue={review?.comment} className="min-w-[300px] textarea textarea-bordered w-full" rows={4} readOnly/>
                        </div>
                        <div className="w-full  items-center">
                            <p className="">Reported Content</p>
                            <textarea defaultValue={review?.reportContent} className="min-w-[300px] textarea textarea-bordered w-full" rows={4} readOnly />
                        </div>

                        <div className="w-full grid grid-cols-3 gap-2 mt-4">
                            <button className={`btn btn-sm btn-info ${loading && 'loading'}`} onClick={handleDelete}>
                                Delete
                            </button>
                            <button className={`btn btn-sm btn-info ${loading && 'loading'}`} onClick={handleDeleteAndBlock}>
                                Delete & Block
                            </button>
                            <button className={`btn  btn-sm btn-info  `} onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}