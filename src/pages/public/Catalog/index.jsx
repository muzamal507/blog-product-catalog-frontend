import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import productService from '../../../services/productService'
import productCategoryService from '../../../services/productCategoryService'
import brandService from '../../../services/brandService'

import Filters from './Filters'
import ProductGrid from './ProductGrid'
import Pagination from './Pagination'


function ProductSkeleton() {
    return (
        <div className="card border h-100"
            style={{borderRadius: 10, borderColor: '#eef0f4'}} >
            <div style={{aspectRatio: '4/3', background: '#f0f0f0',
                    borderRadius: '10px 10px 0 0', animation: 'skeleton 1.5s infinite' }} />

            <div className="card-body p-3">
                <div style={{height: 10, background: '#f0f0f0', borderRadius: 4,
                        width: '40%', marginBottom: 8 }} />

                <div style={{height: 14, background: '#f0f0f0', borderRadius: 4, marginBottom: 6}} />
                <div style={{height: 14, background: '#f0f0f0', borderRadius: 4,
                        width: '70%', marginBottom: 16}} />
                <div style={{ height: 22, background: '#f0f0f0', borderRadius: 4,
                        width: '40%', marginBottom: 12 }} />
                <div style={{height: 36, background: '#f0f0f0', borderRadius: 6}} />
            </div>

            <style>{`
                @keyframes skeleton {0%,100% { opacity: 1 } 50% { opacity: .5 }}
            `}</style>
        </div>
    )
}

function Catalog() {

    const [searchParams, setSearchParams] = useSearchParams()

    // FILTER STATES
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')

    const [brandId, setBrandId] = useState(searchParams.get('brand_id') || '')
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default')

    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')

    const [isFeatured, setIsFeatured] = useState(searchParams.get('is_featured') === '1')
    const [isNew, setIsNew] = useState(searchParams.get('is_new') === '1')

    const [page, setPage] = useState(1)

    // DATA STATES
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const [meta, setMeta] = useState(null)
    const [categories, setCategories] = useState([])

    const [brands, setBrands] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // LOAD CATEGORIES + BRANDS
    useEffect(() => {
        productCategoryService.getAll({ all: true }).then((res) => {
                setCategories(res.data.data?.data || res.data.data || [])
            }).catch(() => {})

        brandService.getAll({ all: true }).then((res) => {
                setBrands(res.data.data?.data || res.data.data || [])
            }).catch(() => {})
    }, [])

    // FETCH PRODUCTS
    const fetchProducts = useCallback(() => {
        setLoading(true)
        const params = {
            per_page: 12, page, ...(search ? { search } : {}),

            ...(categoryId ? {product_category_id: categoryId} : {}),
            ...(brandId ? {brand_id: brandId} : {}),
            ...(sortBy ? {sort: sortBy} : {}),
            ...(minPrice ? {min_price: minPrice} : {}),
            ...(maxPrice ? {max_price: maxPrice} : {}),
            ...(isFeatured ? {is_featured: 1} : {}),
            ...(isNew ? {is_new: 1} : {}),
        }

        productService.getAll(params).then((res) => {
                setProducts(
                    res.data.data?.data || []
                )
                setMeta(
                    res.data.data?.meta || null
                )
            }).catch(() => {})
            .finally(() => {
                setLoading(false)
            })

    }, [
        search,
        categoryId,
        brandId,
        sortBy,
        minPrice,
        maxPrice,
        isFeatured,
        isNew,
        page,
    ])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // RESET PAGE WHEN FILTER CHANGES
    useEffect(() => {
        setPage(1)
    }, [
        search,
        categoryId,
        brandId,
        sortBy,
        minPrice,
        maxPrice,
        isFeatured,
        isNew,
    ])

    // SYNC URL
    useEffect(() => {
        const params = {}
        if (search)
            params.search = search
        if (categoryId)
            params.category_id = categoryId
        if (brandId)
            params.brand_id = brandId
        if (sortBy !== 'default')
            params.sort = sortBy
        if (minPrice)
            params.min_price = minPrice
        if (maxPrice)
            params.max_price = maxPrice
        if (isFeatured)
            params.is_featured = '1'
        if (isNew)
            params.is_new = '1'
        setSearchParams(params)
    }, [
        search,
        categoryId,
        brandId,
        sortBy,
        minPrice,
        maxPrice,
        isFeatured,
        isNew,
    ])

    // CLEAR FILTERS
    const clearFilters = () => {
        setSearch('')
        setCategoryId('')
        setBrandId('')
        setSortBy('default')
        setMinPrice('')
        setMaxPrice('')
        setIsFeatured(false)
        setIsNew(false)
    }

    // FILTER STATUS
    const hasFilters = search || categoryId || brandId || sortBy !== 'default' ||
                        minPrice || maxPrice || isFeatured || isNew

    // ACTIVE CATEGORY / BRAND
    const activeCategory = categories.find(
            (c) => c.id === parseInt(categoryId)
        )

    const activeBrand = brands.find(
            (b) => b.id === parseInt(brandId)
        )

    // RETURN
    return (
        <div>

            {/* ================= HERO ================= */}
            <div className="py-4 py-md-5 text-center"
                style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f2d40)'}} >
                <small className="fw-bold text-uppercase"
                    style={{color: '#00b894', letterSpacing: 2, fontSize: 11}} >
                    CATALOG INVENTORY
                </small>
                <h1 className="fw-bold text-white mt-2 mb-2"
                    style={{fontSize: 'clamp(22px,4vw,38px)'}} >
                    {activeCategory ? activeCategory.name : activeBrand
                        ? activeBrand.name : 'All Products'}
                </h1>

                {meta && (
                    <small style={{color: '#8fa3b8'}} >
                        {meta.total} products found
                    </small>
                )}
            </div>

            {/* ================= CONTENT ================= */}
            <div className="container-fluid px-3 px-md-4 py-4 py-md-5">
                <div className="row g-4">

                    {/* ================= DESKTOP FILTER ================= */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="card border-0 shadow-sm p-4 sticky-top"
                            style={{borderRadius: 12, top: 80}} >
                            <Filters 
                                categories={categories}
                                brands={brands}

                                categoryId={categoryId}
                                setCategoryId={setCategoryId}

                                brandId={brandId}
                                setBrandId={setBrandId}

                                minPrice={minPrice}
                                setMinPrice={setMinPrice}

                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}

                                isFeatured={isFeatured}
                                setIsFeatured={setIsFeatured}

                                isNew={isNew}
                                setIsNew={setIsNew}

                                hasFilters={hasFilters}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* ================= MAIN ================= */}
                    <div className="col-12 col-lg-9">

                        {/* TOP BAR */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                            {/* Search */}
                            <div className="input-group" style={{maxWidth: 320}} >
                                <span className="input-group-text bg-light border-end-0">
                                    🔍
                                </span>
                                <input type="text" className="form-control border-start-0 bg-light"
                                    placeholder="Search products..." value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                                {search && (
                                    <button className="input-group-text bg-light border-start-0"
                                        onClick={() => setSearch('')} >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="d-flex align-items-center gap-2 ms-auto">

                                {/* Sort */}
                                <select className="form-select form-select-sm" style={{ width: 160 }}
                                    value={sortBy} onChange={(e) => setSortBy(e.target.value)} >
                                    <option value="default">Default</option>
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low → High</option>
                                    <option value="price_desc">Price: High → Low</option>
                                </select>

                                {/* Mobile Filter */}
                                <button className="btn btn-outline-secondary btn-sm d-lg-none"
                                    onClick={() => setSidebarOpen(true)} >
                                    🔧 Filters
                                    {hasFilters && (
                                        <span className="badge ms-1"
                                            style={{background: '#00b894', fontSize: 10}} >
                                            !
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ================= FILTER CHIPS ================= */}
                        {hasFilters && (
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {search && (
                                    <FilterChip text={`🔍 "${search}"`}
                                        onRemove={() => setSearch('')} />
                                )}
                                {activeCategory && (
                                    <FilterChip text={`📂 ${activeCategory.name}`}
                                        onRemove={() => setCategoryId('')} />
                                )}
                                {activeBrand && (
                                    <FilterChip text={`🏷️ ${activeBrand.name}`}
                                        onRemove={() => setBrandId('')} />
                                )}
                                {(minPrice || maxPrice) && (
                                    <FilterChip text={`💰 $${minPrice || '0'} – $${maxPrice || '∞'}`}
                                        onRemove={() => {setMinPrice(''), setMaxPrice('')}}
                                    />
                                )}

                                {isFeatured && (
                                    <FilterChip text="⭐ Featured"
                                        onRemove={() => setIsFeatured(false)} />
                                )}

                                {isNew && (
                                    <FilterChip text="🆕 New Arrivals"
                                        onRemove={() =>setIsNew(false)} />
                                )}

                                <button onClick={clearFilters} className="badge border-0 px-3 py-2"
                                    style={{background: '#fee2e2', color: '#dc2626',
                                        fontSize: 12, cursor: 'pointer'}} >
                                    ✕ Clear All
                                </button>
                            </div>
                        )}

                        {/* ================= PRODUCTS ================= */}
                        {loading ? (
                            <div className="row g-3">
                                {[
                                    1, 2, 3, 4,
                                    5, 6, 7, 8,
                                    9, 10, 11, 12,
                                ].map((i) => (
                                    <div className="col-6 col-md-4 col-xl-3" key={i} >
                                        <ProductSkeleton />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-5">
                                <div style={{fontSize: 64}} >
                                    📦
                                </div>
                                <h5 className="fw-bold mt-3 mb-2">No products found</h5>
                                <p className="text-muted mb-4">
                                    Try adjusting your filters or search term.
                                </p>

                                <button onClick={clearFilters} className="btn text-white px-4"
                                    style={{background: '#00b894', borderRadius: 8}} >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <ProductGrid products={products} />
                                <Pagination meta={meta} page={page} setPage={setPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= MOBILE FILTER DRAWER ================= */}
            {sidebarOpen && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100"
                        style={{background: 'rgba(0,0,0,.5)', zIndex: 1040}}
                        onClick={() =>setSidebarOpen(false)}
                    />
                    <div className="position-fixed top-0 start-0 h-100 bg-white"
                        style={{width: 300, zIndex: 1050, overflowY: 'auto',
                            padding: '24px 20px', boxShadow: '4px 0 20px rgba(0,0,0,.15)'}}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold mb-0">Filters</h6>
                            <button className="btn btn-sm btn-outline-secondary"
                                onClick={() =>setSidebarOpen(false)} >
                                ✕
                            </button>
                        </div>

                        <Filters
                            categories={categories}
                            brands={brands}

                            categoryId={categoryId}
                            setCategoryId={setCategoryId}

                            brandId={brandId}
                            setBrandId={setBrandId}

                            minPrice={minPrice}
                            setMinPrice={setMinPrice}

                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}

                            isFeatured={isFeatured}
                            setIsFeatured={setIsFeatured}

                            isNew={isNew}
                            setIsNew={setIsNew}

                            hasFilters={hasFilters}
                            clearFilters={clearFilters}
                        />

                        <button className="btn text-white w-100 mt-3 fw-semibold"
                            style={{background: '#00b894', borderRadius: 8}}
                            onClick={() =>setSidebarOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

/**
 * Reusable Filter Chip
 */
function FilterChip({ text, onRemove }) {

    return (
        <span className="badge d-flex align-items-center gap-1 px-3 py-2"
            style={{background: '#00b89420', color: '#00b894', fontSize: 12}} >
            {text}

            <button onClick={onRemove}
                style={{background: 'none', border: 'none', color: '#00b894', cursor: 'pointer',
                    padding: 0, lineHeight: 1}} >
                ✕
            </button>
        </span>
    )
}

export default Catalog