
import {setNotifications } from "../slice/notification";
import { dispatch } from "../store";
export const setNotificationsToStore = async(data)=>{
    dispatch(setNotifications(data));
    return true;
}

 