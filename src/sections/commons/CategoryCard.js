import { Icon } from '@iconify/react';
import { Rating } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../../component/Image';
import { ASSETS_URL } from '../../utils/API';
import { fNumber } from '../../utils/uFormatter';

CategoryCard.propTypes = {
  data: PropTypes.object,
  className:PropTypes.string,
}
export default function CategoryCard({ data,className }) {
  const { avg, warehouse, sum } = data;

  return (
    <div className={`p-2 bg-white rounded-xl ${className}`}>
      <div className='mb-5 relative'>
        <Image src={`${ASSETS_URL.root}${warehouse.img}`} ratio={2 / 3} className="rounded-xl" />
      </div>
      <div className='p-3'>
        <p className='text-2xl font-bold mb-2'>
          {warehouse.name}
        </p>
        <div className='flex items-center mb-2'>
          <Rating value = {avg} precision={0.5} readOnly /> ({fNumber(avg)} star{avg>1?'s':''})
        </div>
        <p>
          24H services:{warehouse.openAlways?"Yes":"No"}
        </p>
        <p>
          Period of from Ch to Ub:{warehouse.period}
        </p>
        <p>
          Price/Kg:{warehouse.price}/Kg
        </p>
        <p className='mb-2'>
          Certification:{warehouse.haveBusiness?"Yes":"No"}
        </p>
        <Link to={`/warehouse-review/${warehouse._id}`} className='flex gap-2 text-xl text-accent items-center'>
          <Icon icon={'mdi:chat'} />
          <p>{sum}</p> Reviews
          <Icon icon={'fa6-solid:arrow-right-long'} className="pt-1" />
        </Link>
      </div>
    </div>
  )
}