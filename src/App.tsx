import { useEffect } from 'react'
import { Route, Switch, Router, useLocation } from 'wouter'
import Seo from './components/Seo'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieNotice from './components/CookieNotice'
import MobileMenuBar from './components/MobileMenuBar'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useParallax } from './hooks/useParallax'
import Home from './pages/Home'
import Menu from './pages/Menu'
import FoodTrucks from './pages/FoodTrucks'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Accessibility from './pages/Accessibility'
import NotFound from './pages/NotFound'

function Shell() {
  const [location] = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  useScrollReveal(location)
  useParallax(location)

  return (
    <>
      <Seo path={location} />
      <Navbar />
      <main id="main-content">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/food-trucks" component={FoodTrucks} />
          <Route path="/about" component={About} />
          <Route path="/careers" component={Careers} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/accessibility" component={Accessibility} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileMenuBar />
      <CookieNotice />
    </>
  )
}

export default function App({ ssrPath }: { readonly ssrPath?: string }) {
  return (
    <Router ssrPath={ssrPath}>
      <Shell />
    </Router>
  )
}
