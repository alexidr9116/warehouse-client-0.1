import PropTypes from 'prop-types';
import Dialog from "../../component/Dialog";

const MOCK_FILTER = {
  rating: [
    {
      tag: 'Superb 9+',
      value: 67
    },
    {
      tag: 'Very Good 8+',
      value: 89
    },
    {
      tag: 'Good 7+',
      value: 45
    },
    {
      tag: 'Pleasant 6+',
      value: 78
    }
  ],
  categories: [
    {
      tag: 'Restaurants',
      value: 12,
    },
    {
      tag: 'Clotges',
      value: 11,
    },
    {
      tag: 'Bars',
      value: 23,
    },
    {
      tag: 'Events',
      value: 56,
    },
  ],
}

FilterModal.propTypes = {
  onRatingChange: PropTypes.func,
  onCategoryChange: PropTypes.func,
  onDistanceChange: PropTypes.func,
}
export default function FilterModal({ onRatingChange, onCategoryChange, onDistanceChange, ...other }) {
  
  return (
    <Dialog className="rounded-2xl bg-white p-5 md:p-10 max-w-6xl w-full"
      {...other}
    >
      <div className="grid grid-cols-4 gap-5 ">
        <div className="">
          <p className="font-bold text-lg mb-5">Rating</p>
          {
            MOCK_FILTER.rating.map((item, index) =>
              <div className="flex justify-between gap-2 items-center mb-5" key={index}>
                <input className="checkbox border checkbox-accent " type="checkbox" onChange={onRatingChange} />
                <p className="">{item.tag}</p>
                <p className="ml-auto">{item.value}</p>
              </div>
            )
          }
        </div>

        <div className="">
          <p className="font-bold text-lg mb-5">Categories</p>
          {
            MOCK_FILTER.categories.map((item, index) =>
              <div className="flex justify-between gap-2 items-center mb-5" key={index}>
                <input className="checkbox border checkbox-accent" type="checkbox" onChange={onCategoryChange} />
                <p className="">{item.tag}</p>
                <p className="ml-auto">{item.value}</p>
              </div>
            )
          }
        </div>
        <div className="col-span-2 ">
          <p className="font-bold text-lg mb-5">Categories</p>
          <p className="mb-5">Radius around selected destination 30 km</p>
          <input className="range range-sm range-accent" type="range" onChange={onDistanceChange} />
        </div>
      </div>
    </Dialog>
  )
}