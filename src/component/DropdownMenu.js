import PropTypes from 'prop-types';
import { useState } from 'react';

DropdownMenu.propTypes = {
  summary: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default function DropdownMenu({ summary, children, className, }) {
  const [toggle, setToggle] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <div className="cursor-pointer" onClick={() => setToggle(!toggle)}>
        {summary}
      </div>
      {toggle &&
        <div className='absolute top-full right-0 z-50' onClick={() => setToggle(!toggle)}>
          {children}
        </div>
      }
    </div>
  )
}