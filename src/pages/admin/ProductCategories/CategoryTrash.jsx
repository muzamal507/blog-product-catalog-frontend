import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import productCategoryService from "../../../services/productCategoryService";

function ProductCategoryTrash() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const [restoreId, setRestoreId] = useState(null);
    const [restoring, setRestoring] = useState(false);

    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // =========================================
    // Fetch Trash Categories
    // =========================================

    const fetchTrashCategories = useCallback(() => {
        setLoading(true);

        productCategoryService
            .trashedList({
                search,
                page,
                per_page: 10,
            })
            .then((res) => {
                const d = res.data;

                setCategories(
                    d.data?.data || d.data || []
                );

                setMeta(
                    d.data?.meta ||
                    d.meta ||
                    null
                );
            })
            .catch((err) => {
                console.error("Trash list error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search, page]);

    useEffect(() => {
        fetchTrashCategories();
    }, [fetchTrashCategories]);

    // =========================================
    // Search
    // =========================================

    useEffect(() => {
        setPage(1);
    }, [search]);

    // =========================================
    // Restore
    // =========================================

    const handleRestore = async () => {
        setRestoring(true);

        try {
            await productCategoryService.restore(restoreId);

            setRestoreId(null);

            fetchTrashCategories();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Cannot restore category."
            );
        } finally {
            setRestoring(false);
        }
    };

    // =========================================
    // Permanent Delete
    // =========================================

    const handleForceDelete = async () => {
        setDeleting(true);

        try {
            await productCategoryService.forceDelete(deleteId);

            setDeleteId(null);

            fetchTrashCategories();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Cannot permanently delete category."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================
    // Date
    // =========================================

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div>

            {/* =========================================
                Header
            ========================================= */}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                <div>

                    <h4 className="fw-bold mb-1">
                        Category Trash
                    </h4>

                    <small className="text-muted">
                        Manage deleted product categories
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <Link
                        to="/admin/product-categories"
                        className="btn btn-outline-secondary btn-sm"
                    >
                        ← Categories
                    </Link>

                    <span
                        className="btn text-white fw-semibold px-3"
                        style={{
                            background: "#e74c3c",
                            borderRadius: 8,
                        }}
                    >
                        🗑 Trash
                    </span>

                </div>

            </div>


            {/* =========================================
                Search Filter
            ========================================= */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: 12 }}
            >

                <div className="p-3 d-flex flex-wrap gap-2">

                    <div
                        className="input-group"
                        style={{ maxWidth: 300 }}
                    >

                        <span className="input-group-text bg-light border-end-0">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="form-control border-start-0 bg-light"
                            placeholder="Search deleted categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {search && (
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setSearch("")}
                        >
                            ✕ Clear
                        </button>
                    )}

                </div>

            </div>


            {/* =========================================
                Table
            ========================================= */}

            <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: 12 }}
            >

                <div className="table-responsive">

                    <table
                        className="table table-hover align-middle mb-0"
                        style={{ fontSize: 14 }}
                    >

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Parent
                                </th>

                                <th>
                                    Products
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Deleted At
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {/* Loading */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="text-center py-5"
                                    >

                                        <div
                                            className="spinner-border"
                                            style={{
                                                color: "#00b894",
                                            }}
                                        />

                                    </td>

                                </tr>

                            ) : categories.length === 0 ? (

                                /* Empty */

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="text-center py-5 text-muted"
                                    >

                                        <div
                                            style={{
                                                fontSize: 40,
                                            }}
                                        >
                                            🗑
                                        </div>

                                        <p className="mt-2 mb-0">
                                            Trash is empty.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                /* Data */

                                categories.map((cat, i) => (

                                    <tr key={cat.id}>

                                        {/* # */}

                                        <td
                                            className="text-muted"
                                            style={{
                                                fontSize: 12,
                                            }}
                                        >
                                            {((page - 1) * 10) +
                                                i +
                                                1}
                                        </td>


                                        {/* Category */}

                                        <td>

                                            <div className="d-flex align-items-center gap-3">

                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 8,
                                                        overflow: "hidden",
                                                        background: "#f3f4f6",
                                                        flexShrink: 0,
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >

                                                    {cat.image_url ? (

                                                        <img
                                                            src={
                                                                cat.image_url
                                                            }
                                                            alt={
                                                                cat.name
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit:
                                                                    "cover",
                                                                filter:
                                                                    "grayscale(40%)",
                                                            }}
                                                        />

                                                    ) : (

                                                        <span
                                                            style={{
                                                                fontSize: 18,
                                                            }}
                                                        >
                                                            📂
                                                        </span>

                                                    )}

                                                </div>


                                                <div>

                                                    <div className="fw-semibold">
                                                        {cat.name}
                                                    </div>

                                                    <small className="text-muted">
                                                        {cat.slug}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Parent */}

                                        <td>

                                            {cat.parent ? (

                                                <span
                                                    className="badge px-2 py-1"
                                                    style={{
                                                        background:
                                                            "#f3f4f6",
                                                        color:
                                                            "#374151",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    ↳{" "}
                                                    {
                                                        cat.parent
                                                            .name
                                                    }
                                                </span>

                                            ) : (

                                                <span
                                                    className="badge px-2 py-1"
                                                    style={{
                                                        background:
                                                            "#dbeafe",
                                                        color:
                                                            "#1d4ed8",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    Root
                                                </span>

                                            )}

                                        </td>


                                        {/* Products */}

                                        <td>

                                            <span className="badge bg-light text-dark border">

                                                {cat.products_count ??
                                                    0}

                                            </span>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span
                                                className="badge"
                                                style={{
                                                    background:
                                                        "#fee2e2",
                                                    color:
                                                        "#b91c1c",
                                                    fontSize: 11,
                                                }}
                                            >
                                                Deleted
                                            </span>

                                        </td>


                                        {/* Deleted At */}

                                        <td>

                                            <small className="text-muted">
                                                {formatDate(
                                                    cat.deleted_at
                                                )}
                                            </small>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="d-flex gap-1">

                                                {/* Restore */}

                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    title="Restore"
                                                    onClick={() =>
                                                        setRestoreId(
                                                            cat.id
                                                        )
                                                    }
                                                >
                                                    ♻️
                                                </button>


                                                {/* Permanent Delete */}

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Permanent Delete"
                                                    onClick={() =>
                                                        setDeleteId(
                                                            cat.id
                                                        )
                                                    }
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    Pagination
                ========================================= */}

                {meta && meta.last_page > 1 && (

                    <div className="p-3 d-flex justify-content-between align-items-center border-top">

                        <small className="text-muted">

                            Showing {meta.from}–{meta.to} of{" "}
                            {meta.total}

                        </small>


                        <div className="d-flex gap-1">

                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(
                                        (p) => p - 1
                                    )
                                }
                            >
                                ‹
                            </button>


                            {Array.from(
                                {
                                    length:
                                        meta.last_page,
                                },
                                (_, i) => i + 1
                            )
                                .filter(
                                    (p) =>
                                        p === 1 ||
                                        p ===
                                            meta.last_page ||
                                        Math.abs(
                                            p - page
                                        ) <= 1
                                )
                                .map(
                                    (
                                        p,
                                        idx,
                                        arr
                                    ) => (

                                        <React.Fragment
                                            key={p}
                                        >

                                            {idx > 0 &&
                                                arr[
                                                    idx -
                                                        1
                                                ] !==
                                                    p -
                                                        1 && (

                                                    <span className="btn btn-sm btn-outline-secondary disabled">
                                                        …
                                                    </span>

                                                )}


                                            <button
                                                className={`btn btn-sm ${
                                                    p ===
                                                    page
                                                        ? "text-white"
                                                        : "btn-outline-secondary"
                                                }`}
                                                style={
                                                    p ===
                                                    page
                                                        ? {
                                                              background:
                                                                  "#00b894",
                                                              border:
                                                                  "none",
                                                          }
                                                        : {}
                                                }
                                                onClick={() =>
                                                    setPage(
                                                        p
                                                    )
                                                }
                                            >
                                                {p}
                                            </button>

                                        </React.Fragment>

                                    )
                                )}


                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={
                                    page ===
                                    meta.last_page
                                }
                                onClick={() =>
                                    setPage(
                                        (p) => p + 1
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================================
                Restore Modal
            ========================================= */}

            {restoreId && (

                <div
                    className="modal d-block"
                    style={{
                        background:
                            "rgba(0,0,0,.5)",
                        zIndex: 9999,
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div
                            className="modal-content border-0"
                            style={{
                                borderRadius: 12,
                            }}
                        >

                            <div className="modal-body text-center p-5">

                                <div
                                    style={{
                                        fontSize: 52,
                                    }}
                                >
                                    ♻️
                                </div>

                                <h5 className="fw-bold mt-3 mb-2">
                                    Restore this category?
                                </h5>

                                <p className="text-muted mb-4">
                                    The category will be restored
                                    and become available again.
                                </p>


                                <div className="d-flex gap-3 justify-content-center">

                                    <button
                                        className="btn btn-light px-4"
                                        onClick={() =>
                                            setRestoreId(
                                                null
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="btn btn-success px-4"
                                        disabled={restoring}
                                        onClick={
                                            handleRestore
                                        }
                                    >

                                        {restoring && (
                                            <span className="spinner-border spinner-border-sm me-2" />
                                        )}

                                        Restore

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================================
                Permanent Delete Modal
            ========================================= */}

            {deleteId && (

                <div
                    className="modal d-block"
                    style={{
                        background:
                            "rgba(0,0,0,.5)",
                        zIndex: 9999,
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div
                            className="modal-content border-0"
                            style={{
                                borderRadius: 12,
                            }}
                        >

                            <div className="modal-body text-center p-5">

                                <div
                                    style={{
                                        fontSize: 52,
                                    }}
                                >
                                    ⚠️
                                </div>

                                <h5 className="fw-bold mt-3 mb-2">
                                    Permanently delete?
                                </h5>

                                <p className="text-muted mb-4">
                                    This category will be
                                    permanently deleted and
                                    cannot be restored.
                                </p>


                                <div className="d-flex gap-3 justify-content-center">

                                    <button
                                        className="btn btn-light px-4"
                                        onClick={() =>
                                            setDeleteId(
                                                null
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="btn btn-danger px-4"
                                        disabled={deleting}
                                        onClick={
                                            handleForceDelete
                                        }
                                    >

                                        {deleting && (
                                            <span className="spinner-border spinner-border-sm me-2" />
                                        )}

                                        Permanently Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ProductCategoryTrash;