import React, { useState, useEffect } from 'react';


const WinnersList: React.FC<{ winners: any[] }> = ({ winners }) => {
    return (
        <div className="winners-list">
            {winners.map((winner: any, index: number) => (
                <div className="winner">
                    <div className='winner-cont'>
                        <div id={`winner${winner.id}`} className="winner-container">
                            {winner.id}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WinnersList