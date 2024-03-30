import React, { useState, useEffect, useContext, createContext } from 'react';
import { ServiceContext } from '../services/ApiService';
import { Dictionary, SharedData } from '../state/types';

export const generateRandomCars = async (setSharedData: React.Dispatch<React.SetStateAction<SharedData>>) => {

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    for (let i = 0; i < 100; i++) {
        await postCar({ name: `Car ${i}`, color: getRandomColor() });
    }
    fetchCarsForPage(1, setSharedData);
};


export const fetchCarsForPage = async (page: number, setSharedData: React.Dispatch<React.SetStateAction<SharedData>>) => {
    const pageSize = 7;
    const { data, headers } = await ServiceContext.apiService.fetchData(`/garage?_page=${page}&_limit=${pageSize}`)
    if (data) {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            cars: data,
            totalCars: parseInt(headers.get('X-Total-Count') || '0')
        }));
    }
};

export const postCar = async (car: { name: string; color: string }) => {
    await ServiceContext.apiService.postData('/garage', JSON.stringify(car))
};

export const handleUpdateCar = async (carId: number, sharedData: SharedData) => {

    const car = sharedData.cars.filter(car => car.id == carId)
    await ServiceContext.apiService.putData(`/garage/${carId}`, JSON.stringify(car))
};

export const handleDeleteCar = async (carId: number, setSharedData: React.Dispatch<React.SetStateAction<SharedData>>) => {
    const response = await ServiceContext.apiService.deleteData(`/garage/${carId}`)
    if (response.ok) {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            cars: prevSharedData.cars.filter(car => car.id !== carId),
        }));
    }
};

//specific cat start
export const handleStartCar = async (carId: number) => {
    const data = await ServiceContext.apiService.patchData(`/engine?id=${carId}&status=started`)
    return data
}

//specific car stop
export const handleStopCar = async (carId: number, sharedData: SharedData, setSharedData: React.Dispatch<React.SetStateAction<SharedData>>) => {
    await ServiceContext.apiService.patchData(`/engine?id=${carId}&status=stopped`)

    delete sharedData.carRaceState[carId]
    setSharedData((prevSharedData) => ({
        ...prevSharedData,
        carRaceState: sharedData.carRaceState
    }));
}

