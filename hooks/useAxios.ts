import axios from 'axios';
// import { SERVER_URL } from '@env';
import { useCallback } from 'react';
import useSecureStorage from './useSecureStorage';

type AxiosParams = {
    body?: object;
    isMedia?: boolean;
    endPoint: string;
    options?: object;
    hasToken?: boolean;
    maxRetries?: number;
}

let SERVER_URL = 'http://192.168.1.71:5001';
export default function useAxios() {
    const { readStorage } = useSecureStorage();
    const get = useCallback(async ({ endPoint, hasToken = true }: AxiosParams) => {
        return await axios.get(
            `${SERVER_URL}/api/${endPoint}`,
            { headers: { Authorization: hasToken ? `Bearer ${await readStorage('token')}` : '' } })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${err}`))
    }, []);

    const post = useCallback(async ({ endPoint, body, isMedia = false, hasToken = true }: AxiosParams) => {
        const token = await readStorage('token');
        const headers = {
            'Accept': 'application/json',
            Authorization: hasToken ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data',
        };
        return await axios
            .post(`${SERVER_URL}/api/${endPoint}`, body, { headers })
            .then(res => res.data)
            .catch(err => console.log(`Error: ${err} `));

    }, []);

    return { get, post };
}
