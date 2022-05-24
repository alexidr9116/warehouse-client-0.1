import { combineReducers } from "redux";

import storage from "redux-persist/lib/storage";
import warehouseReducer from './slice/warehouse';
import notificationReducer from './slice/notification';
 
const rootPersistConfig = {
    key:'root',
    storage,
    keyPrefix:'redux-',
    whitelist:[''],
}

const rootReducer = combineReducers({
    notification:notificationReducer,
    warehouse:warehouseReducer,
});
export {rootPersistConfig, rootReducer};