import PropTypes from 'prop-types';

TextMaxLine.propTypes = {
  maxLine: PropTypes.number,
  children:PropTypes.any,
}
export default function TextMaxLine({ maxLine=3, children, ...other }) {
  return (
    <p {...other} style={{ WebkitLineClamp: maxLine, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>
      {children}
    </p>
  )
}