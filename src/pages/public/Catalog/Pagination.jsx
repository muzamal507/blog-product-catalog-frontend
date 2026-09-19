import React from 'react'

function Pagination({ meta, page, setPage }) {

    if (!meta || meta.last_page <= 1) {
        return null
    }

    const handlePageChange = (newPage) => {
        setPage(newPage), window.scrollTo(0, 0)
    }

    const pages = Array.from(
        { length: meta.last_page }, 
        (_, i) => i + 1
    ).filter(
        (p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1
    )

    return (
        <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap gap-3">

            {/* Result Info */}
            <small className="text-muted">
                Showing {meta.from}–{meta.to} of {meta.total} products
            </small>

            {/* Pagination */}
            <div className="d-flex gap-2 flex-wrap">

                {/* Previous */}
                <button className="btn btn-sm btn-outline-secondary"
                    disabled={page === 1} onClick={() => handlePageChange(page - 1)} >
                    ‹ Prev
                </button>

                {pages.map((p, idx) => (
                    <React.Fragment key={p}>
                        {idx > 0 && pages[idx - 1] !== p - 1 && (
                            <span className="btn btn-sm disabled"> … </span>
                        )}

                        <button className={`btn btn-sm ${
                              p === page ? 'text-white' : 'btn-outline-secondary'
                            }`}
                            style={
                              p === page ? { 
                                  background: '#00b894',
                                  border: 'none',
                                } : {}
                            }
                            onClick={() => handlePageChange(p)}
                        >
                            {p}
                        </button>
                    </React.Fragment>
                ))}

                {/* Next */}
                <button className="btn btn-sm btn-outline-secondary"
                    disabled={page === meta.last_page} onClick={() => handlePageChange(page + 1)} >
                    Next ›
                </button>
            </div>
        </div>
    )
}

export default Pagination