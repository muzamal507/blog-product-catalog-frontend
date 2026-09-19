import React from 'react'

function Filters({
    categories, brands, categoryId, setCategoryId, brandId, setBrandId, minPrice,
    setMinPrice, maxPrice, setMaxPrice, isFeatured, setIsFeatured, isNew,
    setIsNew, hasFilters, clearFilters }) {
    return (
        <div>

            {/* Categories */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{fontSize: 14, color: '#1a1a2e'}} >
                    📂 Categories
                </h6>
                <div className="d-flex flex-column gap-1">
                    {/* All Categories */}
                    <button className="btn btn-sm text-start px-2 py-1"
                        style={{borderRadius: 6, fontSize: 13,
                            background: !categoryId ? '#00b89415' : 'transparent',
                            color: !categoryId ? '#00b894' : '#374151',
                            border: 'none', fontWeight: !categoryId ? 600 : 400,
                        }}
                        onClick={() => setCategoryId('')}
                    >
                        All Categories
                    </button>

                    {/* Categories */}
                    {categories.filter((c) => !c.parent_id).map((cat) => (
                        <div key={cat.id}>
                            <button className="btn btn-sm text-start w-100 px-2 py-1"
                              style={{borderRadius: 6, fontSize: 13,
                                background: categoryId ===
                                    String(cat.id) ? '#00b89415' : 'transparent',
                                color: categoryId ===
                                    String(cat.id) ? '#00b894' : '#374151',
                                border: 'none',
                                fontWeight: categoryId ===
                                    String(cat.id) ? 600 : 400,
                              }}
                              onClick={() =>setCategoryId(
                                categoryId ===
                                        String(cat.id) ? '' : String(cat.id)
                                )}
                            >
                                {cat.name}
                            </button>

                            {/* Subcategories */}
                            {categories.filter(
                                    (c) => c.parent_id === cat.id
                                ).map((sub) => (
                                    <button key={sub.id} className="btn btn-sm text-start w-100 px-3 py-1"
                                      style={{borderRadius: 6, fontSize: 12,
                                          background: categoryId ===
                                              String(sub.id) ? '#00b89415' : 'transparent',
                                          color: categoryId ===
                                              String(sub.id) ? '#00b894' : '#6b7280',
                                          border: 'none',
                                          fontWeight:categoryId === 
                                              String(sub.id) ? 600 : 400,
                                      }}
                                      onClick={() =>setCategoryId(
                                          categoryId === String(sub.id) ? '' : String(sub.id)
                                        )}
                                    >
                                        ↳ {sub.name}
                                    </button>
                                ))}
                        </div>
                      ))}
                </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{fontSize: 14, color: '#1a1a2e'}} >
                    🏷️ Brands
                </h6>

                <div className="d-flex flex-column gap-1">
                  <button className="btn btn-sm text-start px-2 py-1"
                    style={{borderRadius: 6, fontSize: 13,
                        background: !brandId ? '#00b89415' : 'transparent',
                        color: !brandId ? '#00b894' : '#374151',
                        border: 'none', fontWeight: !brandId ? 600 : 400,
                    }}
                    onClick={() => setBrandId('')}
                  >
                    All Brands
                  </button>

                  {brands.map((brand) => (
                      <button key={brand.id} className="btn btn-sm text-start w-100 px-2 py-1"
                        style={{ borderRadius: 6, fontSize: 13,
                          background: brandId === String(brand.id) ? '#00b89415' : 'transparent',
                          color: brandId === String(brand.id) ? '#00b894' : '#374151',
                          border: 'none', 
                          fontWeight: brandId === String(brand.id) ? 600 : 400}}
                        onClick={() =>setBrandId(
                            brandId === String(brand.id) ? '' : String(brand.id)
                          )
                        }
                      >
                          {brand.name}
                      </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{fontSize: 14, color: '#1a1a2e'}} >
                  💰 Price Range
              </h6>
              <div className="row g-2">
                <div className="col-6">
                  <input type="number" className="form-control form-control-sm"
                    placeholder="Min $" min={0} value={minPrice}
                    onChange={(e) =>setMinPrice(e.target.value)} />
                </div>
                <div className="col-6">
                  <input type="number" className="form-control form-control-sm"
                    placeholder="Max $" min={0} value={maxPrice}
                    onChange={(e) =>setMaxPrice(e.target.value)} />
                </div>
              </div>

              {/* Quick Price Ranges */}
              <div className="d-flex flex-wrap gap-1 mt-2">
                {[
                  ['Under $100', '', '100'],
                  ['$100–$500', '100', '500'],
                  ['$500–$1000', '500', '1000'],
                  ['Over $1000', '1000', ''],
                ].map(([label, min, max]) => {

                  const active = minPrice === min && maxPrice === max

                  return (
                    <button key={label} className="btn btn-sm"
                      style={{fontSize: 11, borderRadius: 20,
                        background: active ? '#00b894' : '#f3f4f6',
                        color: active ? '#fff' : '#374151',
                        border: 'none'}}
                      onClick={() => {
                        if (active) {
                          setMinPrice(''), setMaxPrice('')
                        } else {
                            setMinPrice(min), setMaxPrice(max)
                        }
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Special Filters */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{fontSize: 14, color: '#1a1a2e'}} >
                    ✨ Special
                </h6>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="featured"
                      checked={isFeatured} onChange={(e) =>setIsFeatured(e.target.checked)} />
                    <label className="form-check-label" htmlFor="featured" style={{ fontSize: 13 }} >
                      ⭐ Featured Only
                    </label>
                  </div>

                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="new_arr"
                          checked={isNew} onChange={(e) =>setIsNew(e.target.checked)} />

                      <label className="form-check-label" htmlFor="new_arr" style={{ fontSize: 13 }} >
                          🆕 New Arrivals
                      </label>
                  </div>
                </div>
            </div>

            {/* Clear */}
            {hasFilters && (
                <button onClick={clearFilters} className="btn btn-outline-danger btn-sm w-100" >
                    ✕ Clear All Filters
                </button>
            )}
        </div>
    )
}

export default Filters