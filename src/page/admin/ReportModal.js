import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import Rating from '@mui/material/Rating';
import { useTranslation } from "react-i18next";

import { API_ADMIN, API_CLIENT, ASSETS_URL, SEND_DELETE_REQUEST, SEND_GET_REQUEST, SEND_POST_REQUEST, SEND_PUT_REQUEST } from "../../utils/API";


export default function ReportReviewModal({ onClose, id, onUpdateReview, review }) {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [ reportContent,setReportContent] = useState('');

    const onSubmit = () => {

        setLoading(true);

        SEND_POST_REQUEST(`${API_ADMIN.reportReview}`, {id, reportContent}).then(res => {

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
            <div className='z-50 bg-white rounded-xl p-5 px-3 overflow-y-auto h-full'>
                <p className="text-center font-bold text-xl mb-3">{t('reviews.reportTitle')}</p>
                <div className='grid  w-full p-5'>
                    <div>
                        <div className="w-full ">
                            <p className="">{t('reviews.question1')}</p>
                            <div className='flex items-center mb-2'><Rating value={review?.timeRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.timeRate > 0 ? getLabelText(review?.timeRate) : ''}</div>
                        </div>

                        <div className="w-full ">
                            <p className="">{t('reviews.question2')}</p>
                            <div className='flex items-center mb-2'><Rating value={review?.brokenRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.brokenRate > 0 ? getLabelText(review?.brokenRate) : ''}</div>

                        </div>
                        <div className="w-full ">
                            <p className="">{t('reviews.question3')}</p>
                            <div className='flex items-center mb-2'><Rating value={review?.priceRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.priceRate > 0 ? getLabelText(review?.priceRate) : ''}</div>
                        </div>
                        <div className="w-full">
                            <p className="">{t('reviews.question4')}</p>
                            <div className='flex items-center mb-2'><Rating value={review?.recommendRate} readOnly precision={0.5} />&nbsp;&nbsp;{review?.recommendRate > 0 ? getLabelText(review?.recommendRate) : ''}</div>
                        </div>

                        <div className="w-full  items-center">
                            <p className="">{t('reviews.publisherComment')}</p>
                            <textarea defaultValue = {review?.comment} className="min-w-[300px] textarea textarea-bordered w-full" rows={4} readOnly />
                        </div>
                        <div className="w-full  items-center">
                            <p className="">{t('reviews.reportContent')}</p>
                            <textarea value = {reportContent} onChange={(e)=>setReportContent(e.target.value)} className="min-w-[300px] textarea textarea-bordered w-full" rows={4} />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-2 mt-4">
                            <button className={`btn btn-sm btn-info ${loading && 'loading'}`} onClick = {onSubmit}>
                                {t('words.save')}
                            </button>
                            <button className={`btn  btn-sm btn-info  `} onClick={onClose}>
                            {t('words.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}