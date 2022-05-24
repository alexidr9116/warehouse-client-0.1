import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import useAuth from "../../hook/useAuth";
import { t, useTranslation } from "react-i18next";

export default function Navbar({ routers, onClose }) {
    const currentLocation = useLocation();
    const [drawer,setDrawer] = useState(true);
    const { user, isAuthenticated } = useAuth(); 
    const { t } = useTranslation();
    const handleClose=()=>{
        if(onClose){
            onClose();
        }
    }
    return (
        <div className = "ease-in duration-300 ">
        <div className = "hidden sm:block">
            {drawer &&
            <IconButton onClick = {()=>(setDrawer(false))}><ArrowBack></ArrowBack></IconButton> }
            {!drawer && 
            <IconButton onClick = {()=>(setDrawer(true))}><ArrowForward></ArrowForward></IconButton>
            }
        </div>
        {drawer && 
        <ul className="sm:w-[240px] sticky mt-10 ml-2">

            {routers &&
                routers.map((router, index) => {
                    const isEqual = currentLocation.pathname === router.path;
                    return (
                        <label key={`l-${index}`}>

                            {router.elements && (
                                <li key={`p-${index}`}>
                                    <ul className="pl-4">
                                        <li className="text-lg  font-bold" key={index}>

                                            {t(router.value)}{" "}
                                        </li>{" "}
                                        {router.elements.map((sub, sindex) => {
                                            const isSubEqual = currentLocation.pathname === sub.path;

                                            return (
                                                <li
                                                    className={`w-full pl-4 text-lg text-bold ${isSubEqual
                                                            ? "border-sky-400 text-sky-400 border-l-[1px]  text-bold"
                                                            : ""
                                                        }`}
                                                    key={`sub-${sindex}`}
                                                >
                                                    <Link
                                                        to={sub.path}
                                                        className={``}
                                                        onClick={handleClose}
                                                    >

                                                        {t(sub.value)}{" "}
                                                    </Link>{" "}
                                                </li>
                                            );
                                        })}{" "}
                                    </ul>{" "}
                                </li>
                            )}{" "}
                            {!router.elements && (
                                <li
                                    className={`w-full pl-4 text-lg text-bold  ${isEqual ? "border-sky-400 text-sky-400 text-bold border-l-[1px]" : ""
                                        }`}
                                    key={index}
                                >
                                    <Link to={router.path} onClick={handleClose} className={``}>

                                        {t(router.value)}{" "}
                                    </Link>{" "}
                                </li>
                            )}{" "}
                        </label>
                    );
                })}{" "}
        </ul>
        }
        </div>
    );
}