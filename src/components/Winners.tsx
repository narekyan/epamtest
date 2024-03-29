import React, { useState, useEffect } from 'react';


const Winners: React.FC = () => {
    const [winners, setWinners] = useState<any[]>([]); // State to store cars


    const postWinner = async (winner: { id: number; wins: number; time: number }) => {
        await fetch('http://localhost:3000/winner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winner),
        });
    }


    return (
        <div>
            <h2>Winners</h2>
            <p>This is the Winners view.</p>
        </div>
    );
};

export default Winners;