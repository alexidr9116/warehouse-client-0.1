import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Image from "../../component/Image";

export default function HomeStart() {
  const {t} = useTranslation();
  return (
    <div className='container max-w-6xl  px-5 mb-20'>
      <div className='grid md:grid-cols-2 gap-x-8 gap-y-12 justify-center'>
        <div className='relative  px-8'>
          <Image src="/images/home/education.png" className="rounded-full " />
          <div className='absolute rounded-full flex px-3 py-1 items-center top-1/3 left-0 bg-white gap-2 border-0'>
            <div className='flex bg-accent rounded-full text-white p-2'>
              <Icon icon={'carbon:security'} width={24} className="m-auto" />
            </div>
            Easy to use
          </div>
          <div className='absolute rounded-full flex px-2.5 py-1 items-center top-1/2 right-0 bg-white gap-2 border-0'>
            <div className='flex bg-indigo-500 rounded-full text-white p-2'>
              <Icon icon={'carbon:security'} width={22} className="m-auto" />
            </div>
            Cleaning UI
          </div>
          <div className='absolute rounded-full flex px-3.5 py-1.5 items-center  -bottom-6 bg-white gap-2 border-0'>
            <div className='flex bg-blue-500 rounded-full text-white p-2'>
              <Icon icon={'carbon:security'} width={28} className="m-auto" />
            </div>
            Safe & Secured
          </div>
          <div className='absolute bottom-0 h-4/5 w-[90%] -z-[1] rounded-lg bg-accent shadow-2xl shadow-accent/40' />
        </div>

        <div className='flex flex-col gap-8 justify-center h-full text-center'>
          <p className='text-4xl font-bold'>
            {t('home.startHereTitle')}
          </p>
          <p className='leading-10'>{t('home.startHereContent')}
          </p>
          <Link to="/warehouse-rank" className='btn btn-accent btn-lg mx-auto gap-2 text-white  px-5 shadow-2xl shadow-accent/40'>
            <Icon icon={'fa:search'} />
            Search Reviews
          </Link>
        </div>
      </div>
    </div>
  )
}