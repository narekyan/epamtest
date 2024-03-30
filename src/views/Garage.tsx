import React, { useState, useEffect } from 'react';
import './Garage.css';
import { useAppContext } from '../state/AppProvider';
import Pagination from '../components/pagination';
import CarsList from '../components/carsList';
import CarsTopBar from '../components/carsTopbar';
import * as carsNetwork from '../components/carsNetwork';

const Garage: React.FC = () => {
    const { sharedData, setSharedData } = useAppContext();
    const [isRacing, setIsRacing] = useState(false);
    const [carSize] = useState(60);
    const [pageSize] = useState(7);

    const handleNextPage = () => {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            pageNumberGarage: prevSharedData.pageNumberGarage + 1,
        }));
    };

    const handlePrevPage = () => {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            pageNumberGarage: Math.max(prevSharedData.pageNumberGarage - 1, 1),
        }));
    };

    const handleResetClick = () => {
        setIsRacing(false);
    }

    const handleRaceClick = () => {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            winner: 0,
        }));
        setIsRacing(true);
    }

    const handleNameChange = (index: number, newName: string) => {
        const cars = { ...sharedData.cars };
        cars[index].name = newName
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            carRaceState: cars,
        }));
    };

    const handleColorChange = (index: number, newColor: string) => {
        const cars = { ...sharedData.cars };
        cars[index].color = newColor
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            carRaceState: cars,
        }));
    };

    // specific car start animation 
    const handleStartClick = async (carId: number) => {
        let data = await carsNetwork.handleStartCar(carId);
        const newTranslateValue = window.innerWidth;
        const carRaceState = { ...sharedData.carRaceState };
        carRaceState[carId] = {
            transValue: newTranslateValue - carSize - 20, // some padding;
            velocity: data.velocity,
            animating: true
        }
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            carRaceState: carRaceState,
        }));
    }
    useEffect(() => {

        carsNetwork.fetchCarsForPage(sharedData.pageNumberGarage, setSharedData);
    }, [sharedData.pageNumberGarage]);

    return (
        <div className="garage-container">
            <h2>Garage</h2>
            <CarsTopBar
                isRacing={isRacing}
                onGenerateRandomCars={() => carsNetwork.generateRandomCars(setSharedData)}
                onHandleResetClick={handleResetClick}
                onHandleRaceClick={handleRaceClick}
            />
            <CarsList
                cars={sharedData.cars}
                carRaceState={sharedData.carRaceState}
                isRacing={isRacing}
                onHandleColorChange={handleColorChange}
                onHandleNameChange={handleNameChange}
                onHandleDelete={(carId) => carsNetwork.handleDeleteCar(carId, setSharedData)}
                onHandleUpdate={(carId) => carsNetwork.handleUpdateCar(carId, sharedData)}
                onHandleStart={handleStartClick}
                onHandleStop={(carId) => carsNetwork.handleStopCar(carId, sharedData, setSharedData)}
            />
            <Pagination
                pageNumberWinner={sharedData.pageNumberWinner}
                totalItems={sharedData.totalCars}
                pageSize={pageSize}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
            />
        </div>
    );
};

export default Garage;
