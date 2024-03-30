import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Garage.css';

const Garage: React.FC = () => {
    const [cars, setCars] = useState<any[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewName, setViewName] = useState<string>('Garage');
    const [velocity, setVelocity] = useState<{ [carId: number]: number }>({});
    const [translateValue, setTranslateValue] = useState<{ [carId: number]: number }>({});
    const [isAnimating, setIsAnimating] = useState<{ [carId: number]: boolean }>({});
    const [totalCars, setTotalCars] = useState<number>(0);
    const [pageSize] = useState(7);
    const [isRacing, setIsRacing] = useState(false);
    const [winner, setWinner] = useState<number>(0);


    const fetchCarsForPage = async (page: number) => {
        const response = await fetch(`http://localhost:3000/garage?_page=${page}&_limit=7`);
        const data = await response.json();
        setTotalCars(getTotalCars(response));
        if (data) {
            setCars(data);
        }

    };

    const handleRaceClick = async () => {

        for (const car of cars) {
            await handleStartCar(car.id);
        }

        for (const car of cars) {
            const element = document.getElementById(`car${car.id}`);
            element?.addEventListener("transitionend", () => {
                if (winner == 0) {
                    setWinner(car.id)
                    alert(`Car ${car.name} won!`)

                    navigate(`/winners`)
                    handleResetClick()
                }
            });

            const newTranslateValue = window.innerWidth;
            setTranslateValue((prevState) => ({
                ...prevState,
                [car.id]: newTranslateValue - 82,
            }));
        }
        setIsRacing(true);
    };

    // specific car start animation 
    const handleStartClick = async (carId: number) => {
        await handleStartCar(carId);

        const newTranslateValue = window.innerWidth;
        setTranslateValue((prevState) => ({
            ...prevState,
            [carId]: newTranslateValue - 82,
        }));
    }

    // stop tthe race
    const handleResetClick = async () => {
        for (const car of cars) {
            await handleStopCar(car.id);
        }
        console.log('Starting the race for all cars...');
        setIsRacing(false);
        setWinner(0);
    };

    const getTotalCars = (response: Response) => {
        const totalCountHeader = response.headers.get('X-Total-Count');
        return totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const generateRandomCars = async () => {

        for (let i = 0; i < 100; i++) {
            await postCar({ name: `Car ${i}`, color: getRandomColor() });
        }
        fetchCarsForPage(1);
    };

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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

    // render cars list
    const renderCars = () => {
        return cars.map((car: any, index: number) => (
            <div key={index} className="car" style={{ marginBottom: '10px' }}>
                {/* buttons */}
                <div className='name-color' style={{ marginBottom: '5px', display: isRacing ? 'none' : 'block' }}>
                    <input
                        type="text"
                        value={car.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        style={{ marginRight: '5px' }}
                    />
                    <div className="color-preview" style={{ backgroundColor: car.color }}></div>
                    <input
                        type="color"
                        value={car.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        style={{ width: '30px', marginRight: '5px' }}
                    />
                    <button style={{ marginRight: '5px' }} onClick={() => handleUpdateCar(car.id, car.name, car.color)}>Update</button>

                    <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
                </div>
                <div style={{ marginBottom: '5px', display: isRacing ? 'none' : 'block' }}>
                    <button style={{ marginRight: '5px' }} disabled={isAnimating[car.id]} onClick={() => handleStartClick(car.id)}>Start</button>
                    <button disabled={!isAnimating[car.id]} onClick={() => handleStopCar(car.id)}>Stop</button>
                </div>
                {/* car icon */}
                <div className='car-cont' style={{ width: '100%' }}>
                    <div id={`car${car.id}`} className="car-container" style={{ paddingTop: '3px', paddingLeft: '2px' }}>
                        <img
                            className="car-icon"
                            src="/car.png"
                            alt="Car Icon"
                            style={{
                                backgroundColor: car.color,
                                width: '60px',
                                height: '50px',
                                transition: `transform ${velocity[car.id] * 0.1}s linear`,
                                transform: `translateX(${translateValue[car.id]}px)`
                            }}
                        />
                    </div>

                </div>
            </div >
        ));
    };

    const postCar = async (car: { name: string; color: string }) => {
        await fetch('http://localhost:3000/garage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });
    };



    const handleUpdateCar = async (carId: number, newName: string, newColor: string) => {
        try {
            const response = await fetch(`http://localhost:3000/garage/${carId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName, color: newColor }),
            });
            if (response.ok) {
                setCars(prevCars =>
                    prevCars.map(car =>
                        car.id === carId ? { ...car, name: newName, color: newColor } : car
                    )
                );
            } else {
                // Handle error, show error message to the user
                console.error('Failed to update car');
            }
        } catch (error) {
            // Handle network error
            console.error('Network error:', error);
        }
    };

    const handleDeleteCar = async (carId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/garage/${carId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCars(prevCars => prevCars.filter(car => car.id !== carId));
            } else {
                // Handle error, show error message to the user
                console.error('Failed to delete car');
            }
        } catch (error) {
            // Handle network error
            console.error('Network error:', error);
        }
    };

    //specific cat start
    const handleStartCar = async (carId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/engine?id=${carId}&status=started`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            setVelocity((prevState) => ({
                ...prevState,
                [carId]: data.velocity,
            }));
            setIsAnimating((prevState) => ({
                ...prevState,
                [carId]: true,
            }));
        } catch (error) {
            console.error('Error starting car:', error);
        }
    }

    //specific car stop
    const handleStopCar = async (carId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/engine?id=${carId}&status=stopped`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
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
        } catch (error) {
            console.error('Error stopping car:', error);
        }
    }

    useEffect(() => {
        fetchCarsForPage(currentPage);
    }, [currentPage]);

    return (
        <div className="garage-container">
            <h2>{viewName}</h2>
            <div className='race-generate'>
                <div>
                    <button disabled={isRacing} onClick={handleRaceClick}>Race</button>
                    <button disabled={!isRacing} onClick={handleResetClick}>Reset</button>
                </div>
                <button onClick={generateRandomCars}>Generate Random Cars</button>
            </div>
            <div className="car-list">{renderCars()}</div>
            {/* pagination */}
            <div>
                <button style={{ marginRight: '5px' }} onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                {currentPage}
                <button style={{ marginLeft: '5px' }} onClick={handleNextPage} disabled={currentPage * pageSize >= totalCars}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Garage;
