import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {


    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={currentPage === i ? 'active' : ''}>
                    <button onClick={() => onPageChange(i)}>{i}</button>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="pagination">
            <ul>{renderPageNumbers()}</ul>

        </div>

    );
};

export default Pagination;