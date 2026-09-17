import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import attributeService from '../../../services/attributeService'

const INITIAL = {
  name: '', type: 'Select',
  is_filterable: true, is_active: true, sort_order: 0,
}

const VALUE_TEMPLATE = {
  id: null, value: '', color_code: '', sort_order: 0
}

const TYPE_INFO = {
  Select: { icon: '📋', desc: 'Dropdown list — e.g. Size (S, M, L, XL)' },
  Color:  { icon: '🎨', desc: 'Color swatch with hex code — e.g. Red (#FF0000)' },
  Text:   { icon: '✏️', desc: 'Free text input — e.g. Custom text' },
}

function AttributeForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = Boolean(id)

  const [form, setForm]     = useState(INITIAL)
  const [values, setValues] = useState([])
  const [deleteValueIds, setDeleteValueIds] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(isEdit)

  // Load attribute for edit
  useEffect(() => {
    if (!isEdit) return
    attributeService.edit(id)
      .then(res => {
        const a = res.data.data
        setForm({
          name:          a.name || '',
          type:          a.type || 'Select',
          is_filterable: a.is_filterable ?? true,
          is_active:     a.is_active ?? true,
          sort_order:    a.sort_order || 0,
        })
        setValues(a.values?.map(v => ({
          id:         v.id,
          value:      v.value,
          color_code: v.color_code || '',
          sort_order: v.sort_order || 0,
        })) || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Values management
  const addValue = () => {
    setValues(prev => [
      ...prev,
      { ...VALUE_TEMPLATE, sort_order: prev.length }
    ])
  }

  const updateValue = (idx, field, val) => {
    setValues(prev => prev.map((v, i) =>
      i === idx ? { ...v, [field]: val } : v
    ))
  }

  const removeValue = (idx) => {
    const v = values[idx]
    if (v.id) setDeleteValueIds(prev => [...prev, v.id])
    setValues(prev => prev.filter((_, i) => i !== idx))
  }

  const moveValue = (idx, dir) => {
    setValues(prev => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr.map((v, i) => ({ ...v, sort_order: i }))
    })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Attribute name is required'
    if (values.length > 0) {
      values.forEach((v, i) => {
        if (!v.value.trim()) e[`value_${i}`] = 'Value is required'
        if (form.type === 'Color' && v.color_code && !/^#[0-9A-Fa-f]{3,6}$/.test(v.color_code)) {
          e[`color_${i}`] = 'Invalid hex color'
        }
      })
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)

    const payload = {
      ...form,
      is_filterable: form.is_filterable ? 1 : 0,
      is_active:     form.is_active ? 1 : 0,
      values: values.map((v, i) => ({
        ...(v.id ? { id: v.id } : {}),
        value:      v.value,
        color_code: form.type === 'Color' ? (v.color_code || null) : null,
        sort_order: i,
      })),
      ...(isEdit && deleteValueIds.length > 0
        ? { delete_value_ids: deleteValueIds }
        : {}),
    }

    try {
      if (isEdit) await attributeService.update(id, payload)
      else        await attributeService.store(payload)
      setSaved(true)
      setTimeout(() => navigate('/admin/attributes'), 1200)
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

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            {isEdit ? 'Edit Attribute' : 'Add Attribute'}
          </h4>
          <small className="text-muted">
            <Link to="/admin/attributes" style={{ color: '#00b894' }}>Attributes</Link>
            {' / '}{isEdit ? 'Edit' : 'Add New'}
          </small>
        </div>
        <Link to="/admin/attributes" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          ✅ Attribute {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            {/* Basic Info */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Attribute Information</h6>

              {/* Name */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Attribute Name <span className="text-danger">*</span>
                </label>
                <input type="text" name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Size, Color, Material, Weight"
                  value={form.name} onChange={handleChange} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Type Selection */}
              <div className="mb-0">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Attribute Type <span className="text-danger">*</span>
                </label>
                <div className="row g-3">
                  {Object.entries(TYPE_INFO).map(([type, info]) => (
                    <div className="col-12 col-md-4" key={type}>
                      <label
                        className="d-block p-3 rounded-3 cursor-pointer"
                        style={{
                          border: form.type === type
                            ? '2px solid #00b894'
                            : '2px solid #e5e7eb',
                          background: form.type === type ? '#f0fdf4' : '#f9fafb',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                        <input type="radio" name="type" value={type}
                          checked={form.type === type}
                          onChange={handleChange}
                          className="d-none" />
                        <div className="text-center">
                          <div style={{ fontSize: 28 }}>{info.icon}</div>
                          <div className="fw-semibold mt-1" style={{ fontSize: 14 }}>{type}</div>
                          <small className="text-muted" style={{ fontSize: 11 }}>{info.desc}</small>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 className="fw-bold mb-0">
                    Attribute Values
                    {values.length > 0 && (
                      <span className="badge ms-2"
                        style={{ background: '#00b894', fontSize: 12 }}>
                        {values.length}
                      </span>
                    )}
                  </h6>
                  <small className="text-muted">
                    {form.type === 'Color'
                      ? 'Add colors with hex codes'
                      : 'Add options for this attribute'}
                  </small>
                </div>
                <button type="button"
                  className="btn btn-sm text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  onClick={addValue}>
                  + Add Value
                </button>
              </div>

              {values.length === 0 ? (
                <div className="text-center py-4 rounded-3"
                  style={{ background: '#f9fafb', border: '2px dashed #e5e7eb' }}>
                  <div style={{ fontSize: 36 }}>
                    {form.type === 'Color' ? '🎨' : form.type === 'Text' ? '✏️' : '📋'}
                  </div>
                  <p className="text-muted mt-2 mb-3" style={{ fontSize: 13 }}>
                    No values yet. Click "Add Value" to start.
                  </p>
                  <button type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={addValue}>
                    + Add First Value
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {/* Color header */}
                  {form.type === 'Color' && (
                    <div className="row g-2 mb-1 px-2">
                      <div className="col-1" />
                      <div className="col-5">
                        <small className="fw-semibold text-muted" style={{ fontSize: 11 }}>
                          COLOR NAME
                        </small>
                      </div>
                      <div className="col-4">
                        <small className="fw-semibold text-muted" style={{ fontSize: 11 }}>
                          HEX CODE
                        </small>
                      </div>
                      <div className="col-2" />
                    </div>
                  )}

                  {values.map((v, idx) => (
                    <div key={idx}
                      className="d-flex align-items-center gap-2 p-2 rounded-3"
                      style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>

                      {/* Sort buttons */}
                      <div className="d-flex flex-column gap-1">
                        <button type="button"
                          className="btn btn-sm p-0 text-muted"
                          style={{ fontSize: 12, lineHeight: 1, width: 20, height: 18 }}
                          onClick={() => moveValue(idx, -1)}
                          disabled={idx === 0}>▲</button>
                        <button type="button"
                          className="btn btn-sm p-0 text-muted"
                          style={{ fontSize: 12, lineHeight: 1, width: 20, height: 18 }}
                          onClick={() => moveValue(idx, 1)}
                          disabled={idx === values.length - 1}>▼</button>
                      </div>

                      {/* Color preview */}
                      {form.type === 'Color' && (
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          background: v.color_code || '#e5e7eb',
                          border: '2px solid rgba(0,0,0,.1)'
                        }} />
                      )}

                      {/* Value input */}
                      <div className="flex-fill">
                        <input type="text"
                          className={`form-control form-control-sm ${errors[`value_${idx}`] ? 'is-invalid' : ''}`}
                          placeholder={
                            form.type === 'Color'  ? 'Color name (e.g. Red, Sky Blue)' :
                            form.type === 'Select' ? 'Option (e.g. Small, Medium, Large)' :
                            'Value'
                          }
                          value={v.value}
                          onChange={e => updateValue(idx, 'value', e.target.value)} />
                        {errors[`value_${idx}`] && (
                          <div className="text-danger" style={{ fontSize: 11, marginTop: 2 }}>
                            {errors[`value_${idx}`]}
                          </div>
                        )}
                      </div>

                      {/* Color code input */}
                      {form.type === 'Color' && (
                        <div style={{ width: 130, flexShrink: 0 }}>
                          <div className="input-group input-group-sm">
                            <input type="color"
                              className="form-control form-control-sm p-0"
                              style={{ width: 34, cursor: 'pointer' }}
                              value={v.color_code || '#000000'}
                              onChange={e => updateValue(idx, 'color_code', e.target.value)} />
                            <input type="text"
                              className={`form-control form-control-sm ${errors[`color_${idx}`] ? 'is-invalid' : ''}`}
                              placeholder="#FF0000"
                              value={v.color_code}
                              onChange={e => updateValue(idx, 'color_code', e.target.value)} />
                          </div>
                          {errors[`color_${idx}`] && (
                            <div className="text-danger" style={{ fontSize: 11 }}>
                              {errors[`color_${idx}`]}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Remove */}
                      <button type="button"
                        className="btn btn-sm btn-outline-danger flex-shrink-0"
                        style={{ width: 32, height: 32, padding: 0 }}
                        onClick={() => removeValue(idx)}>✕</button>
                    </div>
                  ))}

                  {/* Add more button */}
                  <button type="button"
                    className="btn btn-outline-secondary btn-sm mt-2"
                    style={{ borderStyle: 'dashed', borderRadius: 8 }}
                    onClick={addValue}>
                    + Add Another Value
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">

            {/* Settings */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-4">Settings</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                  Sort Order
                </label>
                <input type="number" name="sort_order" className="form-control"
                  min={0} value={form.sort_order} onChange={handleChange} />
                <small className="text-muted">Lower = shown first</small>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox"
                  name="is_active" id="is_active"
                  checked={form.is_active} onChange={handleChange} />
                <label className="form-check-label fw-semibold" htmlFor="is_active"
                  style={{ fontSize: 13 }}>
                  ✅ Active
                  <small className="text-muted d-block fw-normal">
                    Visible to customers
                  </small>
                </label>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox"
                  name="is_filterable" id="is_filterable"
                  checked={form.is_filterable} onChange={handleChange} />
                <label className="form-check-label fw-semibold" htmlFor="is_filterable"
                  style={{ fontSize: 13 }}>
                  🔍 Filterable
                  <small className="text-muted d-block fw-normal">
                    Show in catalog filter sidebar
                  </small>
                </label>
              </div>

              <div className="d-grid gap-2">
                <button type="submit"
                  className="btn text-white fw-semibold"
                  style={{ background: '#00b894', borderRadius: 8 }}
                  disabled={saving || saved}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : saved   ? '✅ Saved!'
                    : isEdit  ? '💾 Update Attribute'
                    : '🚀 Create Attribute'}
                </button>
                <Link to="/admin/attributes" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </div>

            {/* Type Preview */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-3">Preview</h6>
              <small className="text-muted d-block mb-3">
                How customers will see this attribute:
              </small>

              {values.length === 0 ? (
                <small className="text-muted">Add values to see preview</small>
              ) : form.type === 'Color' ? (
                <div>
                  <small className="fw-semibold d-block mb-2" style={{ fontSize: 12 }}>
                    {form.name || 'Attribute'}
                  </small>
                  <div className="d-flex flex-wrap gap-2">
                    {values.map((v, i) => (
                      <div key={i} title={v.value}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: v.color_code || '#e5e7eb',
                          border: '2px solid rgba(0,0,0,.1)',
                          cursor: 'pointer'
                        }} />
                        <small className="d-block text-center text-muted"
                          style={{ fontSize: 10, marginTop: 2 }}>
                          {v.value.slice(0, 6)}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              ) : form.type === 'Select' ? (
                <div>
                  <small className="fw-semibold d-block mb-2" style={{ fontSize: 12 }}>
                    {form.name || 'Attribute'}
                  </small>
                  <div className="d-flex flex-wrap gap-2">
                    {values.map((v, i) => (
                      <span key={i} className="badge px-3 py-2"
                        style={{
                          background: i === 0 ? '#00b894' : '#f3f4f6',
                          color: i === 0 ? '#fff' : '#374151',
                          fontSize: 12, borderRadius: 6,
                          border: '1px solid #e5e7eb'
                        }}>
                        {v.value}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <small className="fw-semibold d-block mb-2" style={{ fontSize: 12 }}>
                    {form.name || 'Attribute'}
                  </small>
                  <input type="text" className="form-control form-control-sm"
                    placeholder="Customer types here..." readOnly />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AttributeForm