import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";
import Rating from "@mui/material/Rating";
import Image from "../../component/Image";
import { ASSETS_URL } from '../../utils/API';
import { fNumber, fShortDate } from '../../utils/uFormatter';
import TextMaxLine from '../../component/core/TextMaxLine';



AwesomeCard.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
}

export default function AwesomeCard({ data, className }) {
  const { writer, comment,rate,createdAt } = data;
  const { avatar, mobile, firstName, lastName } = writer;
  return (
    <div className={`border border-neutral rounded-box p-5 flex flex-col md:flex-row ${className}`}>
      <div className="p-5">
        <Image src={`${ASSETS_URL.root}${avatar}`} className="w-20 h-20 rounded-full" />
      </div>
      <div className='w-full'>
        <div className="mb-2">
          <p className="text-2xl font-bold mb-1">
            {(firstName === "") ? `${mobile}` : `${firstName} ${lastName}`}
          </p>
          <div className='flex items-center gap-2 mb-3'>
            <Rating value={rate} readOnly /><label>({fNumber(rate)})</label>
          </div>
          
          <div className='flex gap-3 mb-4'>
            <img src="/images/home/quote.svg" alt="" />
            <TextMaxLine maxLine={5} children={comment} />
            
          </div>
          <p className='text-sm text-info'>
          Published: {fShortDate(createdAt)}
        </p>
        </div>
      </div>
    </div>
    
  )
}