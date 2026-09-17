import React from 'react'
import HeroSection from './HeroSection'
import FeaturedCategories from './FeaturedCategories'
import FeaturedProducts from './FeaturedProducts'
import Guarantees from './Guarantees'
import Testimonials from './Testimonials'
import Newsletter from './Newsletter'

function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <Guarantees />
      <Testimonials />
      <Newsletter />
    </>
  )
}

export default Home