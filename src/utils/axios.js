import axios from 'axios';
// config
// export const SERVER_ADDRESS = "https://mini-vendor.herokuapp.com/";
export const SERVER_ADDRESS = "http://localhost:5500/";
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
    baseURL: SERVER_ADDRESS,

    // withCredentials:true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);


export default axiosInstance;