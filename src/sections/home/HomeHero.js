import { Icon } from "@iconify/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "../../component/Image";


export default function HomeHero() {

  const [query, setQuery] = useState();

  const handleInput = (e) => {
    setQuery(e.target.value);
  }
  const handleFetch = () => {
    console.log(query);
  }
  const {t} = useTranslation();
  return (
    <div className='container  max-w-6xl  px-5 mb-20 '>
      <div className='flex flex-col lg:flex-row gap-8 items-center justify-center'>
        <div className='max-w-lg relative'>
          <Image src="/images/home/hero.png" width={'100%'} alt = "hero"/>
        </div>
        <div className='max-w-lg h-full flex flex-col justify-center text-center lg:text-left'>
          <p className='font-bold text-4xl mb-8 leading-[3rem] '>
            {t('home.heroTitle')}
          </p>
          <p className='mb-8 text-xl'>
          {t('home.heroContent')}
          </p>
          <div className='w-full flex gap-4 items-center rounded-full pr-2 bg-white border lg:border-0 lg:bg-transparent'>
            <input className='input rounded-full input-lg bg-white grow  border  lg:border-gray-300 ' placeholder='What are you looking For....' onChange={handleInput} />
            <button className='btn btn-accent gap-2 text-white btn-circle lg:btn-lg lg:w-32 lg:shadow-2xl lg:shadow-accent/40'
              onClick={handleFetch}
            >
              <Icon icon={'fa:search'} className="text-lg" />
              <span className="hidden lg:block">Search</span>
            </button>
          </div>
        </div>
      </div>

    </div>

  )
}