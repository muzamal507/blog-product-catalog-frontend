import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import productService from '../../../services/productService'
import { useCart } from '../../../context/CartContext'

import ImageGallery from './ImageGallery'
import ProductInfo from './ProductInfo'

// ==================== IMAGE GALLERY ====================

// ==================== VARIANT SELECTOR ====================
function VariantSelector({ variants, selected, onSelect }) {
  if (!variants?.length) return null

  // Group attributes
  const attrMap = {}
  variants.forEach(v => {
    v.attribute_values?.forEach(av => {
      if (!attrMap[av.attribute.name]) {
        attrMap[av.attribute.name] = {
          type:   av.attribute.type,
          values: []
        }
      }
      const exists = attrMap[av.attribute.name].values.find(x => x.id === av.id)
      if (!exists) attrMap[av.attribute.name].values.push(av)
    })
  })

  // Selected attribute values
  const selectedAvIds = selected?.attribute_values?.map(av => av.id) || []

  const handleAttrSelect = (attrName, avId) => {
    // Find variant that matches current selections + new avId
    const newSelectedIds = Object.keys(attrMap).map(name => {
      if (name === attrName) return avId
      return selectedAvIds.find(id =>
        attrMap[name].values.some(v => v.id === id)
      )
    }).filter(Boolean)

    const matched = variants.find(v => {
      const vIds = v.attribute_values?.map(av => av.id) || []
      return newSelectedIds.every(id => vIds.includes(id))
    })

    if (matched) onSelect(matched)
  }

  return (
    <div className="mb-4">
      {Object.entries(attrMap).map(([attrName, attr]) => (
        <div key={attrName} className="mb-3">
          <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>
            {attrName}
            {selected && (
              <span className="text-muted fw-normal ms-2">
                — {selected.attribute_values?.find(av =>
                  attr.values.some(v => v.id === av.id)
                )?.value}
              </span>
            )}
          </label>

          <div className="d-flex flex-wrap gap-2">
            {attr.values.map(av => {
              const isSelected = selectedAvIds.includes(av.id)

              // Check if this value is available in any variant
              const available = variants.some(v =>
                v.attribute_values?.some(x => x.id === av.id) &&
                v.stock > 0
              )

              return attr.type === 'Color' ? (
                <button key={av.id} type="button"
                  title={av.value}
                  onClick={() => handleAttrSelect(attrName, av.id)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: av.color_code || '#e5e7eb',
                    border: isSelected
                      ? '3px solid #00b894'
                      : '3px solid transparent',
                    outline: isSelected ? '2px solid #00b894' : '2px solid #e5e7eb',
                    outlineOffset: 2,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.4,
                    transition: 'all 0.2s'
                  }} />
              ) : (
                <button key={av.id} type="button"
                  onClick={() => available && handleAttrSelect(attrName, av.id)}
                  style={{
                    padding: '6px 16px', borderRadius: 6,
                    background: isSelected ? '#1a1a2e' : '#f3f4f6',
                    color: isSelected ? '#fff' : '#374151',
                    border: isSelected ? '1.5px solid #1a1a2e' : '1.5px solid #e5e7eb',
                    fontSize: 13, fontWeight: isSelected ? 600 : 400,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.4,
                    transition: 'all 0.2s',
                    textDecoration: !available ? 'line-through' : 'none'
                  }}>
                  {av.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { addToCart, cartItems } = useCart()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [qty, setQty]               = useState(1)
  const [added, setAdded]           = useState(false)
  const [activeTab, setActiveTab]   = useState('description')

  useEffect(() => {
    setLoading(true)
    productService.getBySlug
      ? productService.getBySlug(id)
          .then(res => {
            const p = res.data.data
            setProduct(p)
            // Default variant
            if (p.has_variants && p.variants?.length) {
              const def = p.variants.find(v => v.is_default) || p.variants[0]
              setSelectedVariant(def)
            }
          })
          .catch(() => setNotFound(true))
          .finally(() => setLoading(false))
      : productService.adminList({ search: id, per_page: 1 })
          .then(res => {
            const p = res.data.data?.data?.[0]
            if (!p) { setNotFound(true); return }
            // Load full detail
            return productService.edit(p.id)
          })
          .then(res => {
            if (!res) return
            const p = res.data.data
            setProduct(p)
            if (p.has_variants && p.variants?.length) {
              const def = p.variants.find(v => v.is_default) || p.variants[0]
              setSelectedVariant(def)
            }
          })
          .catch(() => setNotFound(true))
          .finally(() => setLoading(false))
  }, [id])

  // Current price
  const currentPrice = product?.has_variants && selectedVariant
    ? selectedVariant.price
    : product?.price

  const currentCompare = product?.has_variants && selectedVariant
    ? selectedVariant.compare_price
    : product?.compare_price

  const currentStock = product?.has_variants && selectedVariant
    ? selectedVariant.stock
    : 99 // simple product

  const isOnSale = currentCompare && currentCompare > currentPrice
  const discountPct = isOnSale
    ? Math.round(((currentCompare - currentPrice) / currentCompare) * 100)
    : 0

  const inCart = cartItems.some(i =>
    i.id === product?.id &&
    (!product?.has_variants || i.variantId === selectedVariant?.id)
  )

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id:        product.id,
      name:      product.name,
      price:     currentPrice,
      sku:       selectedVariant?.sku || product.sku,
      image:     product.images?.[0]?.url || null,
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  // ==================== LOADING ====================
  if (loading) return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div style={{ aspectRatio: '1', background: '#f0f0f0', borderRadius: 12,
            animation: 'skeleton 1.5s infinite' }} />
          <style>{`@keyframes skeleton { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
        </div>
        <div className="col-12 col-md-6">
          {[200, 100, 60, 100, 150, 200].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 32 : 16, background: '#f0f0f0',
              borderRadius: 6, marginBottom: 16, width: `${w}px`,
              animation: 'skeleton 1.5s infinite' }} />
          ))}
        </div>
      </div>
    </div>
  )

  // ==================== NOT FOUND ====================
  if (notFound || !product) return (
    <div className="container text-center py-5">
      <div style={{ fontSize: 72 }}>📦</div>
      <h4 className="fw-bold mt-3 mb-2">Product Not Found</h4>
      <p className="text-muted mb-4">This product may have been removed or is unavailable.</p>
      <Link to="/catalog" className="btn text-white px-4"
        style={{ background: '#00b894', borderRadius: 8 }}>
        ← Back to Catalog
      </Link>
    </div>
  )

  // ==================== RENDER ====================
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-light py-2 px-3 px-md-4"
        style={{ borderBottom: '1px solid #eef0f4' }}>
        <nav style={{ fontSize: 13 }}>
          <Link to="/" style={{ color: '#6b7280' }}>Home</Link>
          <span className="mx-2 text-muted">/</span>
          <Link to="/catalog" style={{ color: '#6b7280' }}>Catalog</Link>
          {product.category && (
            <>
              <span className="mx-2 text-muted">/</span>
              <Link to={`/catalog?category_id=${product.category.id}`}
                style={{ color: '#6b7280' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-muted">/</span>
          <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{product.name}</span>
        </nav>
      </div>

      <div className="container py-4 py-md-5">
        <div className="row g-4 g-md-5">

          {/* ===== LEFT — Images ===== */}
          <div className="col-12 col-md-6">
            <ImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* ===== RIGHT — Info ===== */}
          <div className="col-12 col-md-6">

            {/* Brand + Badges */}
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              {product.brand && (
                <Link to={`/catalog?brand_id=${product.brand.id}`}
                  className="text-decoration-none fw-bold text-uppercase"
                  style={{ color: '#00b894', fontSize: 12, letterSpacing: 1.5 }}>
                  {product.brand.name}
                </Link>
              )}
              {product.is_new        && <span className="badge" style={{ background: '#3b82f6', fontSize: 10 }}>🆕 New</span>}
              {product.is_bestseller && <span className="badge" style={{ background: '#f59e0b', fontSize: 10 }}>🔥 Bestseller</span>}
              {product.is_featured   && <span className="badge" style={{ background: '#a855f7', fontSize: 10 }}>⭐ Featured</span>}
            </div>

            {/* Name */}
            <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(20px,3vw,28px)', color: '#1a1a2e' }}>
              {product.name}
            </h1>

            {/* SKU */}
            <div className="mb-3">
              <small className="text-muted">
                SKU: <code>{selectedVariant?.sku || product.sku}</code>
              </small>
              {product.model_number && (
                <small className="text-muted ms-3">
                  Model: <code>{product.model_number}</code>
                </small>
              )}
            </div>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-bold" style={{ fontSize: 32, color: '#1a1a2e' }}>
                ${currentPrice}
              </span>
              {isOnSale && (
                <>
                  <span className="text-muted text-decoration-line-through"
                    style={{ fontSize: 18 }}>
                    ${currentCompare}
                  </span>
                  <span className="badge px-2 py-1"
                    style={{ background: '#fee2e2', color: '#dc2626', fontSize: 13 }}>
                    -{discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-muted mb-4"
                style={{ fontSize: 14, lineHeight: 1.8,
                  paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                {product.short_description}
              </p>
            )}

            {/* Variant Selector */}
            {product.has_variants && (
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Stock */}
            <div className="mb-4">
              {currentStock > 0 ? (
                <div className="d-flex align-items-center gap-2">
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: currentStock <= 5 ? '#f59e0b' : '#059669',
                    display: 'inline-block'
                  }} />
                  <small style={{ color: currentStock <= 5 ? '#f59e0b' : '#059669', fontWeight: 600 }}>
                    {currentStock <= 5
                      ? `Only ${currentStock} left in stock!`
                      : 'In Stock'}
                  </small>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%',
                    background: '#dc2626', display: 'inline-block' }} />
                  <small style={{ color: '#dc2626', fontWeight: 600 }}>Out of Stock</small>
                </div>
              )}
            </div>

            {/* Quantity + Buttons */}
            <div className="mb-4">
              {/* Quantity */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <label className="fw-semibold" style={{ fontSize: 13, flexShrink: 0 }}>
                  Quantity:
                </label>
                <div className="d-flex align-items-center border rounded-2 overflow-hidden">
                  <button type="button"
                    className="btn btn-light border-0 px-3 py-2"
                    onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="fw-bold px-3" style={{ minWidth: 40, textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button type="button"
                    className="btn btn-light border-0 px-3 py-2"
                    onClick={() => setQty(q => Math.min(currentStock, q + 1))}
                    disabled={qty >= currentStock}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn fw-semibold text-white flex-fill"
                  style={{
                    background: added ? '#059669' : '#1a1a2e',
                    borderRadius: 8, padding: '12px 24px',
                    transition: 'background 0.2s', minWidth: 160
                  }}
                  disabled={currentStock === 0}
                  onClick={handleAddToCart}>
                  {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
                <button
                  className="btn fw-semibold text-white flex-fill"
                  style={{
                    background: '#00b894', borderRadius: 8,
                    padding: '12px 24px', minWidth: 140
                  }}
                  disabled={currentStock === 0}
                  onClick={handleBuyNow}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="rounded-3 p-3"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
              {[
                ['🛡️', '100% Genuine Item',    'Every product is physically verified'],
                ['🚪', 'Doorstep Verification', 'Open & check before paying'],
                ['🔄', '7-Day Return',          'Hassle-free return policy'],
                ['💵', 'Cash on Delivery',      'No online payment required'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="d-flex align-items-start gap-2 mb-2">
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <span className="fw-semibold" style={{ fontSize: 13 }}>{title}</span>
                    <span className="text-muted ms-1" style={{ fontSize: 12 }}>— {desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-1 align-items-center">
                <small className="text-muted me-1">Tags:</small>
                {product.tags.map(tag => (
                  <Link key={tag.id}
                    to={`/catalog?search=${tag.name}`}
                    className="badge text-decoration-none"
                    style={{ background: '#f3f4f6', color: '#374151', fontSize: 12 }}>
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== TABS — Description + Variants ===== */}
        <div className="mt-5">
          <ul className="nav nav-tabs mb-4">
            {[
              { key: 'description', label: '📋 Description' },
              product.has_variants && { key: 'variants', label: `🎨 All Variants (${product.variants?.length})` },
            ].filter(Boolean).map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
                  style={activeTab === tab.key
                    ? { color: '#00b894', borderBottomColor: '#00b894' }
                    : { color: '#6b7280' }}
                  onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: 12 }}>
              {product.description ? (
                <div style={{ fontSize: 15, lineHeight: 1.9, color: '#374151' }}
                  dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-muted">No description available.</p>
              )}

              {/* Specs */}
              {(product.model_number || product.currency || product.sku) && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                  <h6 className="fw-bold mb-3">Specifications</h6>
                  <table className="table table-sm" style={{ fontSize: 14 }}>
                    <tbody>
                      {product.sku && (
                        <tr>
                          <td className="text-muted fw-semibold" style={{ width: 140 }}>SKU</td>
                          <td><code>{product.sku}</code></td>
                        </tr>
                      )}
                      {product.model_number && (
                        <tr>
                          <td className="text-muted fw-semibold">Model</td>
                          <td>{product.model_number}</td>
                        </tr>
                      )}
                      {product.currency && (
                        <tr>
                          <td className="text-muted fw-semibold">Currency</td>
                          <td>{product.currency}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr>
                          <td className="text-muted fw-semibold">Brand</td>
                          <td>{product.brand.name}</td>
                        </tr>
                      )}
                      {product.category && (
                        <tr>
                          <td className="text-muted fw-semibold">Category</td>
                          <td>{product.category.name}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && product.has_variants && (
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
                  <thead className="table-light">
                    <tr>
                      <th>Variant</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants?.map(v => (
                      <tr key={v.id}
                        style={{
                          background: selectedVariant?.id === v.id
                            ? '#f0fdf4' : ''
                        }}>
                        <td>
                          <div className="fw-semibold">{v.name}</div>
                          {v.attribute_values?.map(av => (
                            <span key={av.id} className="badge me-1 mt-1"
                              style={{
                                background: av.color_code || '#f3f4f6',
                                color: av.color_code ? '#fff' : '#374151',
                                fontSize: 11
                              }}>
                              {av.value}
                            </span>
                          ))}
                          {v.is_default && (
                            <span className="badge ms-1"
                              style={{ background: '#00b894', fontSize: 10 }}>
                              Default
                            </span>
                          )}
                        </td>
                        <td><code style={{ fontSize: 12 }}>{v.sku}</code></td>
                        <td>
                          <span className="fw-bold">${v.price}</span>
                          {v.compare_price && (
                            <small className="text-muted text-decoration-line-through ms-2">
                              ${v.compare_price}
                            </small>
                          )}
                        </td>
                        <td>
                          <span style={{
                            color: v.stock > 0 ? '#059669' : '#dc2626',
                            fontWeight: 600, fontSize: 13
                          }}>
                            {v.stock > 0 ? `${v.stock} left` : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: selectedVariant?.id === v.id
                                ? '#00b894' : '#f3f4f6',
                              color: selectedVariant?.id === v.id ? '#fff' : '#374151',
                              border: 'none', fontSize: 12
                            }}
                            disabled={v.stock === 0}
                            onClick={() => setSelectedVariant(v)}>
                            {selectedVariant?.id === v.id ? '✓ Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        <RelatedProducts
          categoryId={product.category?.id}
          currentProductId={product.id}
        />
      </div>
    </div>
  )
}

// ==================== RELATED PRODUCTS ====================
function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    if (!categoryId) return
    productService.getAll({
      product_category_id: categoryId,
      per_page: 4
    })
      .then(res => {
        const list = (res.data.data?.data || [])
          .filter(p => p.id !== currentProductId)
          .slice(0, 4)
        setProducts(list)
      })
      .catch(() => {})
  }, [categoryId, currentProductId])

  if (!products.length) return null

  return (
    <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Related Products</h5>
        <Link to={`/catalog?category_id=${categoryId}`}
          style={{ color: '#00b894', fontSize: 14, fontWeight: 500 }}>
          View All →
        </Link>
      </div>

      <div className="row g-3">
        {products.map(product => (
          <div className="col-6 col-md-3" key={product.id}>
            <div className="card border h-100"
              style={{ borderRadius: 10, borderColor: '#eef0f4',
                transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.transform = ''
              }}>

              <Link to={`/product/${product.id}`} className="text-decoration-none">
                <div style={{ aspectRatio: '1', background: '#f5f5f5',
                  borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
                  {product.main_image ? (
                    <img src={product.main_image} alt={product.name}
                      className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                      <span style={{ fontSize: 36 }}>📦</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="card-body p-3">
                {product.brand && (
                  <small style={{ color: '#00b894', fontSize: 10,
                    fontWeight: 700, letterSpacing: 1 }}>
                    {product.brand.name}
                  </small>
                )}
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <p className="fw-semibold mb-2 mt-1"
                    style={{ fontSize: 13, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </p>
                </Link>
                <div className="fw-bold" style={{ color: '#1a1a2e' }}>${product.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetail