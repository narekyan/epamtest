import React, { useState, useEffect } from 'react';
import { useAppContext } from '../state/AppProvider';
import { useServiceContext } from '../services/ApiService';

const Winners: React.FC = () => {
    const { sharedData, setSharedData } = useAppContext();
    const { apiService } = useServiceContext();

    const [winners, setWinners] = useState<any[]>([]);
    const [viewName, setViewName] = useState<string>('Garage');
    const [totalWinners, setTotalWinners] = useState<number>(0);
    const [pageSize] = useState(7);

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


    const fetchWinnersForPage = async (page: number) => {
        const { data, headers } = await apiService.fetchData(`/winners?_page=${page}&_limit=${pageSize}`)

        if (data) {
            setWinners(data);
            setTotalWinners(parseInt(headers.get('X-Total-Count') || '0'));
        }

    };

    const postWinner = async (winner: { id: number; wins: number; time: number }) => {
        await apiService.postData(`winner`, JSON.stringify(winner))
    }


    useEffect(() => {
        if (sharedData.winner != 0) {
            postWinner({ id: sharedData.winner, wins: 1, time: 10 });
        }
    }, [])

    useEffect(() => {
        fetchWinnersForPage(sharedData.pageNumberWinner);

    }, [sharedData.pageNumberWinner]);

    const renderWinners = () => {
        return winners.map((winner: any, index: number) => (
            <div key={index} className="winner" >

                <div className='winner-cont'>
                    <div id={`winner${winner.id}`} className="winner-container" style={{ paddingTop: '3px', paddingLeft: '2px' }}>
                        {winner.id}
                    </div>

                </div>
            </div >
        ));
    };

    return (
        <div>
            <h2>{viewName}</h2>
            <div className="winners-list">{renderWinners()}</div>
            {/* pagination */}
            <div>
                <button className='button margin-right' onClick={handlePrevPage} disabled={sharedData.pageNumberWinner === 1}>
                    Previous
                </button>
                {sharedData.pageNumberWinner}
                <button className='button margin-left' onClick={handleNextPage} disabled={sharedData.pageNumberWinner * pageSize >= totalWinners}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Winners;