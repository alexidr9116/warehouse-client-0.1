import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import LoadingScreen from "../../component/custom/LoadingScreen";
import Image from "../../component/Image";
import AlertModal from '../../component/core/AlertModal';
import { API_ADMIN, API_CLIENT, ASSETS_URL, SEND_DELETE_REQUEST, SEND_GET_REQUEST, SEND_POST_REQUEST, SEND_PUT_REQUEST } from "../../utils/API";

export default function ReviewWriteModal({ onClose, id, onUpdateReview }) {

    const [loading, setLoading] = useState(false);
    const [timeRate, setTimeRate] = useState(4);
    const [brokenRate, setBrokenRate] = useState(4);
    const [priceRate, setPriceRate] = useState(4);
    const [comment, setComment] = useState('');
    const [recommendRate, setRecommendRate] = useState(4);
    const [hoverTimeRate, setHoverTimeRate] = useState(-1);
    const [hoverBrokenRate, setHoverBrokenRate] = useState(-1);
    const [hoverPriceRate, setHoverPriceRate] = useState(-1);

    const [hoverRecommendRate, setHoverRecommendRate] = useState(-1);


    const onSubmit = () => {
        const data = { timeRate, brokenRate, priceRate, comment, recommendRate, productId: id };

        setLoading(true);

        SEND_PUT_REQUEST(`${API_CLIENT.writeReview}`, data).then(res => {

            setLoading(false);

            if (res.status === 200) {
                onUpdateReview(res.data.review);
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
        0:'',
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

    const getLabelText = (value, hover) => {
        if(value === null)
            return "";
        return `${labels[hover !== -1 ? hover : (value > 0 ? value : 0)]}`;
    }

    useEffect(() => {

    }, [])

    return (
        <div className={`modal modal-open bg-black/0 `}>
            <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
            <div className='z-50 bg-white rounded-xl p-5 px-3'>
                <p className="text-center font-bold text-xl mb-3">Write Review </p>
                <div className='grid  w-full p-5'>
                    <div>
                        <div className="w-full ">
                            <p className="">Was it delivered on time?</p>
                            <div className='flex items-center mb-2'><Rating value={timeRate} onChange={(e, n) => setTimeRate(n)} onChangeActive={(e, n) => { setHoverTimeRate(n) }} emptyIcon={<StarIcon style={{ opacity: 0.55 }}
                            />} precision={0.5} />&nbsp;&nbsp;{getLabelText(timeRate, hoverTimeRate)}</div>
                        </div>

                        <div className="w-full ">
                            <p className="">Has the safety been delivered?</p>
                            <div className='flex items-center mb-2'><Rating value={brokenRate} onChange={(e, n) => setBrokenRate(n)} onChangeActive={(e, n) => { setHoverBrokenRate(n) }} emptyIcon={<StarIcon style={{ opacity: 0.55 }}
                            />} precision={0.5} />&nbsp;&nbsp;{getLabelText(brokenRate, hoverBrokenRate)}</div>

                        </div>
                        <div className="w-full ">
                            <p className="">Is the price right for you?</p>
                            <div className='flex items-center mb-2'><Rating value={priceRate} onChange={(e, n) => setPriceRate(n)} onChangeActive={(e, n) => { setHoverPriceRate(n) }} emptyIcon={<StarIcon style={{ opacity: 0.55 }}
                            />} precision={0.5} />&nbsp;&nbsp;{ getLabelText(priceRate,hoverPriceRate)}</div>
                        </div>
                        <div className="w-full">
                            <p className="">Do you recommend this warehouse?</p>
                            <div className='flex items-center mb-2'><Rating value={recommendRate} onChange={(e, n) => setRecommendRate(n)} onChangeActive={(e, n) => { setHoverRecommendRate(n) }} emptyIcon={<StarIcon style={{ opacity: 0.55 }}
                            />} precision={0.5} />&nbsp;&nbsp;{getLabelText(recommendRate,hoverRecommendRate)}</div>
                        </div>

                        <div className="w-full  items-center">
                            <p className="">Your Comment</p>
                            <textarea required minLength={30} onChange={(e) => setComment(e.target.value)} value={comment} className="min-w-[300px] textarea textarea-bordered w-full" rows={4} />
                        </div>


                        <div className="w-full grid grid-cols-2 gap-2 mt-4">
                            <button className={`btn btn-sm btn-info ${loading && 'loading'}`} onClick={onSubmit}>
                                Save
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