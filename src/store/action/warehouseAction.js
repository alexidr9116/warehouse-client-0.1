
import {setWarehouse } from "../slice/warehouse";
import { dispatch } from "../store";
export const setWarehouseToStore = async(data)=>{
    dispatch(setWarehouse(data));
    return true;
}

 