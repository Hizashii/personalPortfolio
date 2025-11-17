import React, { Suspense, lazy } from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'

// Lazy load sections below the fold
const ServiceSummary = lazy(() => import('./sections/ServiceSummary'))
const Services = lazy(() => import('./sections/Services'))
const About = lazy(() => import('./sections/About'))
const Works = lazy(() => import('./sections/Works'))
const Contact = lazy(() => import('./sections/Contact'))

const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
)

const App = () => {
  return (
    <div className='relative w-screen min-h-screen overflow-x-hidden'>
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <ServiceSummary />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Works />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </div>
  )
}

export default App