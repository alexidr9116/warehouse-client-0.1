import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';

Accordion.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  prepend: PropTypes.node,
  className: PropTypes.string,
  summaryClassName: PropTypes.string,
}
export default function Accordion({ prepend, title, children, className, summaryClassName }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(open => !open);
  }
  return (
    <div className={`${className}  rounded `}>
      <div className={`flex justify-between items-center gap-3 cursor-pointer min-h-[2.5rem] px-3 ${summaryClassName}`} onClick={handleOpen} >
        <div>{prepend}</div>
        {title}
        <div className='grow' />
        <Icon icon='fluent:chevron-down-12-filled' className='transition' width={16} height={16} rotate={open ? 2 : 0} />
      </div>
      <div className={`${open ? "max-h-96 overflow-auto " : "max-h-0 overflow-hidden"} transition border-t`}>
        {children}
      </div>
    </div>
  )
}