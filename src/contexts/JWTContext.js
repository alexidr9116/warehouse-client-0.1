import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// utils 
import { SEND_POST_REQUEST, API_AUTH, SEND_GET_REQUEST, API_CLIENT, API_WAREHOUSE } from '../utils/API';

import { isValidToken, setSession } from '../utils/jwt';
import { setNotificationsToStore } from '../store/action/notificationAction';
import { setWarehouseToStore } from '../store/action/warehouseAction';

// ----------------------------------------------------------------------

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },

    OTPFINAL: (state, action) => {
        const { final } = action.payload;
        return {
            ...state,
            isAuthenticated: false,
            isInitialized: true,
            final,
            user: null,
        }
    },
    LOGINED: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        final: null,

        user: null,
    }),


};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
    ...initialState,
    method: 'jwt',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const initialize = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);
                const response = await SEND_GET_REQUEST('/api/warehouse/auth/my-account');

                const { user } = response.data;


                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
                const res = await SEND_GET_REQUEST(API_WAREHOUSE.getSelf);

                if (res.status === 200) {
                    setWarehouseToStore(res.data.warehouse);
                }
                else {
                    setWarehouseToStore({});
                }

            } else {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: 'INITIALIZE',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };

    useEffect(() => {
        console.log("--------------initialize passport-------------------");
        initialize();
    }, []);

    const otpVerify = async (otp, callback) => {
        try {
            const mobile = window.mobile;
            const otpResult = await SEND_POST_REQUEST(API_AUTH.verifyOTP, { mobile, otp });

            const { success } = otpResult.data;

            if (success) {
                // register or update mongodb
                const response = await SEND_POST_REQUEST(API_AUTH.register, {
                    mobile,
                });

                if (response.data.success) {
                    const { token, user } = response.data;
                    setSession(token);
                    dispatch({
                        type: 'LOGINED',
                        payload: {
                            user,
                        },
                    });
                    return ({ success: true });
                }
                else {
                    return { success: false, err: "Register failed" };
                }
            } else {
                return ({ success: false, err: otpResult.message });
            }

        } catch (err) {
            return ({ success: false, err: 'otp response err' });
        }
    }

    const passwordVerify = async (mobile, password) => {

        const response = await SEND_POST_REQUEST(API_AUTH.verifyPassword, { mobile, password });
        const { token, user } = response.data;

        // verify phoneNumber via firebase
        if (!token) {
            try {
                window.mobile = mobile;
                return { success: false, message: 'Password verification error' };
            } catch (err) {
                return { success: false, message: err };
            }
        }
        if (user.status === "inactive") {
            return { success: false, message: 'Your account is inactive. Please contact with administrator' };
        }
        setSession(token);

        dispatch({
            type: 'LOGINED',
            payload: {
                user,
            },
        });
        const res = await SEND_GET_REQUEST(API_WAREHOUSE.getSelf);

        if (res.status === 200) {
            setWarehouseToStore(res.data.warehouse);
        }
        else {
            setWarehouseToStore({});
        }

        return { success: true, message: 'You are login successfully' };

    }
    const login = async (mobile) => {
        try {
            const response = await SEND_POST_REQUEST(API_AUTH.login, { mobile });
            const { token, user } = response.data;
            if (!token) {
                try {
                    window.mobile = mobile;

                } catch (err) {
                    console.log(err);

                }
            } else {
                if (user.status === "inactive") {
                    return "inactive";
                }
                setSession(token);

                dispatch({
                    type: 'LOGINED',
                    payload: {
                        user,
                    },
                });
                const res = await SEND_GET_REQUEST(API_WAREHOUSE.getSelf);

                if (res.status === 200) {
                    setWarehouseToStore(res.data.warehouse);
                }
                else {
                    setWarehouseToStore({});
                }

            }
            return response.data.step;
        }
        catch (err) {
            console.log(err);
            return "error";
        }

    };


    const logout = async () => {
        try {
            setSession(null);
            setWarehouseToStore({})
            dispatch({ type: 'LOGOUT' });
            // signOut(AUTH);
        } catch (err) {

            console.log(err);
        }

    };

    return (
        <AuthContext.Provider value={{
            ...state,
            method: 'jwt',
            login,
            logout,
            otpVerify,
            passwordVerify,
            initialize,
        }} >
            {children}
        </AuthContext.Provider>);
}
export { AuthContext, AuthProvider };