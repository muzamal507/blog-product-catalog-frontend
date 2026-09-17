import React from 'react'
import { Routes, Route } from 'react-router-dom'

import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'

// Admin Pages
import AdminLogin from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import Categories from '../pages/admin/Categories'

import AdminBrands from '../pages/admin/Brands'
import BrandForm from '../pages/admin/Brands/BrandForm'
import BrandTrash from '../pages/admin/Brands/BrandTrash'

import AdminCategories from '../pages/admin/ProductCategories'
import CategoryForm from '../pages/admin/ProductCategories/CategoryForm'
import CategoryTrash from '../pages/admin/ProductCategories/CategoryTrash'

import AdminAttributes from '../pages/admin/Attributes'
import AttributeForm from '../pages/admin/Attributes/AttributeForm'
import AttributeTrash from '../pages/admin/Attributes/AttributeTrash'

import AdminProducts from '../pages/admin/Products'
import ProductForm from '../pages/admin/Products/ProductForm'
import ProductTrash from '../pages/admin/Products/ProductTrash'

import Orders from '../pages/admin/Orders'
import OrderDetail from '../pages/admin/Orders/OrderDetail'
import AdminOrders  from '../pages/admin/Orders'
import CreateOrder  from '../pages/admin/Orders/CreateOrder'

import Blogs from '../pages/admin/Blogs'
import AddBlog from '../pages/admin/Blogs/AddBlog'

import AdminTestimonials from '../pages/admin/Testimonials'
import TestimonialForm from '../pages/admin/Testimonials/TestimonialForm'
import TestimonialTrash from '../pages/admin/Testimonials/TestimonialTrash'


function AdminRoutes() {
    return (
        <Routes>

                // LOGIN
            <Route element={<AuthLayout />}>
                <Route path="login" element={<AdminLogin />} />
            </Route>

                // PROTECTED ADMIN ROUTES
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>

                    {/* Dashboard */}
                    <Route index element={<Dashboard />} />

                        // PRODUCTS
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="products/trash" element={<ProductTrash />} />

                        {/* CATEGORIES */}
                    <Route path="categories" element={<Categories />} />

                        {/* ORDERS */}
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />

                        {/* BLOGS */}
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="blogs/add" element={<AddBlog />} />

                        {/* BRANDS */}
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="brands/add" element={<BrandForm />} />
                    <Route path="brands/edit/:id" element={<BrandForm />} /> 
                    <Route path="brands/trash" element={<BrandTrash />} />

                        {/* PRODUCT CATEGORIES */}
                    <Route path="product-categories" element={<AdminCategories />} />
                    <Route path="product-categories/add" element={<CategoryForm />} />
                    <Route path="product-categories/edit/:id" element={<CategoryForm />} />
                    <Route path="product-categories/trash" element={<CategoryTrash />} />

                        {/* ATTRIBUTES */}
                    <Route path="attributes" element={<AdminAttributes />} />
                    <Route path="attributes/add" element={<AttributeForm />} />
                    <Route path="attributes/edit/:id" element={<AttributeForm />} />
                    <Route path="attributes/trash" element={<AttributeTrash />} />

                        {/* TESTIMONIALS */}
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="testimonials/add" element={<TestimonialForm />} />
                    <Route path="testimonials/edit/:id" element={<TestimonialForm />} />
                    <Route path="testimonials/trash" element={<TestimonialTrash />} />

                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/create" element={<CreateOrder />} />
                    <Route path="orders/:id" element={<OrderDetail />} />

                </Route>
            </Route>

        </Routes>
    )
}

export default AdminRoutes