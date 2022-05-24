import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper';
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Image from "../../component/Image";
import SectionTitle from '../../component/SectionTitle';
import ReviewCard from "../commons/ReviewCard";
 

const settingSwiper = {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    clickable: true,
  },
  modules: [Autoplay, Pagination, Navigation],

  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
  }
}

export default function HomeReview({reviews}) {
  return (
    <div className='container max-w-6xl py-10 px-5 mb-20'>

      <SectionTitle
        title="Latest Reviews"
        description="Read reviews detailed experiences from people like you"
      />
     
      <div className='relative'>
        <Swiper  {...settingSwiper} className="testimonial flex flex-col-reverse gap-8">
          {reviews.map((item, index) => (
            <SwiperSlide key={index}>
              <ReviewCard review={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Image src="/images/home/airplaneout.svg" className="w-48 absolute -z-[1] -right-5 top-[95%] hidden md:block" />
      </div>
    </div>
  )
}