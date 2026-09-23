import React from 'react'
import HeroSection        from './HeroSection'
import FeaturedCategories from './FeaturedCategories'
import FeaturedProducts   from './FeaturedProducts'
import Guarantees         from './Guarantees'
import Testimonials       from './Testimonials'
import Newsletter         from './Newsletter'
import NewArrivals        from './NewArrivals'

function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewArrivals />
      <Guarantees />
      <Testimonials />
      <Newsletter />
    </>
  )
}

export default Home