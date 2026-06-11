import axios from 'axios';
import {setInterceptors} from '@/common/interceptors';

function createInstance() {
    return axios.create();
}
export const axiosInstance = createInstance();

function createInstanceWithAuth() {
    const instance = axios.create();
    return setInterceptors(instance);
}
export const axiosInstanceWithAuth = createInstanceWithAuth();