import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, OnPageChange, className}) => {
  // Generate page numbers, but limit to a range for scalability (e.g., 5 pages around current)
  const getPageRange = () => {
    const rangeSize = 5; // Show 5 page numbers at a time
    const halfRange = Math.floor(rangeSize / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, start + rangeSize - 1);

    // Adjust start if end is at totalPages
    start = Math.max(1, end - rangeSize + 1);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageRange();

  return (
    <div className={className}>
      <Button
        onClick={() => OnPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-prev-btn"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => OnPageChange(page)}
          disabled={page === currentPage}
          className={page === currentPage ? 'pagination-active' : 'pagination-btn'}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => OnPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-next-btn"
      >
        Next
      </Button>

      {/* Page Info */}
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;