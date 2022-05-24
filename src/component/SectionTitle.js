import PropTypes from 'prop-types';
import StarIcon from '@mui/icons-material/Star';

SectionTitle.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

export default function SectionTitle({ title, description }) {
  return (
    <div className='flex flex-col gap-5  mb-10 justify-center items-center'>
      <p className='text-center font-bold text-4xl'>
        {title}
      </p>
      <div className='w-72'>
        <div className='divider text-center before:bg-neutral after:bg-neutral '>
          <StarIcon style = {{color:'#3ABFF8'}}></StarIcon>
          <StarIcon style = {{color:'#3ABFF8'}}></StarIcon>
          <StarIcon style = {{color:'#3ABFF8'}}></StarIcon>
        </div>
      </div>
      <p className='text-center text-xl text-gray-500'>
        {description}
      </p>
    </div>
  )
}