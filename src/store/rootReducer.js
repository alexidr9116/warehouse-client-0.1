import { combineReducers } from "redux";

import storage from "redux-persist/lib/storage";
 
import notificationReducer from './slice/notification';
 
const rootPersistConfig = {
    key:'root',
    storage,
    keyPrefix:'redux-',
    whitelist:[''],
}

const rootReducer = combineReducers({
    notification:notificationReducer,
   
});
export {rootPersistConfig, rootReducer};