import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import productService from '../../../services/productService'
import productCategoryService from '../../../services/productCategoryService'
import brandService from '../../../services/brandService'
// import tagService from '../../../services/tagService'
import attributeService from '../../../services/attributeService'

const INITIAL = {
  name: '', slug: '', sku: '', model_number: '',
  short_description: '', description: '',
  product_category_id: '', brand_id: '',
  currency: 'USD', status: 'Active',
  is_featured: false, is_new: false,
  is_bestseller: false, has_variants: false,
  sort_order: 0,
  meta_title: '', meta_description: '', meta_keywords: '',
  // Simple product fields
  stock_quantity: 0, price: '', compare_price: '', cost: '',
  category_ids: [], tag_ids: [],
}

const VARIANT_INIT = {
  id: null, name: '', sku: '', model_number: '',
  stock_quantity: 0, status: 'Active',
  is_default: false, sort_order: 0,
  price: '', compare_price: '', cost: '',
  attribute_value_ids: [],
}

function ProductForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]           = useState(INITIAL)
  const [variants, setVariants]   = useState([])
  const [delVariantIds, setDelVariantIds] = useState([])
  const [images, setImages]       = useState([])
  const [existingMedia, setExistingMedia] = useState([])
  const [delMediaIds, setDelMediaIds]     = useState([])
  const [primaryIdx, setPrimaryIdx]       = useState(0)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [loading, setLoading]     = useState(isEdit)
  const [activeTab, setActiveTab] = useState('basic')

  const [categories, setCategories] = useState([])
  const [brands, setBrands]         = useState([])
  const [tags, setTags]             = useState([])
  const [attributes, setAttributes] = useState([])

  // Load dropdowns
  useEffect(() => {
    Promise.all([
      productCategoryService.getAll({ all: true }),
      brandService.adminList({ per_page: 100 }),
      // tagService.getAll(),
      attributeService.adminList({ per_page: 100 }),
    ]).then(([cats, brs, tgs, attrs]) => {
      setCategories(cats.data.data?.data || cats.data.data || [])
      setBrands(brs.data.data?.data || brs.data.data || [])
      // setTags(tgs.data.data?.data || tgs.data.data || [])
      setAttributes(attrs.data.data?.data || attrs.data.data || [])
    }).catch(() => {})
  }, [])

  // Load product for edit
  useEffect(() => {
    if (!isEdit) return
    productService.edit(id)
      .then(res => {
        const p = res.data.data
        setForm({
          name:                 p.name || '',
          slug:                 p.slug || '',
          sku:                  p.sku || '',
          model_number:         p.model_number || '',
          short_description:    p.short_description || '',
          description:          p.description || '',
          product_category_id:  p.product_category_id || '',
          brand_id:             p.brand_id || '',
          currency:             p.currency || 'USD',
          status:               p.status || 'Active',
          is_featured:          p.is_featured || false,
          is_new:               p.is_new || false,
          is_bestseller:        p.is_bestseller || false,
          has_variants:         p.has_variants || false,
          sort_order:           p.sort_order || 0,
          meta_title:           p.meta_title || '',
          meta_description:     p.meta_description || '',
          meta_keywords:        p.meta_keywords || '',
          stock_quantity:       p.variants?.[0]?.stock_quantity || 0,
          price:                p.price || '',
          compare_price:        p.compare_price || '',
          cost:                 p.variants?.[0]?.cost || '',
          category_ids:         p.category_ids || [],
          tag_ids:              p.tag_ids || [],
        })
        setExistingMedia(res.data.media || [])
        setAttributes(res.data.attributes || attributes)
        if (p.variants?.length) {
          setVariants(p.variants.map(v => ({
            id:                   v.id,
            name:                 v.name,
            sku:                  v.sku,
            model_number:         v.model_number || '',
            stock_quantity:       v.stock_quantity || 0,
            status:               v.status || 'Active',
            is_default:           v.is_default || false,
            sort_order:           v.sort_order || 0,
            price:                v.price || '',
            compare_price:        v.compare_price || '',
            cost:                 v.cost || '',
            attribute_value_ids:  v.attribute_value_ids || [],
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev, [name]: type === 'checkbox' ? checked : value
    }))
    if (name === 'name' && !isEdit) {
      setForm(prev => ({
        ...prev, name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }))
    }
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleCategory = (catId) => {
    setForm(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter(c => c !== catId)
        : [...prev.category_ids, catId]
    }))
  }

  const toggleTag = (tagId) => {
    setForm(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(t => t !== tagId)
        : [...prev.tag_ids, tagId]
    }))
  }

  const handleImages = (e) => {
    setImages(prev => [...prev, ...Array.from(e.target.files)])
  }

  const removeNewImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  const removeExistingImage = (mediaId) => {
    setDelMediaIds(prev => [...prev, mediaId])
    setExistingMedia(prev => prev.filter(m => m.id !== mediaId))
  }

  // Variants
  const addVariant = () => setVariants(prev => [
    ...prev, { ...VARIANT_INIT, sort_order: prev.length }
  ])

  const removeVariant = (idx) => {
    const v = variants[idx]
    if (v.id) setDelVariantIds(prev => [...prev, v.id])
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  const updateVariant = (idx, field, val) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: val } : v))
  }

  const toggleAttrValue = (variantIdx, avId) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== variantIdx) return v
      const ids = v.attribute_value_ids.includes(avId)
        ? v.attribute_value_ids.filter(x => x !== avId)
        : [...v.attribute_value_ids, avId]
      return { ...v, attribute_value_ids: ids }
    }))
  }

  const setDefaultVariant = (idx) => {
    setVariants(prev => prev.map((v, i) => ({ ...v, is_default: i === idx })))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.sku.trim())  e.sku  = 'SKU is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const fd = new FormData()

    // Basic fields
    const skip = ['category_ids','tag_ids','image']
    Object.entries(form).forEach(([k, v]) => {
      if (skip.includes(k)) return
      if (typeof v === 'boolean') fd.append(k, v ? '1' : '0')
      else if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })

    // Categories
    form.category_ids.forEach(id => fd.append('category_ids[]', id))

    // Tags
    form.tag_ids.forEach(id => fd.append('tag_ids[]', id))

    // Images
    images.forEach(file => fd.append('images[]', file))
    fd.append('primary_image_index', primaryIdx)
    delMediaIds.forEach(mid => fd.append('delete_image_ids[]', mid))

    // Variants
    if (form.has_variants) {
      variants.forEach((v, i) => {
        const pfx = `variants[${i}]`
        if (v.id) fd.append(`${pfx}[id]`, v.id)
        fd.append(`${pfx}[name]`, v.name)
        fd.append(`${pfx}[sku]`, v.sku)
        if (v.model_number) fd.append(`${pfx}[model_number]`, v.model_number)
        fd.append(`${pfx}[stock_quantity]`, v.stock_quantity)
        fd.append(`${pfx}[status]`, v.status)
        fd.append(`${pfx}[is_default]`, v.is_default ? '1' : '0')
        fd.append(`${pfx}[sort_order]`, v.sort_order)
        fd.append(`${pfx}[price]`, v.price)
        if (v.compare_price) fd.append(`${pfx}[compare_price]`, v.compare_price)
        if (v.cost) fd.append(`${pfx}[cost]`, v.cost)
        v.attribute_value_ids.forEach(avId => fd.append(`${pfx}[attribute_value_ids][]`, avId))
      })
      delVariantIds.forEach(vid => fd.append('delete_variant_ids[]', vid))
    }

    try {
      if (isEdit) await productService.update(id, fd)
      else        await productService.store(fd)
      setSaved(true)
      setTimeout(() => navigate('/admin/products'), 1200)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#00b894' }} />
    </div>
  )

  const tabs = [
    { key: 'basic',    label: '📋 Basic' },
    { key: 'price',    label: '💰 Price' },
    { key: 'variants', label: `🎨 Variants${form.has_variants ? ` (${variants.length})` : ''}` },
    { key: 'images',   label: '🖼 Images' },
    { key: 'seo',      label: '🔍 SEO' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{isEdit ? 'Edit Product' : 'Add Product'}</h4>
          <small className="text-muted">
            <Link to="/admin/products" style={{ color: '#00b894' }}>Products</Link>
            {' / '}{isEdit ? 'Edit' : 'Add New'}
          </small>
        </div>
        <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && <div className="alert alert-success mb-4">✅ Product {isEdit ? 'updated' : 'created'} successfully! Redirecting...</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
              style={activeTab === tab.key ? { color: '#00b894', borderBottomColor: '#00b894' } : {}}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            {/* BASIC */}
            {activeTab === 'basic' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Product Information</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Chronos Titanium V1"
                    value={form.name} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                      SKU <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="sku"
                      className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                      placeholder="CHR-TIT-V1"
                      value={form.sku} onChange={handleChange} />
                    {errors.sku && <div className="invalid-feedback">{errors.sku}</div>}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Model Number</label>
                    <input type="text" name="model_number" className="form-control"
                      placeholder="Optional"
                      value={form.model_number} onChange={handleChange} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Category</label>
                    <select name="product_category_id" className="form-select"
                      value={form.product_category_id} onChange={handleChange}>
                      <option value="">— Select Category —</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.parent_id ? `↳ ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Brand</label>
                    <select name="brand_id" className="form-select"
                      value={form.brand_id} onChange={handleChange}>
                      <option value="">— Select Brand —</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Short Description</label>
                  <textarea name="short_description" rows={2} className="form-control"
                    placeholder="Brief summary (max 500 chars)"
                    value={form.short_description} onChange={handleChange} />
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Full Description</label>
                  <textarea name="description" rows={5} className="form-control"
                    placeholder="Detailed product description..."
                    value={form.description} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* PRICE */}
            {activeTab === 'price' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Pricing</h6>
                {form.has_variants ? (
                  <div className="text-center py-4 rounded-3"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: 36 }}>🎨</div>
                    <p className="mt-2 fw-semibold" style={{ color: '#059669' }}>
                      Set price per variant in Variants tab.
                    </p>
                  </div>
                ) : (
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">$</span>
                        <input type="number" name="price" step="0.01" min="0"
                          className="form-control" placeholder="0.00"
                          value={form.price} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Compare Price</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">$</span>
                        <input type="number" name="compare_price" step="0.01" min="0"
                          className="form-control" placeholder="0.00"
                          value={form.compare_price} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Cost Price</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">$</span>
                        <input type="number" name="cost" step="0.01" min="0"
                          className="form-control" placeholder="0.00"
                          value={form.cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Stock Quantity</label>
                      <input type="number" name="stock_quantity" min="0"
                        className="form-control" style={{ maxWidth: 160 }}
                        value={form.stock_quantity} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VARIANTS */}
            {activeTab === 'variants' && (
              <div>
                {!form.has_variants ? (
                  <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: 12 }}>
                    <div style={{ fontSize: 40 }}>🎨</div>
                    <h6 className="fw-bold mt-3">Enable Variants</h6>
                    <p className="text-muted mb-3">Add sizes, colors, or other options.</p>
                    <button type="button" className="btn text-white"
                      style={{ background: '#00b894' }}
                      onClick={() => setForm(p => ({ ...p, has_variants: true }))}>
                      Enable Variants
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Attribute reference */}
                    {attributes.length > 0 && (
                      <div className="card border-0 shadow-sm p-3 mb-3"
                        style={{ borderRadius: 12, background: '#f9fafb' }}>
                        <small className="fw-bold text-muted mb-2 d-block">Available Attributes</small>
                        <div className="d-flex flex-wrap gap-2">
                          {attributes.map(attr => (
                            <div key={attr.id}>
                              <small className="fw-semibold text-muted me-1">{attr.name}:</small>
                              {attr.values?.map(v => (
                                <span key={v.id} className="badge me-1"
                                  style={{ background: v.color_code || '#e5e7eb', color: v.color_code ? '#fff' : '#374151', fontSize: 11 }}>
                                  {v.value}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {variants.map((v, idx) => (
                      <div key={idx} className="card border-0 shadow-sm p-4 mb-3"
                        style={{ borderRadius: 12, borderLeft: v.is_default ? '3px solid #00b894' : '3px solid #e5e7eb' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold mb-0">
                            Variant #{idx + 1}
                            {v.is_default && <span className="badge ms-2" style={{ background: '#00b894', fontSize: 11 }}>Default</span>}
                          </h6>
                          <div className="d-flex gap-2">
                            {!v.is_default && (
                              <button type="button" className="btn btn-sm btn-outline-success"
                                onClick={() => setDefaultVariant(idx)}>Set Default</button>
                            )}
                            <button type="button" className="btn btn-sm btn-outline-danger"
                              onClick={() => removeVariant(idx)}>✕ Remove</button>
                          </div>
                        </div>

                        <div className="row g-3">
                          <div className="col-6">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Name *</label>
                            <input type="text" className="form-control form-control-sm"
                              placeholder="e.g. Red / XL"
                              value={v.name}
                              onChange={e => updateVariant(idx, 'name', e.target.value)} />
                          </div>
                          <div className="col-3">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>SKU *</label>
                            <input type="text" className="form-control form-control-sm"
                              value={v.sku}
                              onChange={e => updateVariant(idx, 'sku', e.target.value)} />
                          </div>
                          <div className="col-3">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Stock</label>
                            <input type="number" className="form-control form-control-sm" min="0"
                              value={v.stock_quantity}
                              onChange={e => updateVariant(idx, 'stock_quantity', parseInt(e.target.value) || 0)} />
                          </div>
                          <div className="col-4">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Price *</label>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text">$</span>
                              <input type="number" className="form-control" step="0.01"
                                value={v.price}
                                onChange={e => updateVariant(idx, 'price', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-4">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Compare</label>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text">$</span>
                              <input type="number" className="form-control" step="0.01"
                                value={v.compare_price}
                                onChange={e => updateVariant(idx, 'compare_price', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-4">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Cost</label>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text">$</span>
                              <input type="number" className="form-control" step="0.01"
                                value={v.cost}
                                onChange={e => updateVariant(idx, 'cost', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-6">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Status</label>
                            <select className="form-select form-select-sm"
                              value={v.status}
                              onChange={e => updateVariant(idx, 'status', e.target.value)}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>

                          {/* Attribute Values */}
                          {attributes.length > 0 && (
                            <div className="col-12">
                              <label className="form-label fw-semibold" style={{ fontSize: 12 }}>
                                Attribute Values
                              </label>
                              <div className="d-flex flex-wrap gap-2">
                                {attributes.map(attr => (
                                  <div key={attr.id}>
                                    <small className="text-muted me-1">{attr.name}:</small>
                                    {attr.values?.map(av => (
                                      <button key={av.id} type="button"
                                        className="btn btn-sm me-1 mb-1"
                                        style={{
                                          fontSize: 11, borderRadius: 20,
                                          background: v.attribute_value_ids.includes(av.id)
                                            ? (av.color_code || '#00b894') : '#f3f4f6',
                                          color: v.attribute_value_ids.includes(av.id) ? '#fff' : '#374151',
                                          border: 'none'
                                        }}
                                        onClick={() => toggleAttrValue(idx, av.id)}>
                                        {av.value}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={addVariant}
                      className="btn w-100 btn-outline-secondary"
                      style={{ borderRadius: 8, borderStyle: 'dashed' }}>
                      + Add Variant
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* IMAGES */}
            {activeTab === 'images' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">Product Images</h6>

                {/* Existing */}
                {existingMedia.length > 0 && (
                  <div className="mb-4">
                    <small className="fw-semibold text-muted d-block mb-2">
                      Existing ({existingMedia.length})
                    </small>
                    <div className="d-flex flex-wrap gap-3">
                      {existingMedia.map(m => (
                        <div key={m.id} className="position-relative" style={{ width: 100 }}>
                          <img src={m.url} alt=""
                            className="rounded-3 w-100"
                            style={{ height: 100, objectFit: 'cover',
                              border: m.is_primary ? '2px solid #00b894' : '2px solid #e5e7eb' }} />
                          {m.is_primary && (
                            <span className="badge position-absolute bottom-0 start-0 m-1"
                              style={{ background: '#00b894', fontSize: 9 }}>Primary</span>
                          )}
                          <button type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0"
                            style={{ width: 20, height: 20, fontSize: 10 }}
                            onClick={() => removeExistingImage(m.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <small className="fw-semibold text-muted d-block mb-2">New ({images.length})</small>
                    <div className="d-flex flex-wrap gap-3">
                      {images.map((file, i) => (
                        <div key={i} className="position-relative" style={{ width: 100 }}>
                          <img src={URL.createObjectURL(file)} alt=""
                            className="rounded-3 w-100"
                            style={{ height: 100, objectFit: 'cover',
                              border: i === primaryIdx ? '2px solid #00b894' : '2px solid #e5e7eb' }} />
                          <button type="button"
                            className="btn btn-sm position-absolute bottom-0 start-0 m-1"
                            style={{ fontSize: 9, padding: '1px 4px', borderRadius: 4,
                              background: i === primaryIdx ? '#00b894' : 'rgba(0,0,0,.5)', color: '#fff' }}
                            onClick={() => setPrimaryIdx(i)}>
                            {i === primaryIdx ? '★ Primary' : 'Set'}
                          </button>
                          <button type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0"
                            style={{ width: 20, height: 20, fontSize: 10 }}
                            onClick={() => removeNewImage(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="d-block text-center p-4 rounded-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', cursor: 'pointer' }}
                  htmlFor="prod-images">
                  <div style={{ fontSize: 36 }}>🖼️</div>
                  <div className="fw-semibold mt-1">Click or drag images</div>
                  <small className="text-muted">JPG, PNG, WEBP — max 3MB each</small>
                </label>
                <input type="file" id="prod-images" className="d-none"
                  accept="image/*" multiple onChange={handleImages} />
              </div>
            )}

            {/* SEO */}
            {activeTab === 'seo' && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                <h6 className="fw-bold mb-4">SEO Settings</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Slug</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light" style={{ fontSize: 12 }}>/product/</span>
                    <input type="text" name="slug" className="form-control"
                      value={form.slug} onChange={handleChange} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Title</label>
                  <input type="text" name="meta_title" className="form-control"
                    value={form.meta_title} onChange={handleChange} />
                  <small className="text-muted">{form.meta_title.length}/60</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Description</label>
                  <textarea name="meta_description" rows={3} className="form-control"
                    value={form.meta_description} onChange={handleChange} />
                  <small className="text-muted">{form.meta_description.length}/160</small>
                </div>
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Meta Keywords</label>
                  <input type="text" name="meta_keywords" className="form-control"
                    placeholder="keyword1, keyword2"
                    value={form.meta_keywords} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-12 col-lg-4">

            {/* Publish */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Settings</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">⛔ Inactive</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Currency</label>
                <select name="currency" className="form-select"
                  value={form.currency} onChange={handleChange}>
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (₨)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Sort Order</label>
                <input type="number" name="sort_order" className="form-control"
                  min={0} value={form.sort_order} onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold d-block" style={{ fontSize: 13 }}>Flags</label>
                {[
                  ['is_featured',   '⭐ Featured'],
                  ['is_new',        '🆕 New Arrival'],
                  ['is_bestseller', '🔥 Bestseller'],
                  ['has_variants',  '🎨 Has Variants'],
                ].map(([name, label]) => (
                  <div className="form-check mb-2" key={name}>
                    <input className="form-check-input" type="checkbox"
                      name={name} id={name}
                      checked={form[name]} onChange={handleChange} />
                    <label className="form-check-label" htmlFor={name} style={{ fontSize: 13 }}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                   : saved ? '✅ Saved!'
                   : isEdit ? '💾 Update Product'
                   : '🚀 Create Product'}
                </button>
                <Link to="/admin/products" className="btn btn-outline-secondary">Cancel</Link>
              </div>
            </div>

            {/* Categories */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Additional Categories</h6>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {categories.map(cat => (
                  <div className="form-check mb-1" key={cat.id}>
                    <input className="form-check-input" type="checkbox"
                      id={`cat-${cat.id}`}
                      checked={form.category_ids.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)} />
                    <label className="form-check-label" htmlFor={`cat-${cat.id}`}
                      style={{ fontSize: 13 }}>
                      {cat.parent_id ? `↳ ${cat.name}` : cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Tags</h6>
              <div className="d-flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag.id} type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="btn btn-sm"
                    style={{
                      fontSize: 12, borderRadius: 20,
                      background: form.tag_ids.includes(tag.id) ? '#00b894' : '#f3f4f6',
                      color: form.tag_ids.includes(tag.id) ? '#fff' : '#374151',
                      border: 'none'
                    }}>
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductForm