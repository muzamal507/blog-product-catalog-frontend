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

import AdminContactMessages from '../pages/admin/ContactMessages'
import AdminSettings from '../pages/admin/Settings'

import AdminSliders from '../pages/admin/Sliders'
import SliderForm from '../pages/admin/Sliders/SliderForm'

import AdminNewsletter from '../pages/admin/Newsletter'
import SendNewsletter from '../pages/admin/Newsletter/SendNewsletter'

// Blog Categories
import AdminBlogCategories from '../pages/admin/BlogCategories'
import BlogCategoryForm    from '../pages/admin/BlogCategories/CategoryForm'
import BlogCategoryTrash   from '../pages/admin/BlogCategories/CategoryTrash'

// Blog Tags
import AdminBlogTags from '../pages/admin/BlogTags'
import TagForm       from '../pages/admin/BlogTags/TagForm'
import TagTrash      from '../pages/admin/BlogTags/TagTrash'

// Pages
import AdminPages from '../pages/admin/Pages'
import PageForm   from '../pages/admin/Pages/PageForm'
import PageTrash  from '../pages/admin/Pages/PageTrash'

import AdminNotFound from '../pages/admin/NotFound'

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

                    <Route path="contact-messages" element={<AdminContactMessages />} />
                    <Route path="settings" element={<AdminSettings />} />

                    <Route path="sliders" element={<AdminSliders />} />
                    <Route path="sliders/add" element={<SliderForm />} />
                    <Route path="sliders/edit/:id" element={<SliderForm />} />

                    <Route path="newsletter" element={<AdminNewsletter />} />
                    <Route path="newsletter/send" element={<SendNewsletter />} />

                    // Blog Categories
                    <Route path="blog-categories" element={<AdminBlogCategories />} />
                    <Route path="blog-categories/add" element={<BlogCategoryForm />} />
                    <Route path="blog-categories/edit/:id" element={<BlogCategoryForm />} />
                    <Route path="blog-categories/trash" element={<BlogCategoryTrash />} />

                    // Blog Tags
                    <Route path="blog-tags" element={<AdminBlogTags />} />
                    <Route path="blog-tags/edit/:id" element={<TagForm />} />
                    <Route path="blog-tags/trash" element={<TagTrash />} />

                    // Pages
                    <Route path="pages" element={<AdminPages />} />
                    <Route path="pages/add" element={<PageForm />} />
                    <Route path="pages/edit/:id" element={<PageForm />} />
                    <Route path="pages/trash" element={<PageTrash />} />

                    <Route path="*" element={<AdminNotFound />} />

                </Route>
            </Route>

        </Routes>
    )
}

export default AdminRoutes