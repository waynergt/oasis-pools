import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { StickyCTA } from './components/layout/StickyCTA'
import { WhatsAppButton } from './components/layout/WhatsAppButton'
import { TopBar } from './components/layout/TopBar'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { OurWork } from './components/sections/OurWork'
import { Plans } from './components/sections/Plans'
import { ServiceArea } from './components/sections/ServiceArea'
import { Services } from './components/sections/Services'
import { WhyChooseUs } from './components/sections/WhyChooseUs'
import { StructuredData } from './components/StructuredData'

export default function App() {
  return (
    <>
      <div id="top" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <TopBar />
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Plans />
        <OurWork />
        <WhyChooseUs />
        <About />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppButton />
      <StructuredData />
    </>
  )
}
