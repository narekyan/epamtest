import React, { useState, useEffect } from 'react';
import { useAppContext } from '../state/AppProvider';
import { useNavigate } from 'react-router-dom';
import * as carsNetwork from '../components/carsNetwork';

const CarsTopBar: React.FC<{
    isRacing: boolean,
    onHandleRaceClick: () => void;
    onHandleResetClick: () => void;
    onGenerateRandomCars: () => void;

}> = ({ isRacing, onHandleRaceClick, onHandleResetClick, onGenerateRandomCars }) => {

    const { sharedData, setSharedData } = useAppContext();
    const navigate = useNavigate();
    const [winnerName, setWinnerName] = useState<string>('');
    const [carSize] = useState(60);

    interface Velocities {
        [key: string]: any;
        // Define properties and their types if known
    }

    function transitionHandler(carId: number, carName: string) {
        return function (event: TransitionEvent) {
            if (winnerName === '') {
                setSharedData((prevSharedData) => ({
                    ...prevSharedData,
                    winner: carId,
                }));
                setWinnerName(carName)

                for (const car of sharedData.cars) {
                    const element = document.getElementById(`car${car.id}`);
                    element?.removeEventListener("transitionend", transitionHandler(car.id, car.name));

                }

                handleResetClick()
            }
        }
    }
    const handleRaceClick = async () => {

        const newTranslateValue = window.innerWidth;
        const carRaceState = { ...sharedData.carRaceState };
        const velocities: Velocities = await fetchVelocities();
        for (const car of sharedData.cars) {
            const element = document.getElementById(`car${car.id}`);
            element?.addEventListener("transitionend", transitionHandler(car.id, car.name));

            carRaceState[car.id] = {
                transValue: newTranslateValue - carSize - 20, // some padding;
                velocity: velocities[car.id],
                animating: true
            }

        }
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            carRaceState: carRaceState,
        }));
        onHandleRaceClick()
    };

    const fetchVelocities = async () => {

        var velocities: Velocities = {}
        for (const car of sharedData.cars) {
            let data = await carsNetwork.handleStartCar(car.id);
            velocities[car.id] = data.velocity
        }
        return velocities
    }

    // stop tthe race
    const handleResetClick = async () => {
        for (const car of sharedData.cars) {
            await carsNetwork.handleStopCar(car.id, sharedData, setSharedData);
        }
        onHandleResetClick()
    };


    return (
        <div className='race-generate'>
            <div>
                <button disabled={isRacing} onClick={handleRaceClick}>Race</button>
                {winnerName === '' ? '' : `  Car with name ' ${winnerName} ' won!!  `}
                <button disabled={!isRacing} onClick={handleResetClick}>Reset</button>
            </div>
            <button onClick={onGenerateRandomCars}>Generate Random Cars</button>
        </div>
    );
};

export default CarsTopBar