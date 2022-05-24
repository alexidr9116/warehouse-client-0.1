import PropTypes from 'prop-types';

PricingCard.propTypes = {
  data: PropTypes.object,
  active: PropTypes.bool,

}

export default function PricingCard({ data, active, ...other }) {
  const { id, topic, price, description } = data;
  console.log(id);
  return (
    <div className={`
      flex flex-col gap-8 items-center  bg-neutral bg-opacity-10 rounded-2xl px-8 py-12 transition-all hover:cursor-pointer
      ${active && 'text-white bg-opacity-100 shadow-2xl shadow-neutral '}
      `}
      style={{ transform: active && 'perspective(1000px) translateZ(100px)' }}
      {...other}
    >
      <p className='text-xl font-bold'>
        {topic}
      </p>
      <p className='text-4xl font-bold'>
        {price}
      </p>
      <button className={`btn btn-wide btn-lg  ${active ? 'border-white text-white' : 'bg-white border-black'}  `}>
        start for free
      </button>
      <p className='text-center leading-10'>
        {description}
      </p>
      <button className={`btn  btn-wide btn-lg ${active ? 'bg-white text-neutral hover:text-white ' : 'text-white'}`}>buy now</button>
    </div >
  )
}