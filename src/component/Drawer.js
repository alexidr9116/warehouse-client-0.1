import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';

Drawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  side: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
  children: PropTypes.node,
  className: PropTypes.string,
}



export default function Drawer({ open, onClose, side = 'left', children, className }) {

  const classes = getClasses(side);
  return (
    <div className={` overflow-x-hidden overflow-y-auto  inset-0 z-40 ${open ? 'fixed' : 'hidden'} `}>
      <div className="opacity-80 fixed inset-0 bg-black" onClick={onClose} />
      <div className={` absolute transition-all z-50 overflow-y-auto ${classes} ${className}`} >
       
          <button className='btn btn-ghost absolute btn-circle top-2 right-2' onClick={onClose}>
            <Icon icon={'ic:round-close'} width={24} height={24} />
          </button>
          {children}
      </div>
    </div>
  )
}

const getClasses = (side) => {
  let classNames = "";
  if (side === 'left')
    classNames = `left-0 top-0 bottom-0 max-w-screen`
  else if (side === 'right')
    classNames = `right-0 top-0 bottom-0 max-w-screen`
  else if (side === 'top')
    classNames = `left-0 top-0 right-0 max-h-screen`
  else if (side === 'bottom')
    classNames = `left-0 right-0 bottom-0 max-h-screen`
  return classNames
}