import { useState } from "react";
import SectionTitle from "../../component/SectionTitle";
import { fNumber } from "../../utils/uFormatter";
import ExperReviewList from "./ExperReviewList";
import ExperReviewSummary from "./ExperReviewSummary";
import ExperReviewWrite from "./ExperReviewWrite";



export default function ExperReviews({ data, reviews }) {

  const [writeReview, setWriteReview] = useState();
  return (
    <div className='container max-w-6xl px-5 mb-20'>
      <SectionTitle title={`Reviews (${fNumber(reviews)})`} description="Read reviews detailed experiences from people like you" />
  
      {/* <ExperReviewSummary data={data} /> */}

      <ExperReviewList data={data} />
 
    </div>
  )
}