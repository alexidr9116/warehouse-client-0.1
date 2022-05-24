import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";


import Rating from '@mui/material/Rating'
import Image from "../../component/Image";
import { ASSETS_URL } from '../../utils/API';
import { fNumber, fPrice } from '../../utils/uFormatter';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';

ExperSummary.propTypes = {
  data: PropTypes.object,
}

export default function ExperSummary({ data }) {
  const { warehouse, avg, sum } = data;

  const { img, china, ub, openAlways, period, price, haveBusiness, name, description } = warehouse;

  return (
    <div className='container max-w-6xl px-5 mb-20 justify-center flex'>
      <div className=" flex flex-col md:flex-row gap-10 ">

        <div className="w-52 h-52 rounded-full bg-white flex items-center p-1 justify-center flex-col gap-2">
          <Link to="/"><IconButton><ArrowBack></ArrowBack></IconButton>Back to Home</Link>
          <Image src={`${ASSETS_URL.root}${img}`} alt="warehouse-imgage" />
        </div>
        <div className="max-w-md">
          <p className="text-3xl font-bold mb-10">
            {name}
          </p>
          <p className=" leading-10 mb-10">
            {description}
          </p>
          <p className="mb-5 flex items-center gap-2">
            <Icon icon={'fa6-solid:location-dot'} width={24} height={24} />
            <span className="">
              China:{china.address}, Ulaanbaatar:{ub.address}
            </span>
          </p>
          <p className="mb-5 flex items-center gap-2">
            <Icon icon={'fa6-solid:phone'} width={24} height={24} />
            <span className="">
              China:{china.tel1},{china.tel2}   Ulaanbaatar:{ub.tel1},{ub.tel2}
            </span>
          </p>
          <div className="mb-8 flex items-center gap-2 flex-col w-full ">
            <div className="flex flex-start justify-start w-full gap-2 mb-2">
              <Icon icon={'iconoir:www'} width={24} height={24} />
              <p className="">
                24H Service:{openAlways ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex flex-start justify-start w-full gap-2 mb-2">
              <Icon icon={'mdi:certificate-outline'} width={24} height={24} />
              <p className="">
                Certification:{haveBusiness ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex flex-start justify-start w-full gap-2 mb-2">
              <Icon icon={'bi:calendar2-date'} width={24} height={24} />
              <p className="">
                Period from CH to UB:{period}Days
              </p>
            </div>
            <div className="flex flex-start justify-start w-full gap-2">
              <Icon icon={'arcticons:priceconverter'} width={24} height={24} />
              <p className="">
                Price per Kg:{fPrice(price, '₮')}
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <Rating value={avg} readOnly precision={0.5} /><label className='ml-2'>({fNumber(avg)} Stars)</label>
          </div>

        </div>
      </div>
    </div>
  )
}
