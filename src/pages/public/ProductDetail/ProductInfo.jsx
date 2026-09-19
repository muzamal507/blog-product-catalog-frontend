import React from 'react'
import { Link } from 'react-router-dom'

function ProductInfo({product, selectedVariant, currentPrice, currentCompare, currentStock,
    discountPct, isOnSale, qty, setQty, onAddToCart, onBuyNow, added}) {

    if (!product) return null

    return (
        <div>

            {/* Brand + Badges */}
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">

                {product.brand && (
                    <Link to={`/catalog?brand_id=${product.brand.id}`}
                        className="text-decoration-none fw-bold text-uppercase"
                        style={{color: '#00b894', fontSize: 12, letterSpacing: 1.5}} >
                        {product.brand.name}
                    </Link>
                )}

                {product.is_new && (
                    <span className="badge" style={{background: '#3b82f6', fontSize: 10}} >
                        🆕 New
                    </span>
                )}

                {product.is_bestseller && (
                    <span className="badge" style={{background: '#f59e0b', fontSize: 10}} >
                        🔥 Bestseller
                    </span>
                )}

                {product.is_featured && (
                    <span className="badge" style={{background: '#a855f7', fontSize: 10}} >
                        ⭐ Featured
                    </span>
                )}

            </div>

            {/* Product Name */}
            <h1 className="fw-bold mb-3" 
                style={{fontSize: 'clamp(20px, 3vw, 28px)', color: '#1a1a2e'}} >
                {product.name}
            </h1>

            {/* SKU + Model */}
            <div className="mb-3">

                <small className="text-muted">
                    SKU:{' '} <code>{selectedVariant?.sku || product.sku}</code>
                </small>

                {product.model_number && (
                    <small className="text-muted ms-3">
                        Model:{' '} <code>{product.model_number}</code>
                    </small>
                )}

            </div>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fw-bold" style={{fontSize: 32, color: '#1a1a2e'}} >
                    ${currentPrice}
                </span>

                {isOnSale && (
                    <>
                        <span className="text-muted text-decoration-line-through"
                            style={{fontSize: 18}} >
                            ${currentCompare}
                        </span>

                        <span className="badge px-2 py-1"
                            style={{background: '#fee2e2', color: '#dc2626', fontSize: 13}} >
                            -{discountPct}% OFF
                        </span>
                    </>
                )}

            </div>

            {/* Short Description */}
            {product.short_description && (
                <p className="text-muted mb-4"
                    style={{fontSize: 14, lineHeight: 1.8, paddingBottom: 16,
                        borderBottom: '1px solid #f0f0f0'}} >
                    {product.short_description}
                </p>
            )}

            {/* Stock */}
            <div className="mb-4">
                {currentStock > 0 ? (
                    <div className="d-flex align-items-center gap-2">
                        <span style={{width: 8, height: 8, borderRadius: '50%',
                            background: currentStock <= 5 ? '#f59e0b' : '#059669',
                            display: 'inline-block'}} />
                        <small style={{color: currentStock <= 5 ? '#f59e0b' : '#059669', fontWeight: 600}} >
                            {currentStock <= 5 ? `Only ${currentStock} left in stock!` : 'In Stock'}
                        </small>
                    </div>
                ) : (
                    <div className="d-flex align-items-center gap-2">
                        <span style={{width: 8, height: 8, borderRadius: '50%', background: '#dc2626',
                                display: 'inline-block'}} />
                        <small style={{color: '#dc2626', fontWeight: 600}} >
                            Out of Stock
                        </small>
                    </div>
                )}
            </div>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-3 mb-3">
                <label className="fw-semibold" style={{fontSize: 13}} >
                    Quantity:
                </label>

                <div className="d-flex align-items-center border rounded-2 overflow-hidden">
                    <button type="button" className="btn btn-light border-0 px-3 py-2"
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                    >
                        −
                    </button>
                    <span className="fw-bold px-3" style={{minWidth: 40, textAlign: 'center'}} >
                        {qty}
                    </span>

                    <button type="button" className="btn btn-light border-0 px-3 py-2"
                        onClick={() => setQty(q => Math.min(currentStock, q + 1))}
                        disabled={currentStock === 0 || qty >= currentStock}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2 flex-wrap">
                <button type="button" className="btn fw-semibold text-white flex-fill"
                    style={{background: added ? '#059669' : '#1a1a2e',
                        borderRadius: 8, padding: '12px 24px', minWidth: 160}}
                    disabled={currentStock === 0} onClick={onAddToCart}
                >
                    {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>

                <button type="button" className="btn fw-semibold text-white flex-fill"
                    style={{background: '#00b894', borderRadius: 8,
                        padding: '12px 24px', minWidth: 140}}
                    disabled={currentStock === 0} onClick={onBuyNow} >
                    ⚡ Buy Now
                </button>
            </div>
        </div>
    )
}

export default ProductInfo