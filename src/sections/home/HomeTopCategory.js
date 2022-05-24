import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import SectionTitle from "../../component/SectionTitle";
import CategoryCard from "../commons/CategoryCard";
 
export default function HomeTopCategory({warehouses}) {
  return (
    <div className='container max-w-6xl px-5 mb-20'>
      <SectionTitle title="Top Rated Warehouses" description="Here are the Top Rated Warehouses List" />
      <p className="text-right -mt-10 mb-5">
        <Link to="/warehouse-rank" className="btn btn-link text-accent gap-2">
          View All
          <Icon icon={'fa6-solid:arrow-right-long'} />
        </Link>
      </p>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8'>
        {warehouses.map((item, index) =>
          <CategoryCard data={item} key={index} />)}
      </div>
    </div>
  )
}