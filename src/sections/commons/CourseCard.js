import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../../component/Image';

CourseCard.propTypes = {
  data: PropTypes.object,
  className:PropTypes.string,
}
export default function CourseCard({ data,className }) {
  const { id, title, cover, comment, reviews, result } = data;

  return (
    <div className={`p-2 mb-10 bg-gray-50 rounded-xl  ${className}`}>
      <div className='mb-5 relative'>
        <Image src={cover} ratio={2 / 3} className="rounded-xl" />
        <span className='btn text-white absolute btn-sm bottom-3 left-5'>{result}{' Results'}</span>
      </div>
      <div className='p-3'>
        <p className='text-3xl font-bold mb-5'>
          {title}
        </p>
        <p className='text-lg mb-5'>
          {comment}
        </p>
        <Link to={`/reviews/${id}`} className='flex gap-2 text-xl text-neutral items-center'>
          <Icon icon={'mdi:chat'} />
          <p>{reviews}</p> Reviews
          <Icon icon={'fa6-solid:arrow-right-long'} className="pt-1" />
        </Link>
      </div>
    </div>
  )
}