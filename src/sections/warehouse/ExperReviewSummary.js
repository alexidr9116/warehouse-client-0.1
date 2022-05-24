import PropTypes from 'prop-types';
// import Rating from "../component/components/Rating"

ExperReviewSummary.propTypes = {
  data: PropTypes.object,
  onWriteReview: PropTypes.func,
}

export default function ExperReviewSummary({ data, onWriteReview }) {
  const { ratings, } = data;

  return (
    <div className='grid md:grid-cols-3 mb-20'>

      <div className="flex items-center p-5 justify-center border-b-2 md:border-r-2 md:border-b-0">
        {/* <Rating value={getRatingInfo(ratings).avgRatio} readOnly className="rating-lg" /> */}
      </div>


      <div className="flex items-center flex-col-reverse p-5 gap-y-5">
        {[...Array(5)].map((_, index) => {
          let review = ratings.find(_item => _item.star === (index + 1)).review
          return (
            <div className="flex items-center gap-3" key={index}>
              {/* <Rating value={index + 1} readOnly noValue className="gap-2 rating-md" /> */}
              <input type='range' className="range range-xs range-accent" value={review} min={0} max={getRatingInfo(ratings).totalReview} readOnly />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const getRatingInfo = (ratingArr) => {
  let totalReview = 0;
  let totalRating = 0;
  ratingArr.forEach(item => {
    totalReview += item.review;
    totalRating += item.review * item.star;
  });
  const avgRatio = Math.floor(totalRating / totalReview * 10) / 10;
  return ({ totalReview, avgRatio })
}