import { forwardRef } from "react";
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet-async";

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => {
    return (
        <>
            <Helmet>
                <title>{`${title} | Ware House`}</title>
            </Helmet>
            <div ref={ref} {...other} >
                {children}
            </div>
        </>
    )

});
Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    meta: PropTypes.node,
};
export default Page;