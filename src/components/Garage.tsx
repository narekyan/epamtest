import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Garage.css';
import { useAppContext } from '../state/AppProvider';
import { useServiceContext } from '../services/ApiService';

const Garage: React.FC = () => {
    const { sharedData, setSharedData } = useAppContext();
    const { apiService } = useServiceContext();

    const navigate = useNavigate();
    const [cars, setCars] = useState<any[]>([]);
    const [viewName, setViewName] = useState<string>('Garage');
    const [velocity, setVelocity] = useState<{ [carId: number]: number }>({});
    const [translateValue, setTranslateValue] = useState<{ [carId: number]: number }>({});
    const [isAnimating, setIsAnimating] = useState<{ [carId: number]: boolean }>({});
    const [totalCars, setTotalCars] = useState<number>(0);
    const [pageSize] = useState(7);
    const [carSize] = useState(60);
    const [winnerName, setWinnerName] = useState<string>('');
    const [isRacing, setIsRacing] = useState(false);

    const generateRandomCars = async () => {

        for (let i = 0; i < 100; i++) {
            await postCar({ name: `Car ${i}`, color: getRandomColor() });
        }
        fetchCarsForPage(1);
    };

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    const handleRaceClick = async () => {

        for (const car of cars) {
            await handleStartCar(car.id);
        }

        for (const car of cars) {
            const element = document.getElementById(`car${car.id}`);
            element?.addEventListener("transitionend", () => {
                if (sharedData.winner == 0) {
                    setSharedData((prevSharedData) => ({
                        ...prevSharedData,
                        winner: car.id,
                    }));
                    setWinnerName(car.name)

                    navigate(`/winners`)
                    handleResetClick()
                }
            });

            const newTranslateValue = window.innerWidth;
            setTranslateValue((prevState) => ({
                ...prevState,
                [car.id]: newTranslateValue - carSize - 20, // some padding
            }));
        }
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            winner: 0,
        }));
        setIsRacing(true);
    };

    // specific car start animation 
    const handleStartClick = async (carId: number) => {
        await handleStartCar(carId);

        const newTranslateValue = window.innerWidth;
        setTranslateValue((prevState) => ({
            ...prevState,
            [carId]: newTranslateValue - carSize - 20, // some padding
        }));
    }

    // stop tthe race
    const handleResetClick = async () => {
        for (const car of cars) {
            await handleStopCar(car.id);
        }
        setWinnerName('')
        setIsRacing(false);
    };

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

    const handleNameChange = (index: number, newName: string) => {
        setCars((prevCars) =>
            prevCars.map((car, i) => (i === index ? { ...car, name: newName } : car))
        );
    };

    const handleColorChange = (index: number, newColor: string) => {
        setCars((prevCars) =>
            prevCars.map((car, i) => (i === index ? { ...car, color: newColor } : car))
        );
    };

    const fetchCarsForPage = async (page: number) => {
        const { data, headers } = await apiService.fetchData(`/garage?_page=${page}&_limit=${pageSize}`)
        if (data) {
            setCars(data);
            setTotalCars(parseInt(headers.get('X-Total-Count') || '0'));
        }

    };

    const postCar = async (car: { name: string; color: string }) => {
        await apiService.postData('/garage', JSON.stringify(car))
    };

    const handleUpdateCar = async (carId: number, newName: string, newColor: string) => {
        await apiService.putData(`/garage/${carId}`, JSON.stringify({ name: newName, color: newColor }))
    };

    const handleDeleteCar = async (carId: number) => {
        const response = await apiService.deleteData(`/garage/${carId}`)
        if (response.ok) {
            setCars(prevCars => prevCars.filter(car => car.id !== carId));
        }
    };

    //specific cat start
    const handleStartCar = async (carId: number) => {
        const data = await apiService.patchData(`/engine?id=${carId}&status=started`)
        setVelocity((prevState) => ({
            ...prevState,
            [carId]: data.velocity,
        }));
        setIsAnimating((prevState) => ({
            ...prevState,
            [carId]: true,
        }));
    }

    //specific car stop
    const handleStopCar = async (carId: number) => {
        const data = await apiService.patchData(`/engine?id=${carId}&status=stopped`)
        setTranslateValue((prevState) => ({
            ...prevState,
            [carId]: 0,
        }));
        setVelocity((prevState) => ({
            ...prevState,
            [carId]: 0,
        }));
        setIsAnimating((prevState) => ({
            ...prevState,
            [carId]: false,
        }));

    }

    useEffect(() => {
        fetchCarsForPage(sharedData.pageNumberGarage);
    }, [sharedData.pageNumberGarage]);

    // render cars list
    const renderCars = () => {
        return cars.map((car: any, index: number) => (
            <div key={index} className="car" >
                {/* buttons */}
                <div className='name-color' style={{ display: isRacing ? 'none' : 'block' }}>
                    <input
                        type="text"
                        value={car.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                    />
                    <div className="color-preview" style={{ backgroundColor: car.color }}></div>
                    <input
                        type="color"
                        value={car.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        style={{ width: '30px' }}
                    />
                    <button className='button marginRight' onClick={() => handleUpdateCar(car.id, car.name, car.color)}>Update</button>

                    <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
                </div>
                <div style={{ display: isRacing ? 'none' : 'block' }}>
                    <button className='button marginRight' disabled={isAnimating[car.id]} onClick={() => handleStartClick(car.id)}>Start</button>
                    <button disabled={!isAnimating[car.id]} onClick={() => handleStopCar(car.id)}>Stop</button>
                </div>
                {/* car icon */}
                <div className='car-cont'>
                    <div id={`car${car.id}`} className="car-container" style={{ paddingTop: '3px', paddingLeft: '2px' }}>
                        <img
                            className="car-icon"
                            src="/car.png"
                            alt="Car Icon"
                            style={{
                                backgroundColor: car.color,
                                width: `${carSize}px`,
                                height: `${carSize}px`,
                                transition: `transform ${velocity[car.id] * 0.1}s linear`, // made animation time 10 perscent of velocity
                                transform: `translateX(${translateValue[car.id]}px)`
                            }}
                        />
                    </div>

                </div>
            </div >
        ));
    };

    return (
        <div className="garage-container">
            <h2>{viewName}</h2>
            <div className='race-generate'>
                <div>
                    <button disabled={isRacing} onClick={handleRaceClick}>Race</button>
                    {winnerName === '' ? '' : `Car with name '${winnerName}' won!!`}
                    <button disabled={!isRacing} onClick={handleResetClick}>Reset</button>
                </div>
                <button onClick={generateRandomCars}>Generate Random Cars</button>
            </div>
            <div className="car-list">{renderCars()}</div>
            {/* pagination */}
            <div>
                <button className='button marginRight' onClick={handlePrevPage} disabled={sharedData.pageNumberGarage === 1}>
                    Previous
                </button>
                {sharedData.pageNumberGarage}
                <button className='button marginLeft' onClick={handleNextPage} disabled={sharedData.pageNumberGarage * pageSize >= totalCars}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Garage;
