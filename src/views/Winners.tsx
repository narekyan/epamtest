import React, { useState, useEffect, useContext } from 'react';
import { useAppContext } from '../state/AppProvider';
import Pagination from '../components/pagination';
import WinnersList from '../components/winnerList';
import { useWinnersNetwork } from '../components/winnersNetwork';

const Winners: React.FC = () => {
    const { sharedData, setSharedData } = useAppContext();
    const [viewName, setViewName] = useState<string>('Garage');
    const { winnersNetwork } = useWinnersNetwork()

    const handleNextPage = () => {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            pageNumberWinner: prevSharedData.pageNumberWinner + 1,
        }));
    };

    const handlePrevPage = () => {
        setSharedData((prevSharedData) => ({
            ...prevSharedData,
            pageNumberWinner: Math.max(prevSharedData.pageNumberWinner - 1, 1),
        }));
    };

    useEffect(() => {
        if (sharedData.winner !== 0) {

            winnersNetwork.postWinner({ id: sharedData.winner, wins: 1, time: 10 });
            setSharedData((prevSharedData) => ({
                ...prevSharedData,
                winner: 0
            }));
        }
    }, []);

    useEffect(() => {
        winnersNetwork.fetchWinnersForPage(sharedData.pageNumberWinner);
    }, [sharedData.pageNumberWinner]);

    return (
        <div>
            <h2>{viewName}</h2>
            <WinnersList winners={winnersNetwork.winners} />
            <Pagination
                pageNumberWinner={sharedData.pageNumberWinner}
                totalItems={winnersNetwork.totalWinners}
                pageSize={winnersNetwork.pageSize}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
            />
        </div>
    );
};

export default Winners;
