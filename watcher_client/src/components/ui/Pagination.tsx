import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  return (
    <div className="pagination-controls">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => onPageChange(1)}
        disabled={!canGoPrevious}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
        Previous
      </button>

      <div className="page-info">
        {totalItems ? (
          <span>
            Showing {startItem}-{endItem} of {totalItems}
          </span>
        ) : (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      <input
        type="number"
        className="page-input form-control"
        value={currentPage}
        onChange={(e) => {
          const page = parseInt(e.target.value);
          if (page >= 1 && page <= totalPages) {
            onPageChange(page);
          }
        }}
        min={1}
        max={totalPages}
      />

      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Next
        <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
      </button>

      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => onPageChange(totalPages)}
        disabled={!canGoNext}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
}
