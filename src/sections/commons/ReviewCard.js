import { Icon } from '@iconify/react';
import { Rating } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TextMaxLine from '../../component/core/TextMaxLine';
import Image from '../../component/Image';
import { ASSETS_URL } from '../../utils/API';
import { fNumber, fShortDate } from '../../utils/uFormatter';

ReviewCard.propTypes = {
  review: PropTypes.object,
  className: PropTypes.string,
}
export default function ReviewCard({ review, className }) {
  const { warehouse, comment, writer, rate, createdAt,_id } = review;
  
  return (
    <div className={`p-8 border flex flex-col gap-3 border-neutral rounded-xl bg-white ${className}`}>
      <div className='flex items-center gap-4'>
        <Image src={`${ASSETS_URL.root}${writer.avatar}`} className="w-16 h-16 rounded-sm" />
        <div className=''>
          <TextMaxLine maxLine={1} children={<label className='text-lg font-bold'>
            {writer.firstName === "" ? writer.mobile:`${writer.firstName} ${writer.lastName}`}
          </label>} />
          <div className='flex gap-2 items-center'>
            <div className="rating gap-1 rating-sm">
              <Rating value={(rate)} readOnly precision={0.5} />
            </div>
            {`(${fNumber(rate)})`}
          </div>
        </div>
      </div>
      
      <div className='flex gap-3'>
        <img src="/images/home/quote.svg" alt="" />
        <TextMaxLine maxLine={3} children={comment} />

      </div>
      <div className='flex gap-3  flex-col'>
        <p className=' font-bold '>
          Warehouse: {warehouse.name}
        </p>
        <p className='text-sm'>
          Published: {fShortDate(createdAt)}
        </p>
        <p className='text-sm'>
          <Link to={`/product-review/${_id}`} className='flex items-center text-cyan-500'>Read Detail&nbsp;<Icon icon = 'fa6-solid:arrow-right-long'></Icon></Link>
        </p>
      </div>
    </div>
  )
}