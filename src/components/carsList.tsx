import React, { useState, useEffect } from 'react';
import { Dictionary } from '../state/types';

const CarsList: React.FC<{
    cars: any[],
    carRaceState: Dictionary;
    isRacing: boolean;
    onHandleNameChange: (index: number, newName: string) => void;
    onHandleColorChange: (index: number, newColor: string) => void;
    onHandleDelete: (id: number) => void;
    onHandleUpdate: (id: number, name: string, color: string) => void;
    onHandleStart: (id: number) => void;
    onHandleStop: (id: number) => void;
}> = ({ cars, carRaceState, isRacing, onHandleNameChange, onHandleColorChange, onHandleDelete, onHandleUpdate, onHandleStart, onHandleStop }) => {

    const [carSize] = useState(60);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');

    const handleInputChange1 = (event: any) => {
        setInputValue1(event.target.value);
    };

    const handleInputChange2 = (event: any) => {
        setInputValue2(event.target.value);
    };
    return (
        <div className="car-list">
            {cars.map((car: any, index: number) => (
                <div key={index} className="car" >
                    {/* buttons */}
                    <div className='name-color' style={{ display: isRacing ? 'none' : 'block' }}>
                        <input
                            type="text"
                            value={car.name}
                            onChange={handleInputChange1}
                        />
                        <div className="color-preview" style={{ backgroundColor: car.color }}></div>
                        <input
                            type="color"
                            value={car.color}
                            onChange={handleInputChange2}
                            style={{ width: '30px' }}
                        />
                        <button className='button marginRight' onClick={() => onHandleUpdate(car.id, inputValue1, inputValue2)}>Update</button>

                        <button onClick={() => onHandleDelete(car.id)}>Delete</button>
                    </div>
                    <div style={{ display: isRacing ? 'none' : 'block' }}>
                        <button className='button marginRight' disabled={carRaceState[car.id]?.animating || false} onClick={() => onHandleStart(car.id)}>Start</button>
                        <button disabled={!carRaceState[car.id]} onClick={() => onHandleStop(car.id)}>Stop</button>
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
                                    transition: `transform ${(carRaceState[car.id]?.velocity || 0) * 0.1}s linear`, // made animation time 10 perscent of velocity
                                    transform: `translateX(${carRaceState[car.id]?.transValue || 0}px)`
                                }}
                            />
                        </div>

                    </div>
                </div >
            ))}
        </div>
    );
};

export default CarsList