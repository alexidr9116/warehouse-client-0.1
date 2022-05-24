import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../../component/Image';
import Rating from '../../component/Rating';

CompanyCard.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
}
export default function CompanyCard({ data, className }) {
  const { id, name, brand, rating, description } = data;
  console.log(id,rating);
  return (
    <div className={`p-8 border flex flex-col justify-between items-center md:flex-row gap-3 border-neutral rounded-2xl bg-white ${className}`}>
      <div className='min-w-[10rem] min-h-[10rem] w-40 h-40 rounded-lg bg-neutral/10 flex items-center justify-center'>
        <Image src={brand} className="p-3" />
      </div>
      <div className=''>
        <p className='text-2xl font-bold'>
          {name}
        </p>
        <p className=''>
          {description}
        </p>
      </div>
      <div className='flex flex-col items-center gap-5'>
        <p>Based on 265 reviews</p>
        <Rating value={5} readOnly className='rating-md' />
        <Link to={`/experience`} className='btn btn-wide text-white' style={{ borderRadius: 8 }}>Read more</Link>
      </div>

    </div>
  )
}