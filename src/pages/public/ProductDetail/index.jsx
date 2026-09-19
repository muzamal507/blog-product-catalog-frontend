import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import productService from '../../../services/productService'
import { useCart } from '../../../context/CartContext'

import ImageGallery from './ImageGallery'
import ProductInfo from './ProductInfo'

// =====================================================
// VARIANT SELECTOR
// =====================================================

function VariantSelector({ variants = [], selected, onSelect }) {
    if (!variants.length) return null

    const attrMap = {}

    variants.forEach((variant) => {
        variant.attribute_values?.forEach((attributeValue) => {
            const attributeName = attributeValue.attribute?.name

            if (!attributeName) return

            if (!attrMap[attributeName]) {
                attrMap[attributeName] = {
                    type: attributeValue.attribute?.type,
                    values: [],
                }
            }

            const alreadyExists = attrMap[attributeName].values.some(
                (value) => value.id === attributeValue.id
            )

            if (!alreadyExists) {
                attrMap[attributeName].values.push(attributeValue)
            }
        })
    })

    const selectedAttributeValueIds =
        selected?.attribute_values?.map((attributeValue) => attributeValue.id) || []

    const handleAttributeSelect = (attributeName, attributeValueId) => {
        const newSelectedIds = Object.keys(attrMap)
            .map((name) => {
                if (name === attributeName) {
                    return attributeValueId
                }

                return selectedAttributeValueIds.find((id) =>
                    attrMap[name].values.some((value) => value.id === id)
                )
            })
            .filter(Boolean)

        const matchedVariant = variants.find((variant) => {
            const variantAttributeValueIds =
                variant.attribute_values?.map((attributeValue) => attributeValue.id) || []

            return newSelectedIds.every((id) => variantAttributeValueIds.includes(id)
            )
        })

        if (matchedVariant) {
            onSelect(matchedVariant)
        }
    }

    return (
        <div className="mb-4">
            {Object.entries(attrMap).map(([attributeName, attribute]) => {
                const selectedValue = selected?.attribute_values?.find(
                    (attributeValue) =>
                        attribute.values.some(
                            (value) => value.id === attributeValue.id
                        )
                )

                return (
                    <div key={attributeName} className="mb-3">
                        <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }} >
                            {attributeName}

                            {selectedValue && (
                                <span className="text-muted fw-normal ms-2">
                                    — {selectedValue.value}
                                </span>
                            )}
                        </label>

                        <div className="d-flex flex-wrap gap-2">
                            {attribute.values.map((attributeValue) => {
                                const isSelected =
                                    selectedAttributeValueIds.includes(
                                        attributeValue.id
                                    )

                                const isAvailable = variants.some((variant) => {
                                    const hasAttributeValue =
                                        variant.attribute_values?.some(
                                            (value) => value.id === attributeValue.id
                                        )

                                    const stock = Number(
                                        variant.stock ?? variant.stock_qty ?? 0
                                    )

                                    return hasAttributeValue && stock > 0
                                })

                                if (attribute.type === 'Color') {
                                    return (
                                        <button key={attributeValue.id} type="button"
                                            title={attributeValue.value} disabled={!isAvailable}
                                            onClick={() =>
                                                handleAttributeSelect(attributeName, attributeValue.id)
                                            }
                                            style={{width: 36, height: 36, borderRadius: '50%',
                                                background: attributeValue.color_code || '#e5e7eb',
                                                border: isSelected ? '3px solid #00b894' : '3px solid transparent',
                                                outline: isSelected ? '2px solid #00b894' : '2px solid #e5e7eb',
                                                outlineOffset: 2,
                                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                opacity: isAvailable ? 1 : 0.4, transition: 'all 0.2s'}}
                                        />
                                    )
                                }

                                return (
                                    <button key={attributeValue.id} type="button" disabled={!isAvailable}
                                        onClick={() => handleAttributeSelect(attributeName,attributeValue.id)}
                                        style={{padding: '6px 16px', borderRadius: 6,
                                            background: isSelected ? '#1a1a2e' : '#f3f4f6',
                                            color: isSelected ? '#fff' : '#374151',
                                            border: isSelected ? '1.5px solid #1a1a2e' : '1.5px solid #e5e7eb',
                                            fontSize: 13, fontWeight: isSelected ? 600 : 400,
                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                            opacity: isAvailable ? 1 : 0.4, transition: 'all 0.2s',
                                            textDecoration: !isAvailable ? 'line-through' : 'none'}}
                                    >
                                        {attributeValue.value}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// =====================================================
// MAIN PRODUCT DETAIL COMPONENT
// =====================================================

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { addToCart, cartItems } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)
    const [activeTab, setActiveTab] = useState('description')

    // =================================================
    // LOAD PRODUCT
    // =================================================

    useEffect(() => {
        let isMounted = true

        const loadProduct = async () => {
            setLoading(true)
            setNotFound(false)
            setProduct(null)
            setSelectedVariant(null)
            setQty(1)
            setAdded(false)
            setActiveTab('description')

            try {
                let response

                if (typeof productService.getBySlug === 'function') {
                    response = await productService.getBySlug(id)
                } else {
                    const listResponse = await productService.adminList({
                        search: id, per_page: 1,
                    })

                    const productList = listResponse.data?.data?.data || listResponse.data?.data || []
                    const foundProduct = productList[0]

                    if (!foundProduct) {
                        if (isMounted) {
                            setNotFound(true)
                        }
                        return
                    }
                    response = await productService.edit(foundProduct.id)
                }

                const loadedProduct = response.data?.data || response.data

                if (!loadedProduct) {
                    if (isMounted) {
                        setNotFound(true)
                    }
                    return
                }

                if (!isMounted) return

                setProduct(loadedProduct)

                if (loadedProduct.has_variants && loadedProduct.variants?.length) {
                    const defaultVariant =
                        loadedProduct.variants.find((variant) => variant.is_default ) || loadedProduct.variants[0]

                    setSelectedVariant(defaultVariant)
                }
            } catch (error) {
                console.error('Product detail loading error:', error)

                if (isMounted) {
                    setNotFound(true)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadProduct()

        return () => {
            isMounted = false
        }
    }, [id])

    // =================================================
    // CURRENT PRODUCT VALUES
    // =================================================

    const currentPrice = product?.has_variants && selectedVariant
        ? Number(selectedVariant.price ?? selectedVariant.sale_price ?? 0)
        : Number(product?.price ?? product?.sale_price ?? 0)

    const currentCompare = product?.has_variants && selectedVariant
        ? Number(selectedVariant.compare_price ?? selectedVariant.regular_price ?? 0)
        : Number(product?.compare_price ?? product?.regular_price ?? 0          )

    const currentStock = product?.has_variants && selectedVariant
        ? Number(selectedVariant.stock ?? selectedVariant.stock_qty ?? 0)
        : Number(product?.stock ?? product?.stock_qty ?? 99)

    const isOnSale = currentCompare > currentPrice && currentPrice > 0

    const discountPct = isOnSale
        ? Math.round(((currentCompare - currentPrice) / currentCompare) * 100) : 0

    const inCart = cartItems.some((item) => {
        const sameProduct = item.id === product?.id

        if (!sameProduct) return false

        if (!product?.has_variants) {
            return true
        }

        return item.variantId === selectedVariant?.id
    })

    // =================================================
    // ADD TO CART
    // =================================================

    const handleAddToCart = () => {
        if (!product || currentStock <= 0) return

        addToCart({
            id: product.id,
            name: product.name,
            price: currentPrice,
            sku: selectedVariant?.sku || product.sku || null,
            image: product.images?.[0]?.url || product.main_image || null,
            variantId: selectedVariant?.id || null,
            variantName: selectedVariant?.name || selectedVariant?.variant_name || null,
            qty,
        })

        setAdded(true)
    }

    // =================================================
    // BUY NOW
    // =================================================

    const handleBuyNow = () => {
        if (!product || currentStock <= 0) return

        handleAddToCart()
        navigate('/checkout')
    }

    // =================================================
    // LOADING SCREEN
    // =================================================

    if (loading) {
        return (
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div style={{aspectRatio: '1', background: '#f0f0f0',
                                borderRadius: 12, animation: 'productSkeleton 1.5s infinite'}} />

                        <style>
                            {`
                                @keyframes productSkeleton {
                                    0%, 100% {opacity: 1; }
                                    50% {opacity: 0.5; }
                                }
                            `}
                        </style>
                    </div>

                    <div className="col-12 col-md-6">
                        {[200, 100, 60, 100, 150, 200].map(
                            (width, index) => (
                                <div key={index} 
                                     style={{height: index === 0 ? 32 : 16, background: '#f0f0f0',
                                        borderRadius: 6, marginBottom: 16, width: `${width}px`,
                                        maxWidth: '100%', animation: 'productSkeleton 1.5s infinite'}}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // =================================================
    // NOT FOUND SCREEN
    // =================================================

    if (notFound || !product) {
        return (
            <div className="container text-center py-5">
                <div style={{ fontSize: 72 }}>📦</div>

                <h4 className="fw-bold mt-3 mb-2">Product Not Found</h4>

                <p className="text-muted mb-4">
                    This product may have been removed or is unavailable.
                </p>

                <Link to="/catalog" className="btn text-white px-4"
                    style={{background: '#00b894', borderRadius: 8}} >
                    ← Back to Catalog
                </Link>
            </div>
        )
    }

    // =================================================
    // MAIN RENDER
    // =================================================

    return (
        <div>
            {/* Breadcrumb */}
            <div className="bg-light py-2 px-3 px-md-4"
                style={{borderBottom: '1px solid #eef0f4'}} >
                <nav style={{ fontSize: 13 }}>
                    <Link to="/" style={{ color: '#6b7280' }} >
                        Home
                    </Link>

                    <span className="mx-2 text-muted">/</span>

                    <Link to="/catalog" style={{ color: '#6b7280' }} >
                        Catalog
                    </Link>

                    {product.category && (
                        <>
                            <span className="mx-2 text-muted">/</span>

                            <Link to={`/catalog?category_id=${product.category.id}`}
                                style={{ color: '#6b7280' }} >
                                {product.category.name}
                            </Link>
                        </>
                    )}

                    <span className="mx-2 text-muted">/</span>

                    <span style={{color: '#1a1a2e', fontWeight: 500}} >
                        {product.name}
                    </span>
                </nav>
            </div>

            <div className="container py-4 py-md-5">
                <div className="row g-4 g-md-5">
                    {/* Product Images */}
                    <div className="col-12 col-md-6">
                        <ImageGallery images={product.images || []} productName={product.name} />
                    </div>

                    {/* Product Information */}
                    <div className="col-12 col-md-6">
                        <ProductInfo 
                            product={product}
                            selectedVariant={selectedVariant}
                            currentPrice={currentPrice}
                            currentCompare={currentCompare}
                            currentStock={currentStock}
                            discountPct={discountPct}
                            isOnSale={isOnSale}
                            qty={qty}
                            setQty={setQty}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                            added={added}
                        />

                        {/* Variant Selector */}
                        {product.has_variants && (
                            <VariantSelector
                                variants={product.variants || []}
                                selected={selectedVariant}
                                onSelect={(variant) => {
                                    setSelectedVariant(variant), setQty(1), setAdded(false)
                                }}
                            />
                        )}

                        {/* Product Guarantees */}
                        <div className="rounded-3 p-3 mt-4"
                            style={{background: '#f9fafb', border: '1px solid #e5e7eb'}} >
                            {[
                                [
                                    '🛡️',
                                    '100% Genuine Item',
                                    'Every product is physically verified',
                                ],
                                [
                                    '🚪',
                                    'Doorstep Verification',
                                    'Open & check before paying',
                                ],
                                [
                                    '🔄',
                                    '7-Day Return',
                                    'Hassle-free return policy',
                                ],
                                [
                                    '💵',
                                    'Cash on Delivery',
                                    'No online payment required',
                                ],
                            ].map(([icon, title, description]) => (
                                <div key={title} className="d-flex align-items-start gap-2 mb-2" >
                                    <span style={{fontSize: 16, flexShrink: 0}} >
                                        {icon}
                                    </span>

                                    <div>
                                        <span className="fw-semibold" style={{ fontSize: 13 }} >
                                            {title}
                                        </span>

                                        <span className="text-muted ms-1" style={{ fontSize: 12 }} >
                                            — {description}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Product Tags */}
                        {product.tags?.length > 0 && (
                            <div className="mt-3 d-flex flex-wrap gap-1 align-items-center">
                                <small className="text-muted me-1">
                                    Tags:
                                </small>

                                {product.tags.map((tag) => (
                                    <Link key={tag.id} to={`/catalog?search=${encodeURIComponent(tag.name)}`}
                                        className="badge text-decoration-none"
                                        style={{background: '#f3f4f6', color: '#374151', fontSize: 12}}
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description and Variants Tabs */}
                <div className="mt-5">
                    <ul className="nav nav-tabs mb-4">
                        {[
                            {
                                key: 'description',
                                label: '📋 Description',
                            },
                            product.has_variants && {
                                key: 'variants',
                                label: `🎨 All Variants (${
                                    product.variants?.length || 0
                                })`,
                            },
                        ]
                            .filter(Boolean)
                            .map((tab) => (
                                <li className="nav-item" key={tab.key} >
                                    <button type="button"
                                        className={`nav-link ${
                                            activeTab === tab.key ? 'active fw-semibold' : ''
                                        }`}
                                        style={
                                            activeTab === tab.key
                                                ? {
                                                      color: '#00b894',
                                                      borderBottomColor:
                                                          '#00b894',
                                                  }
                                                : {
                                                      color: '#6b7280',
                                                  }
                                        }
                                        onClick={() =>
                                            setActiveTab(tab.key)
                                        }
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                    </ul>

                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div className="card border-0 shadow-sm p-4 p-md-5"
                            style={{ borderRadius: 12 }} >
                            {product.description ? (
                                <div style={{fontSize: 15, lineHeight: 1.9, color: '#374151'}}
                                    dangerouslySetInnerHTML={{
                                        __html: product.description.replace(
                                            /\n/g,
                                            '<br/>'
                                        ),
                                    }}
                                />
                            ) : (
                                <p className="text-muted">No description available.</p>
                            )}

                            {/* Specifications */}
                            {(product.model_number || product.currency || product.sku) && (
                                <div className="mt-4 pt-4"
                                    style={{borderTop: '1px solid #e5e7eb'}} >
                                    <h6 className="fw-bold mb-3">Specifications</h6>

                                    <div className="table-responsive">
                                        <table className="table table-sm" style={{ fontSize: 14 }} >
                                            <tbody>
                                                {product.sku && (
                                                    <tr>
                                                        <td className="text-muted fw-semibold"
                                                            style={{width: 140}} >
                                                            SKU
                                                        </td>
                                                        <td>
                                                            <code>
                                                                {product.sku}
                                                            </code>
                                                        </td>
                                                    </tr>
                                                )}

                                                {product.model_number && (
                                                    <tr>
                                                        <td className="text-muted fw-semibold">
                                                            Model
                                                        </td>
                                                        <td>
                                                            {product.model_number}
                                                        </td>
                                                    </tr>
                                                )}

                                                {product.currency && (
                                                    <tr>
                                                        <td className="text-muted fw-semibold">
                                                            Currency
                                                        </td>
                                                        <td>
                                                            {product.currency}
                                                        </td>
                                                    </tr>
                                                )}

                                                {product.brand && (
                                                    <tr>
                                                        <td className="text-muted fw-semibold">
                                                            Brand
                                                        </td>
                                                        <td>
                                                            {product.brand.name}
                                                        </td>
                                                    </tr>
                                                )}

                                                {product.category && (
                                                    <tr>
                                                        <td className="text-muted fw-semibold">
                                                            Category
                                                        </td>
                                                        <td>
                                                            {product.category.name}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Variants Tab */}
                    {activeTab === 'variants' &&
                        product.has_variants && (
                            <div className="card border-0 shadow-sm p-4"
                                style={{ borderRadius: 12 }} >
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0"
                                        style={{ fontSize: 14 }} >
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
                                            {product.variants?.map(
                                                (variant) => {
                                                    const variantStock =
                                                        Number(variant.stock ?? variant.stock_qty ?? 0)

                                                    return (
                                                        <tr key={variant.id}
                                                            style={{
                                                                background: selectedVariant?.id === variant.id ? '#f0fdf4' : '',
                                                            }}
                                                        >
                                                            <td>
                                                                <div className="fw-semibold">
                                                                    {variant.name || variant.variant_name || 'Variant'}
                                                                </div>

                                                                {variant.attribute_values?.map(
                                                                    (attributeValue) => (
                                                                        <span key={attributeValue.id} className="badge me-1 mt-1"
                                                                            style={{
                                                                                background: attributeValue.color_code || '#f3f4f6',
                                                                                color: attributeValue.color_code ? '#fff' : '#374151',
                                                                                fontSize: 11,
                                                                            }}
                                                                        >
                                                                            {attributeValue.value}
                                                                        </span>
                                                                    )
                                                                )}

                                                                {variant.is_default && (
                                                                    <span className="badge ms-1"
                                                                        style={{background: '#00b894', fontSize: 10}}
                                                                    >
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <code style={{fontSize: 12}} >
                                                                    {variant.sku || 'N/A'}
                                                                </code>
                                                            </td>

                                                            <td>
                                                                <span className="fw-bold">
                                                                    ${Number(variant.price ?? 0).toFixed(2)}
                                                                </span>

                                                                {Number(
                                                                    variant.compare_price ?? 0
                                                                    ) > 0 && (
                                                                    <small className="text-muted text-decoration-line-through ms-2">
                                                                        ${Number(variant.compare_price).toFixed(2)}
                                                                    </small>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <span style={{
                                                                        color: variantStock > 0 ? '#059669' : '#dc2626',
                                                                        fontWeight: 600, fontSize: 13,
                                                                    }}
                                                                >
                                                                    {variantStock > 0 ? `${variantStock} left` : 'Out of Stock'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <button type="button" className="btn btn-sm"
                                                                    style={{
                                                                        background: selectedVariant?.id ===
                                                                            variant.id ? '#00b894' : '#f3f4f6',
                                                                        color: selectedVariant?.id ===
                                                                            variant.id ? '#fff' : '#374151',
                                                                        border: 'none', fontSize: 12,
                                                                    }}
                                                                    disabled={variantStock === 0}
                                                                    onClick={() => {
                                                                        setSelectedVariant(variant)
                                                                        setQty(1)
                                                                        setAdded(false)
                                                                    }}
                                                                >
                                                                    { selectedVariant?.id ===
                                                                        variant.id ? '✓ Selected' : 'Select'
                                                                    }
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </div>

                {/* Related Products */}
                <RelatedProducts categoryId={product.category?.id} currentProductId={product.id} />
            </div>
        </div>
    )
}

// =====================================================
// RELATED PRODUCTS
// =====================================================

function RelatedProducts({ categoryId, currentProductId }) {
    const [products, setProducts] = useState([])

    useEffect(() => {
        let isMounted = true

        const loadRelatedProducts = async () => {
            if (!categoryId) return

            try {
                const response = await productService.getAll({
                    product_category_id: categoryId,
                    per_page: 4,
                })

                const productList = response.data?.data?.data || response.data?.data || []

                const relatedProducts = productList
                    .filter((product) => product.id !== currentProductId)
                    .slice(0, 4)

                if (isMounted) {
                    setProducts(relatedProducts)
                }
            } catch (error) {
                console.error(
                    'Related products loading error:',
                    error
                )
            }
        }

        loadRelatedProducts()

        return () => {
            isMounted = false
        }
    }, [categoryId, currentProductId])

    if (!products.length) return null

    return (
        <div className="mt-5 pt-4" style={{borderTop: '1px solid #e5e7eb'}} >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Related Products</h5>

                <Link to={`/catalog?category_id=${categoryId}`}
                    style={{color: '#00b894', fontSize: 14, fontWeight: 500}} >
                    View All →
                </Link>
            </div>

            <div className="row g-3">
                {products.map((relatedProduct) => (
                    <div className="col-6 col-md-3" key={relatedProduct.id} >
                        <div className="card border h-100"
                            style={{borderRadius: 10, borderColor: '#eef0f4',
                                transition: 'box-shadow 0.2s, transform 0.2s'}}
                            onMouseOver={(event) => {
                                event.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,.1)'
                                event.currentTarget.style.transform = 'translateY(-2px)'
                            }}
                            onMouseOut={(event) => {
                                event.currentTarget.style.boxShadow = ''
                                event.currentTarget.style.transform = ''
                            }}
                        >
                            <Link to={`/product/${relatedProduct.id}`} className="text-decoration-none" >
                                <div style={{aspectRatio: '1', background: '#f5f5f5',
                                        borderRadius: '10px 10px 0 0', overflow: 'hidden'}} >
                                    {relatedProduct.main_image ? (
                                        <img src={relatedProduct.main_image} alt={relatedProduct.name}
                                            className="w-100 h-100" style={{objectFit: 'cover'}} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                            <span style={{fontSize: 36}} >
                                                📦
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="card-body p-3">
                                {relatedProduct.brand && (
                                    <small style={{color: '#00b894', fontSize: 10, fontWeight: 700,
                                            letterSpacing: 1}} >
                                        {relatedProduct.brand.name}
                                    </small>
                                )}

                                <Link to={`/product/${relatedProduct.id}`} className="text-decoration-none text-dark" >
                                    <p className="fw-semibold mb-2 mt-1"
                                        style={{fontSize: 13, lineHeight: 1.4, display: '-webkit-box',
                                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}
                                    >
                                        {relatedProduct.name}
                                    </p>
                                </Link>

                                <div className="fw-bold" style={{color: '#1a1a2e'}} >
                                    ${Number(relatedProduct.price ?? 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductDetail