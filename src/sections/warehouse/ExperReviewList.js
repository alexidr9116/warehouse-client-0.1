import { Icon } from "@iconify/react";
import { useState } from "react";
import Pagination from "../../component/core/Pagination";
import AwesomeCard from "../commons/AwesomeCard";
import FilterModal from "../commons/FilterModal";



export default function ExperReviewDetail({ data }) {
 
  return (
    <>
      <div className="flex flex-col gap-5 px-5 mb-20">
        {data.map((item, index) =>
          <AwesomeCard key={index} data={item} />
        )}
      </div>

      {/* pagination section */}

      <div className="mb-20">
        {/* <Pagination
          value={page}
          onChange={(pageNo) => setPage(pageNo)}
          totalNum={awesome.length}
        /> */}
      </div>

        {/* <FilterModal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          onRatingChange={(e) => { }}
          onCategoryChange={(e) => { }}
          onDistanceChange={(e) => { }}
        /> */}
    </>
  )
}