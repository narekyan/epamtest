import React, { useState, useEffect } from 'react';
import Pagination from './Pagination'; // Import Pagination component
import './Garage.css'; // Import CSS for styling

const Garage: React.FC = () => {
    const [cars, setCars] = useState<any[]>([]); // State to store cars
    const [currentPage, setCurrentPage] = useState<number>(1); // State to track current page
    const [totalPages, setTotalPages] = useState<number>(0); // State to track total pages
    const [viewName, setViewName] = useState<string>('Garage'); // Name of the current view

    // Function to fetch cars for current page
    const fetchCarsForPage = async (page: number) => {
        const response = await fetch(`http://localhost:3000/garage?_page=${page}&_limit=7`);
        const data = await response.json();
        if (data) { // Check if data and data.cars are not null
            setCars(data);

        }
    };

    // Function to generate random cars
    const generateRandomCars = async () => {
        // Assuming there's an API endpoint for generating random cars
        for (let i = 0; i < 100; i++) {
            await postCar({ name: `Car ${i}`, color: getRandomColor() });
        }
        fetchCarsForPage(1);
    };

    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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

    // Function to handle color selection
    const handleColorSelection = (carIndex: number, color: string) => {
        // Update the color of the car at the specified index
        const updatedCars = [...cars];
        updatedCars[carIndex].color = color;
        setCars(updatedCars);
    };

    const handleNameChange = (index: number, newName: string) => {
        setCars((prevCars) =>
            prevCars.map((car, i) => (i === index ? { ...car, name: newName } : car))
        );
    };

    // Function to handle changing the color of a car
    const handleColorChange = (index: number, newColor: string) => {
        setCars((prevCars) =>
            prevCars.map((car, i) => (i === index ? { ...car, color: newColor } : car))
        );
    };

    // Function to calculate the hue from the given color
    const calculateHue = (color: string) => {
        // Convert the hex color to RGB
        const r = parseInt(color.substring(1, 3), 16) / 255;
        const g = parseInt(color.substring(3, 5), 16) / 255;
        const b = parseInt(color.substring(5, 7), 16) / 255;

        // Convert RGB to HSL
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let hue = 0;

        if (max === min) {
            hue = 0;
        } else if (max === r) {
            hue = ((g - b) / (max - min)) * 60;
        } else if (max === g) {
            hue = 120 + ((b - r) / (max - min)) * 60;
        } else {
            hue = 240 + ((r - g) / (max - min)) * 60;
        }

        // Ensure hue is between 0 and 360
        hue = (hue + 360) % 360;

        return hue;
    };


    // Render cars
    const renderCars = () => {
        return cars.map((car: any, index: number) => (
            <div key={index} className="car" style={{ marginBottom: '10px' }}>
                {/* Editable input field for the car name */}
                <div style={{ marginBottom: '5px' }}>
                    <input
                        type="text"
                        value={car.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                </div>
                {/* Color preview and selection */}
                <div style={{ marginBottom: '5px' }}>
                    <div className="color-preview" style={{ backgroundColor: car.color, marginRight: '10px' }}></div>
                    <input
                        type="color"
                        value={car.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                </div>
                {/* Buttons to update and delete the car */}
                <div style={{ marginBottom: '5px' }}>
                    {/* Button to update the car */}
                    <button onClick={() => handleUpdateCar(car.id, car.name, car.color)}>Update</button>
                    {/* Button to delete the car */}
                    <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
                </div>
                {/* Car icon */}
                <div style={{ marginTop: '5px' }}>
                    <div className="car-container">
                        <img
                            className="car-icon"
                            src="/car.png"
                            alt="Car Icon"
                            style={{
                                width: '60px',
                                height: '50px',
                            }}
                        />
                    </div>

                </div>
            </div>
        ));
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
                // Car successfully deleted, perform any necessary actions (e.g., update state)
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

    const handlePaginationChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchCarsForPage(currentPage);
    }, [currentPage]);

    return (
        <div className="garage-container">
            <h2>{viewName}</h2>
            <button onClick={generateRandomCars}>Generate Random Cars</button>
            <div className="car-list">{renderCars()}</div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePaginationChange}
            />
        </div>
    );
};

export default Garage;
