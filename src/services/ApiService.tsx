import React, { createContext, useContext } from 'react';

const ApiService = (baseUrl: string) => {
    const fetchData = async (endpoint: string) => {
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();
        return { data, headers: response.headers };
    }

    const postData = async (endpoint: string, body: string) => {
        await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            body: body,
        });
    };

    const putData = async (endpoint: string, body: string) => {
        await fetch(`${baseUrl}${endpoint}`, {
            method: 'PUT',
            body: body,
        });
    };

    const patchData = async (endpoint: string) => {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'PATCH',
        });
        return await response.json();
    };

    const deleteData = async (endpoint: string) => {
        return await fetch(`${baseUrl}${endpoint}`, {
            method: 'DELETE'
        });
    };


    return { fetchData, postData, putData, patchData, deleteData };
};


const ServiceContext = createContext({
    apiService: ApiService(process.env.REACT_APP_BACKEND_URL || ''),
});


export const useServiceContext = () => useContext(ServiceContext);