import React, { useState, useEffect } from 'react';


const Winners: React.FC = () => {
    const [winners, setWinners] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewName, setViewName] = useState<string>('Garage');
    const [totalWinners, setTotalWinners] = useState<number>(0);
    const [pageSize] = useState(7);

    const fetchWinnersForPage = async (page: number) => {
        const response = await fetch(`http://localhost:3000/winners?_page=${page}&_limit=7`);
        const data = await response.json();
        setTotalWinners(getTotalWinners(response));
        if (data) {
            setWinners(data);
        }

    };

    const postWinner = async (winner: { id: number; wins: number; time: number }) => {
        await fetch('http://localhost:3000/winner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winner),
        });
    }

    const getTotalWinners = (response: Response) => {
        const totalCountHeader = response.headers.get('X-Total-Count');
        return totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };


    const renderWinners = () => {
        return winners.map((winner: any, index: number) => (
            <div key={index} className="winner" style={{ marginBottom: '10px' }}>

                <div className='winner-cont' style={{ width: '100%' }}>
                    <div id={`winner${winner.id}`} className="winner-container" style={{ paddingTop: '3px', paddingLeft: '2px' }}>
                        {winner.id}
                    </div>

                </div>
            </div >
        ));
    };

    useEffect(() => {
        fetchWinnersForPage(currentPage);

        postWinner({ id: 2, wins: 1, time: 10 });


    }, [currentPage]);



    return (
        <div>
            <h2>Winners</h2>
            <div className="winners-list">{renderWinners()}</div>
            <div>
                <button style={{ marginRight: '5px' }} onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                {currentPage}
                <button style={{ marginLeft: '5px' }} onClick={handleNextPage} disabled={currentPage * pageSize >= totalWinners}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Winners;