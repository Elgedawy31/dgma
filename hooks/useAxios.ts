// import { SERVER_URL } from '@env';
import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useToast } from '@context/ToastContext';
import useSecureStorage from './useSecureStorage';

type AxiosParams = {
    body?: object;
    endPoint: string;
    isMedia?: boolean;
    hasToken?: boolean;
}

export default function useAxios() {
   const SERVER_URL = 'http://192.168.1.71:5001'
    const { readStorage } = useSecureStorage();
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = useToast();

    const handleError = (error: any) => {
        let errorMessage = '';
        if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.response?.data?.errors?.password) {
            errorMessage = error.response.data.errors.password;
        } else {
            errorMessage = 'An unexpected error occurred';
        }
        setError(errorMessage);
        setIsError(true);
        showToast(errorMessage, true);

        setTimeout(() => {
            setError('');
            setIsError(false);
        }, 2000);
    };

    const getRequest = useCallback(async ({ endPoint }: AxiosParams) => {
        const token: string | null = await readStorage<string>('token');
        if (token) {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };
            return await axios.get(
                `${SERVER_URL}/api/${endPoint}`, { headers })
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    handleError(error);
                    return null;
                })
                .finally(() => setLoading(false));
        }
        else {
            handleError({ response: { data: { error: 'Token not found' } } });
            return null;
        }
    }, []);

    const patchRequest = useCallback(async ({ endPoint, body, isMedia = false }: AxiosParams) => {
        const token: string | null = await readStorage<string>('token');
        if (token) {
            setLoading(true);
            const headers = {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': isMedia ? 'multipart/form-data' : 'application/json'
            };
            return await axios
                .patch(`${SERVER_URL}/api/${endPoint}`, body, { headers })
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    handleError(error);
                    return null;
                })
                .finally(() => setLoading(false));
        }
        else {
            handleError({ response: { data: { error: 'Token not found' } } });
            return null;
        }
    }, []);

    const putRequest = useCallback(async ({ endPoint, body, isMedia = false }: AxiosParams) => {
        const token: string | null = await readStorage<string>('token');
        if (token) {
            setLoading(true);
            const headers = {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': isMedia ? 'multipart/form-data' : 'application/json'
            };
            return await axios
                .put(`${SERVER_URL}/api/${endPoint}`, body, { headers })
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    handleError(error);
                    return null;
                })
                .finally(() => setLoading(false));
        }
        else {
            handleError({ response: { data: { error: 'Token not found' } } });
            return null;
        }
    }, []);

    const postRequest = useCallback(async ({ endPoint, body, isMedia = false, hasToken = true }: AxiosParams) => {
        const token: string | null = await readStorage<string>('token');
        console.log(SERVER_URL);
        if ((hasToken && token) || (!hasToken)) {
            setLoading(true);
            const headers = {
                'Accept': 'application/json',
                Authorization: hasToken ? `Bearer ${token}` : '',
                'Content-Type': isMedia ? 'multipart/form-data' : 'application/json'
            };
            return await axios
                .post(`${SERVER_URL}/api/${endPoint}`, body, { headers })
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    handleError(error);
                    return null;
                })
                .finally(() => setLoading(false));
        }
        else {
            handleError({ response: { data: { error: 'Token not found' } } });
            return null;
        }
    }, []);

    const deleteRequest = useCallback(async ({ endPoint }: AxiosParams) => {
        const token: string | null = await readStorage<string>('token');
        if (token) {
            setLoading(true);
            const headers = {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            };
            return await axios
                .delete(`${SERVER_URL}/api/${endPoint}`, { headers })
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    handleError(error);
                    return null;
                })
                .finally(() => setLoading(false));
        }
        else {
            handleError({ response: { data: { error: 'Token not found' } } });
            return null;
        }
    }, []);

    return { getRequest, postRequest, deleteRequest, patchRequest, putRequest, error, isError, loading };
}
