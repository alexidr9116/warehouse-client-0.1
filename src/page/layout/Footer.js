import { Icon } from "@iconify/react";
import { useEffect, useState } from "react"
export default function Footer() {
    const [marginTop,setMarginTop] = useState(0);
    useEffect(() => {
        const mt =( window.innerHeight>document.body.clientHeight?(window.innerHeight-document.clientHeight - 108):-1);
        setMarginTop(mt);
        
    },[])
    return (
       
        <>
        </>
    );
}