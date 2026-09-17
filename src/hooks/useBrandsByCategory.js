import { useState, useEffect } from 'react'
import brandService from '../services/brandService'

function useBrandsByCategory(categoryId) {
  const [brands, setBrands]     = useState([])
  const [loading, setLoading]   = useState(false)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    // Category select nahi hua toh reset
    if (!categoryId) {
      setBrands([])
      setCategory(null)
      return
    }

    setLoading(true)
    brandService.getByCategoryId(categoryId)
      .then(res => {
        setBrands(res.data.data || [])
        setCategory(res.data.category || null)
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false))
  }, [categoryId])

  return { brands, loading, category }
}

export default useBrandsByCategory