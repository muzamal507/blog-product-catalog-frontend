import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'

import Home           from '../pages/public/Home'
import Catalog        from '../pages/public/Catalog'
import ProductDetail  from '../pages/public/ProductDetail'
import CategoriesPage from '../pages/public/Categories'
import BrandsPage     from '../pages/public/Brands'
import TestimonialsPage from '../pages/public/Testimonials'
import Cart           from '../pages/public/Cart'
import Checkout       from '../pages/public/Checkout'
import Blogs          from '../pages/public/Blogs'
import BlogDetail     from '../pages/public/Blogs/BlogDetail'
import NotFound       from '../pages/public/NotFound'
import Contact        from '../pages/public/Contact'
import AboutPage      from '../pages/public/About'
import PublicPage     from '../pages/public/Page'

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<AboutPage />}   />
        <Route path="page/:slug" element={<PublicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default PublicRoutes