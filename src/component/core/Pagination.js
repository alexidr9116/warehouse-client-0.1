import PropType from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';

Pagination.propTypes = {
    currentPage: PropType.number,
    totalCount: PropType.number,
    handleChangePage: PropType.func,
    perPageCount: PropType.number
}
export default function Pagination({ currentPage = 1, totalCount = 1, handleChangePage, perPageCount = 3 }) {
    const totalPageCount = Math.ceil(totalCount / perPageCount);
    
    const [current,setCurrent] = useState(currentPage);
    const handlePage=(f)=>{
        let currentPage = current;
        if(f === "first"){
            currentPage = 1;
             
        }
        if(f === "prev" && current > 1){
            currentPage = (current-1)
        }
        if(f === "next" && current <totalPageCount){
            currentPage = (current+1)
        }
        if(f === "last"){
            currentPage = (totalPageCount);
        }
        if(currentPage!== current){
            setCurrent(currentPage);
            handleChangePage(currentPage);
        }
    }
    return (
        <div className = "flex items-center mt-3 gap-1">
            <button className='btn btn-info btn-sm' onClick={()=>handlePage('first')}>
                <Icon icon="fluent:arrow-previous-24-filled" />
            </button>
            <button className='btn btn-info  btn-sm'  onClick={()=>handlePage('prev')}>
                <Icon icon="ooui:previous-ltr" />
            </button>
            <input type = "number" value = {current} className = "input max-w-[70px] text-right" onChange={()=>{}}/><span className='mr-3'>of {totalPageCount}</span>
            <button className='btn btn-info  btn-sm'  onClick={()=>handlePage('next')}>
                <Icon icon = "ooui:previous-rtl"/>
                
            </button>
            <button className='btn btn-info  btn-sm'  onClick={()=>handlePage('last')}> 
                <Icon icon = "ooui:move-last-ltr"/>
                
            </button>
           
        </div>
    )
}