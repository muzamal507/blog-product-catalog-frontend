import React, { useState, useEffect } from 'react'
import productCategoryService from '../../services/productCategoryService'
import useBrandsByCategory from '../../hooks/useBrandsByCategory'

function CategoryBrandSelect({ onCategoryChange, onBrandChange, defaultCategoryId, defaultBrandId }) {
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState(defaultCategoryId || '')
  const [selectedBrand, setSelectedBrand] = useState(defaultBrandId || '')

  // Fetch all active categories
  useEffect(() => {
    productCategoryService.getAll({ all: true, parent_only: false })
      .then(res => setCategories(res.data.data?.data || res.data.data || []))
      .catch(() => {})
      .finally(() => setCatLoading(false))
  }, [])

  // Dependent brands
  const { brands, loading: brandLoading } = useBrandsByCategory(selectedCat)

  // Reset brand when category changes
  const handleCategoryChange = (e) => {
    const catId = e.target.value
    setSelectedCat(catId)
    setSelectedBrand('')
    onCategoryChange?.(catId)
    onBrandChange?.('')
  }

  const handleBrandChange = (e) => {
    const brandId = e.target.value
    setSelectedBrand(brandId)
    onBrandChange?.(brandId)
  }

  return (
    <div className="row g-3">
      {/* Category Dropdown */}
      <div className="col-12 col-md-6">
        <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
          Category <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          value={selectedCat}
          onChange={handleCategoryChange}
          disabled={catLoading}
        >
          <option value="">
            {catLoading ? 'Loading categories...' : '— Select Category —'}
          </option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.parent ? `  ↳ ${cat.name}` : cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Dropdown — depends on category */}
      <div className="col-12 col-md-6">
        <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
          Brand
          {selectedCat && (
            <small className="text-muted ms-2" style={{ fontSize: 11 }}>
              (filtered by category)
            </small>
          )}
        </label>
        <select
          className="form-select"
          value={selectedBrand}
          onChange={handleBrandChange}
          disabled={!selectedCat || brandLoading}
        >
          <option value="">
            {!selectedCat
              ? '— Select category first —'
              : brandLoading
              ? 'Loading brands...'
              : brands.length === 0
              ? 'No brands in this category'
              : '— Select Brand —'}
          </option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
              {brand.category_products_count !== undefined &&
                ` (${brand.category_products_count} products)`}
            </option>
          ))}
        </select>

        {/* No brands warning */}
        {selectedCat && !brandLoading && brands.length === 0 && (
          <small className="text-warning d-block mt-1">
            ⚠ No brands found for this category.
          </small>
        )}
      </div>
    </div>
  )
}

export default CategoryBrandSelect