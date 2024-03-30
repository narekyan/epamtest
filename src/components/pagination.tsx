import React, { useState, useEffect } from 'react';

const Pagination: React.FC<{
    pageNumberWinner: number;
    totalItems: number;
    pageSize: number;
    onNextPage: () => void;
    onPrevPage: () => void;
}> = ({ pageNumberWinner, totalItems, pageSize, onNextPage, onPrevPage }) => {
    return (
        <div>
            <button onClick={onPrevPage} disabled={pageNumberWinner === 1}>
                Previous
            </button>
            {pageNumberWinner}
            <button onClick={onNextPage} disabled={pageNumberWinner * pageSize >= totalItems}>
                Next
            </button>
        </div>
    );
};

export default Pagination