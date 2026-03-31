import { useState } from 'react'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <LoadingScreen onComplete={() => setReady(true)} />
      {ready && (
        <>
          <ScrollProgress />
          <Navbar />
          <main>
            <HeroSection ready={ready} />
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <TimelineSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
