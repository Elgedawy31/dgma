import axios from 'axios';
// import { SERVER_URL } from '@env';
import { useCallback } from 'react';
import useSecureStorage from './useSecureStorage';
import { API_URL } from '@/constants/Index';

type AxiosParams = {
    body?: object;
    isMedia?: boolean;
    endPoint: string;
    hasToken?: boolean;
}
export default function useAxios() {
    const [SERVER_URL] = [API_URL];
    const { readStorage } = useSecureStorage();
    const get = useCallback(async ({ endPoint, hasToken = true }: AxiosParams) => {
        return await axios.get(
            `${SERVER_URL}/api/${endPoint}`,
            { headers: { Authorization: hasToken ? `Bearer ${await readStorage('token')}` : '' } })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${SERVER_URL} ${err}`))
    }, []);

    const patch = useCallback(async ({ endPoint, body, isMedia = false, hasToken = true }: AxiosParams) => { 
        const token = await readStorage('token');
        console.log("Token", token);
        const headers = {
            'Accept': 'application/json',
            Authorization: hasToken ? `Bearer ${token}` : '',
            'Content-Type': isMedia ? 'multipart/form-data' : 'application/json'
        };
        return await axios
            .patch(`${SERVER_URL}/api/${endPoint}`, body, { headers })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${err} `));

    }, []);
    const post = useCallback(async ({ endPoint, body, isMedia = false, hasToken = true }: AxiosParams) => { 
        const token = await readStorage('token');
        console.log("Token", token);
        const headers = {
            'Accept': 'application/json',
            Authorization: hasToken ? `Bearer ${token}` : '',
            'Content-Type': isMedia ? 'multipart/form-data' : 'application/json'
        };
        return await axios
            .post(`${SERVER_URL}/api/${endPoint}`, body, { headers })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${err} `));

    }, []);
    const deleteFunc = useCallback(async ({ endPoint, hasToken = true }: AxiosParams) => {
        const token = await readStorage('token');
        const headers = {
            'Accept': 'application/json',
            Authorization: hasToken ? `Bearer ${token}` : '',
        };
        return await axios
            .delete(`${SERVER_URL}/api/${endPoint}`, { headers })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${err} `));

    }, []);

    return { get, post , deleteFunc , patch };
}
