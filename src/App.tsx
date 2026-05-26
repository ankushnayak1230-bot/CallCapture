import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import { CheckCircle2, Calendar, Globe } from 'lucide-react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import TranscriptsPage from './pages/TranscriptsPage'
import './App.css'

export type Region = 'global' | 'india'
export const RegionContext = createContext<{ region: Region; setRegion: (r: Region) => void }>({
  region: 'global',
  setRegion: () => {},
})
export const useRegion = () => useContext(RegionContext)

// Custom hook for animations
function useInViewAnimation() {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref) {
      observer.observe(ref)
    }

    return () => observer.disconnect()
  }, [ref])

  return { ref: setRef as React.Dispatch<React.SetStateAction<HTMLElement | null>>, isVisible }
}

// Animated Counter Component
function AnimatedNumber({ value }: { value: number }) {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString())

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  return <motion.span>{displayValue}</motion.span>
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { region, setRegion } = useRegion()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    if (pathname !== '/') {
      navigate('/#' + id)
      setIsMobileMenuOpen(false)
      return
    }

    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  // Handle hash scroll after navigation
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const id = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          const offset = 80
          const bodyRect = document.body.getBoundingClientRect().top
          const elementRect = element.getBoundingClientRect().top
          const elementPosition = elementRect - bodyRect
          const offsetPosition = elementPosition - offset
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [pathname])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              <span className="text-emerald-600">Call</span>Capture
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Technology', id: 'tech' },
              { name: 'How It Works', id: 'how-it-works' },
              { name: 'Industries', id: 'industries' },
              { name: 'Results', id: 'results' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {item.name}
              </button>
            ))}
            <Link
              to="/transcripts"
              className={`font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
            >
              Examples
            </Link>
            
            <button
              onClick={() => setRegion(region === 'global' ? 'india' : 'global')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                isScrolled 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Globe className="w-4 h-4" />
              {region === 'global' ? 'USD' : 'INR'}
            </button>

            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30"
            >
              Get Free Demo
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className={`w-7 h-7 ${isScrolled ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="md:hidden mt-4 pb-6 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col space-y-1 p-2">
                {[
                  { name: 'Technology', id: 'tech' },
                  { name: 'How It Works', id: 'how-it-works' },
                  { name: 'Industries', id: 'industries' },
                  { name: 'Results', id: 'results' },
                  { name: 'Get Started', id: 'contact' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-6 py-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-semibold transition-all"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
// Industry Chat Data for Marquee
const industryChats = [
  {
    business: "Rodriguez Plumbing",
    initials: "RP",
    messages: [
      { role: "AI", text: "Thank you for calling Rodriguez Plumbing. How can I help you today?" },
      { role: "User", text: "Hi, I have a burst pipe. It's an emergency!", userInitials: "JC" },
      { role: "AI", text: "I understand this is urgent. Let me connect you with Mike right away. I've sent him an SMS with your location." }
    ],
    status: "Emergency dispatched to Mike"
  },
  {
    business: "Sterling Law Group",
    initials: "SL",
    messages: [
      { role: "AI", text: "Good afternoon, Sterling Law Group. How may I direct your call?" },
      { role: "User", text: "I was in an accident and need to speak with an attorney.", userInitials: "DK" },
      { role: "AI", text: "I'm sorry to hear that. I can schedule a free consultation with Mr. Sterling for tomorrow at 10 AM. Does that work?" }
    ],
    status: "Consultation booked for tomorrow"
  },
  {
    business: "Bay Area HVAC",
    initials: "BA",
    messages: [
      { role: "AI", text: "Bay Area HVAC, this is your AI assistant. How can we help you stay cool?" },
      { role: "User", text: "My AC just stopped working and it's 90 degrees!", userInitials: "MW" },
      { role: "AI", text: "That sounds uncomfortable. Our technician is nearby and can be there within 45 minutes. Should I book him?" }
    ],
    status: "Technician ETA: 45 minutes"
  },
  {
    business: "Apex Roofing",
    initials: "AR",
    messages: [
      { role: "AI", text: "Thank you for calling Apex Roofing. Are you calling about storm damage?" },
      { role: "User", text: "Yes, I have a leak in my living room ceiling.", userInitials: "LM" },
      { role: "AI", text: "I've flagged this as high priority. Our inspector will call you in 5 minutes to assess the damage." }
    ],
    status: "Priority inspection triggered"
  },
  {
    business: "Metro Medical Center",
    initials: "MM",
    messages: [
      { role: "AI", text: "Metro Medical, how can I assist with your appointment today?" },
      { role: "User", text: "I need to reschedule my physical for next Tuesday.", userInitials: "SH" },
      { role: "AI", text: "No problem. I've updated your appointment to Tuesday at 2 PM. You'll receive a text confirmation shortly." }
    ],
    status: "Appointment updated successfully"
  },
  {
    business: "SmileCare Dental",
    initials: "SD",
    messages: [
      { role: "AI", text: "Welcome to SmileCare Dental. How can we make you smile today?" },
      { role: "User", text: "I have a terrible toothache and need to see a dentist immediately.", userInitials: "VJ" },
      { role: "AI", text: "I'm so sorry you're in pain. We have an emergency slot available at 4 PM today with Dr. Mehra. Would you like me to book it for you?" }
    ],
    status: "Emergency dental slot booked"
  },
  {
    business: "Sparky's Electrical",
    initials: "SE",
    messages: [
      { role: "AI", text: "Sparky's Electrical. Do you have a power emergency?" },
      { role: "User", text: "My breaker keeps tripping and I smell something burning.", userInitials: "BT" },
      { role: "AI", text: "Please step away from the panel. I'm dispatching our emergency electrician right now. He's 10 minutes away." }
    ],
    status: "Emergency electrician dispatched"
  }
]

const indiaDentalChats = [
  {
    business: "Dr. Sharma's Dental Clinic",
    initials: "DS",
    messages: [
      { role: "AI", text: "Namaste! Dr. Sharma's Dental Clinic. How can I help you today?" },
      { role: "User", text: "Hi, I have a really bad toothache. Can I get an emergency appointment?", userInitials: "PK" },
      { role: "AI", text: "I'm sorry to hear that. Dr. Sharma has an emergency slot available at 5:30 PM today. The consultation fee is ₹500. Shall I book it?" }
    ],
    status: "Emergency appointment booked for 5:30 PM"
  },
  {
    business: "Smile Studio Dental",
    initials: "SS",
    messages: [
      { role: "AI", text: "Welcome to Smile Studio Dental. How may I assist you?" },
      { role: "User", text: "I want to inquire about teeth whitening and the cost.", userInitials: "AR" },
      { role: "AI", text: "Of course! Our professional teeth whitening starts at ₹8,000. I can schedule a free consultation with Dr. Patel. Would Tuesday at 11 AM work?" }
    ],
    status: "Whitening consultation booked"
  },
  {
    business: "DentCare Multi-Speciality",
    initials: "DC",
    messages: [
      { role: "AI", text: "DentCare Multi-Speciality Clinic. How can we help you?" },
      { role: "User", text: "My son needs braces. What are the options and cost?", userInitials: "MG" },
      { role: "AI", text: "We offer metal braces starting at ₹25,000 and ceramic braces from ₹40,000. Dr. Kapoor is our orthodontist. I can book an evaluation for this Saturday. Works for you?" }
    ],
    status: "Orthodontic evaluation scheduled"
  },
  {
    business: "Pearl Dental Academy",
    initials: "PD",
    messages: [
      { role: "AI", text: "Pearl Dental Academy, good morning! How can I help?" },
      { role: "User", text: "I need a root canal. I'm in a lot of pain right now.", userInitials: "SV" },
      { role: "AI", text: "I understand the urgency. Dr. Reddy can see you today at 3 PM. The root canal treatment costs approximately ₹5,000-₹8,000 depending on the tooth. Shall I confirm?" }
    ],
    status: "Root canal appointment confirmed"
  },
  {
    business: "Gupta Dental Hospital",
    initials: "GD",
    messages: [
      { role: "AI", text: "Gupta Dental Hospital, this is your AI receptionist. How may I help?" },
      { role: "User", text: "I want to get dental implants done. Can you tell me the process?", userInitials: "RK" },
      { role: "AI", text: "Absolutely! Our implant packages start from ₹25,000 per tooth. First, we need a CBCT scan and consultation with Dr. Gupta. I can book you for tomorrow at 10 AM. Would that work?" }
    ],
    status: "Implant consultation booked"
  }
]

function HeroChatCard({ chat }: { chat: typeof industryChats[0] }) {
  return (
    <div className="flex-shrink-0 w-[450px] sm:w-[550px] bg-gradient-to-br from-gray-800/90 to-gray-900 rounded-3xl p-8 mx-6 shadow-2xl border border-gray-700/50 backdrop-blur-md relative group">
      {/* Window Controls */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
        <div className="ml-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">{chat.business}</div>
      </div>
      
      <div className="space-y-4">
        {chat.messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === "User" ? "justify-end" : ""}`}>
            {msg.role === "AI" && (
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-emerald-500/20">
                {chat.initials}
              </div>
            )}
            <div className={`${
              msg.role === "User" 
                ? "bg-emerald-600 rounded-tr-none shadow-sm" 
                : "bg-gray-700/80 rounded-tl-none border border-gray-600/50 shadow-sm"
            } rounded-2xl px-4 py-3`}>
              <p className={`text-sm leading-relaxed ${msg.role === "User" ? "text-white" : "text-gray-100"}`}>
                {msg.text}
              </p>
            </div>
            {msg.role === "User" && (
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                {msg.userInitials}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex items-center gap-2 text-emerald-400 text-xs pt-4 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          {chat.status}
        </div>
      </div>
    </div>
  )
}

function ChatMarquee() {
  const marqueeData = [...industryChats, ...industryChats] // Duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden py-10">
      <motion.div
        animate={{
          x: [0, "-50%"],
        }}
        transition={{
          duration: 80, // Much slower
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-8 px-4"
        style={{ width: "max-content" }}
      >
        {marqueeData.map((chat, idx) => (
          <HeroChatCard key={idx} chat={chat} />
        ))}
      </motion.div>
    </div>
  )
}

function HeroCyclingCards() {
  const { region } = useRegion()
  const chats = region === 'india' ? indiaDentalChats : industryChats
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0) // Reset when region changes
  }, [region])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % chats.length)
    }, 5000) // Stay for 5 seconds
    return () => clearInterval(timer)
  }, [chats.length])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            opacity: { duration: 0.4 }
          }}
          className="relative"
        >
          {/* Subtle Glow behind the active card */}
          <div className="absolute -inset-10 bg-emerald-500/15 blur-[80px] rounded-full"></div>
          <HeroChatCard chat={chats[index]} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Hero Section
function HeroSection() {
  const { region } = useRegion()
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/14/57/6d/69/70/v1_E10/E109CIBF.jpg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=393&s=65a3dd42f601b4173656381cb279ddbcb2ba604fb4662e6768d2c9af287167f9"
          alt="Business team"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-emerald-900/80"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-emerald-600/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-emerald-300 text-sm font-medium">The Future of Voice AI</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Never Miss Another Call.
              <span className="block text-emerald-400">Capture Every Opportunity.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-8 max-w-xl"
            >
              {region === 'india' 
                ? <>Your AI-powered phone receptionist answers every patient call, 24/7. Books appointments in Hindi & English, handles emergencies, and sends instant alerts. <span className="text-white font-semibold">Grow your dental practice while you focus on patients.</span></>
                : <>Your AI-powered phone receptionist answers every call, 24/7. Professional conversations, automatic appointment booking, and instant alerts. <span className="text-white font-semibold">Grow your revenue while you sleep.</span></>
              }
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all"
              >
                Get Your Free Demo
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                See How It Works
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-8"
            >
              {[
                { label: '24/7', sub: 'Reliable Coverage' },
                { label: 'Zero', sub: 'Missed Calls' },
                { label: '<300ms', sub: 'Response Time' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-8">
                  <div>
                    <div className="text-3xl font-bold text-white">{stat.label}</div>
                    <div className="text-gray-400 text-sm">{stat.sub}</div>
                  </div>
                  {i < 2 && <div className="w-px h-12 bg-gray-700"></div>}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block relative min-h-[500px]"
          >
            <HeroCyclingCards />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

// Social Proof Bar
function SocialProofBar() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">24/7/365</div>
            <div className="text-gray-600">Reliable Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">Zero</div>
            <div className="text-gray-600">Missed Opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">&lt;300ms</div>
            <div className="text-gray-600">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-gray-600">Human-Like Voice</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Technology Partner Section
function TechnologySection() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2 mb-4"
          >
            <span className="text-emerald-700 text-sm font-medium">Powered by Industry-Leading Technology</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Voice AI Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our state-of-the-art voice AI delivers the most natural, human-like conversations possible. Callers feel like they're speaking with a real person.
          </p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              title: 'Ultra-Low Latency', 
              desc: 'Lightning-fast responses under 300ms so callers never feel they\'re talking to a machine.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            },
            { 
              title: 'Enterprise Grade', 
              desc: 'Built on proven infrastructure with 99.9% uptime guarantee and bank-level security.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            },
            { 
              title: 'Natural Conversations', 
              desc: 'Advanced AI that understands Hindi, Hinglish, and regional accents perfectly.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// Problem Section
function ProblemSection() {
  const { region } = useRegion()
  const lostRevenueRange = region === 'global' ? '$6,000-10,000' : '₹50,000 - ₹1,50,000'
  const lostRevenueTotal = region === 'global' ? '$72,000+' : '₹12,00,000+'

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Hidden Revenue Leak Costing You Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every missed call is a customer lost to your competitor. Here's what it's really costing your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -30 },
              show: {
                opacity: 1,
                x: 0,
                transition: { staggerChildren: 0.15 }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {(region === 'india' ? [
              { 
                color: 'red', 
                title: '45% of patient calls go unanswered during procedures', 
                desc: 'When the dentist and staff are busy with patients, phone calls ring out. Those patients call the next clinic.' 
              },
              { 
                color: 'orange', 
                title: 'Average dental clinic misses 10-15 calls per day', 
                desc: 'That\'s 300+ potential patients lost every single month to your competitors nearby.' 
              },
              { 
                color: 'yellow', 
                title: `${lostRevenueRange} in lost revenue monthly`, 
                desc: 'From unanswered patient calls — cleanings, RCTs, implants, and cosmetic procedures all walking away.' 
              }
            ] : [
              { 
                color: 'red', 
                title: '62% of callers hang up and call your competitor', 
                desc: 'They won\'t wait for voicemail. They move on to the next business on their list.' 
              },
              { 
                color: 'orange', 
                title: 'Average business misses 20-30 calls per week', 
                desc: 'That adds up to 1,000+ missed opportunities every single year.' 
              },
              { 
                color: 'yellow', 
                title: `${lostRevenueRange} in lost revenue monthly`, 
                desc: 'From unanswered calls alone. It compounds month after month.' 
              }
            ]).map((item, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                className={`bg-gray-50 rounded-2xl p-6 border-l-4 border-${item.color}-500`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-6 h-6 text-${item.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.color === 'red' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {item.color === 'orange' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {item.color === 'yellow' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-6">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-6xl font-bold text-red-600 mb-2"
                >
                  {lostRevenueTotal}
                </motion.div>
                <div className="text-gray-600">Lost revenue per year</div>
              </div>
              <div className="text-center text-sm text-gray-500">
                Based on average missed calls × average job value
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-emerald-600 font-semibold text-center">
                  There's a better way
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Solution Section
function SolutionSection() {
  const benefits = [
    { icon: 'clock', title: '24/7/365 Coverage', desc: 'Never miss a call — day, night, weekends, or holidays' },
    { icon: 'zap', title: 'Answers in 2 Rings', desc: 'Instant response every time, zero waiting' },
    { icon: 'user', title: 'Natural Voice', desc: 'Callers can\'t tell it\'s AI — conversations feel completely real' },
    { icon: 'calendar', title: 'Books Appointments', desc: 'Schedules directly into your calendar system' },
    { icon: 'message', title: 'Instant SMS Alerts', desc: 'Get notified the moment a call comes in' },
    { icon: 'shield', title: 'Always Consistent', desc: 'Professional quality on every single call' },
  ]

  return (
    <section className="py-24 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-emerald-600/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">The Solution</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Your AI Receptionist That Never Sleeps
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A professional phone system that answers every call, books appointments, and keeps your customers happy — day or night.
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.05, 
                borderColor: "rgba(16, 185, 129, 0.5)",
                backgroundColor: "rgba(31, 41, 55, 0.8)"
              }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {benefit.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {benefit.icon === 'zap' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                  {benefit.icon === 'user' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                  {benefit.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  {benefit.icon === 'message' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                  {benefit.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Discovery Call',
      desc: 'We analyze your call volume, identify missed opportunities, and map out your potential ROI.',
      time: '30 minutes',
    },
    {
      number: '02',
      title: 'Custom Build',
      desc: 'We craft your AI receptionist with your services, pricing, hours, and preferred voice.',
      time: '2-3 days',
    },
    {
      number: '03',
      title: 'Go Live',
      desc: 'Your AI starts answering calls immediately. You get SMS notifications for every interaction.',
      time: 'Same day',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Live in 48 Hours. Zero Hassle.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is simple. Your AI receptionist will be answering calls within two days.
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.25 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 origin-left"
          ></motion.div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 h-full hover:shadow-xl transition-all border border-transparent hover:border-emerald-100">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.2 }}
                  className="text-6xl font-bold text-emerald-100 mb-4"
                >
                  {step.number}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.desc}</p>
                <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {step.time}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-emerald-600/30"
              >
              Schedule Your Free Discovery Call
            </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Industries Section with detailed case studies
function IndustriesSection() {
  const [selectedIndustry, setSelectedIndustry] = useState(0)
  const { region } = useRegion()

  const getResults = (industry: string) => {
    switch(industry) {
      case 'Plumbers':
        return region === 'global' 
          ? ['+12 jobs/month per tech', '$6,500+ additional revenue', '100% emergency response rate']
          : ['+12 jobs/month per tech', '₹5,00,000+ additional revenue', '100% emergency response rate']
      case 'HVAC Contractors':
        return region === 'global'
          ? ['+18 service calls/week captured', '$9,000+ additional monthly revenue', '94% call capture rate']
          : ['+18 service calls/week captured', '₹7,50,000+ additional monthly revenue', '94% call capture rate']
      case 'Electricians':
        return region === 'global'
          ? ['+12 emergency calls/month', '$5,200+ additional revenue', 'Zero safety incidents missed']
          : ['+12 emergency calls/month', '₹4,00,000+ additional revenue', 'Zero safety incidents missed']
      case 'Roofers':
        return region === 'global'
          ? ['70% more storm jobs captured', '12 new insurance claims/month', '$12,000+ additional revenue']
          : ['70% more storm jobs captured', '12 new insurance claims/month', '₹10,00,000+ additional revenue']
      case 'General Contractors':
        return region === 'global'
          ? ['+4 major projects/quarter', '$80,000+ additional revenue', 'Better qualified leads']
          : ['+4 major projects/quarter', '₹65,00,000+ additional revenue', 'Better qualified leads']
      case 'Law Firms':
        return region === 'global'
          ? ['+12 qualified leads/month', '3 new cases signed', '$150,000+ in new business']
          : ['+12 qualified leads/month', '3 new cases signed', '₹1,20,00,000+ in new business']
      default: return []
    }
  }

  const globalIndustries = [
    {
      name: 'Plumbers',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80',
      challenge: 'High-urgent leak calls often come in while technicians are driving or on jobs. Voicemail means losing the job.',
      solution: 'AI screens for emergencies (burst pipes, flooding) and books service calls immediately based on location.',
      results: getResults('Plumbers'),
      testimonial: '"We captured 3 major burst pipe jobs in our first week that would have definitely gone to voicemail otherwise."',
      name2: 'Juan Rodriguez',
      company: 'Rodriguez Plumbing, Hayward CA'
    },
    {
      name: 'HVAC Contractors',
      image: 'https://www.neit.edu/wp-content/uploads/2021/06/How-to-be-HVAC-Technician-scaled.jpg',
      challenge: 'Summer heat waves bring a flood of calls. Being on a job means missing other potential customers.',
      solution: 'AI answers every call while you\'re on other jobs, qualifying urgency and booking service appointments.',
      results: getResults('HVAC Contractors'),
      testimonial: '"We went from 45% to 94% call capture during our busiest season. The AI paid for itself in the first week."',
      name2: 'James Wilson',
      company: 'Bay Area Heating & Cooling'
    },
    {
      name: 'Electricians',
      image: 'https://lirp.cdn-website.com/22fd6f6b/dms3rep/multi/opt/Commercial+electrical+services-4bd0c018-640w.jpg',
      challenge: 'Electrical emergencies can\'t wait. Code violations and safety issues require immediate response.',
      solution: 'Priority emergency routing with instant SMS alerts. Potential legal liability issues flagged automatically.',
      results: getResults('Electricians'),
      testimonial: '"Safety calls go straight to me now. The AI asks the right questions to assess urgency."',
      name2: 'Robert Martinez',
      company: 'Martinez Electric, San Jose CA'
    },
    {
      name: 'Roofers',
      image: '/roofer.png',
      challenge: 'Storm damage creates massive call spikes. Insurance claims require quick response to get ahead.',
      solution: 'AI handles post-storm volume surge, gathering insurance details and scheduling assessments.',
      results: getResults('Roofers'),
      testimonial: '"After the last hailstorm, we were first to respond because we answered every call. Our competitors were still checking voicemail."',
      name2: 'Tom Bradley',
      company: 'Bradley Roofing, Oakland CA'
    },
    {
      name: 'General Contractors',
      image: 'https://contractorslicensingschools.com/blog/wp-content/uploads/2024/11/contractor-agc-advantage.jpg',
      challenge: 'Project inquiries require careful qualification. Estimate requests need proper intake to prioritize.',
      solution: 'AI qualifies leads based on project scope, timeline, and budget, booking consultations directly.',
      results: getResults('General Contractors'),
      testimonial: '"I was skeptical about AI, but customers can\'t tell the difference. The AI books consultations while I\'m on job sites."',
      name2: 'Sarah Chen',
      company: 'Chen Construction, Oakland CA'
    },
    {
      name: 'Law Firms',
      image: 'https://static1.gensler.com/uploads/hero_element/22911/thumb_desktop/thumbs/project-confidential-law-firm-century-city-05-2000x1125_1698420507_1024x576.jpg',
      challenge: 'Personal injury cases are time-sensitive. Missing a potential $50,000 case to voicemail is costly.',
      solution: 'AI handles intake 24/7, screening case type and urgency, texting attorney for immediate matters.',
      results: getResults('Law Firms'),
      testimonial: '"Missing a call in personal injury means losing a $50,000 case. The AI qualifies leads while I sleep."',
      name2: 'David Park',
      company: 'Park & Associates, San Jose CA'
    }
  ]

  const indiaIndustries = [
    {
      name: 'General Dentistry',
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80',
      challenge: 'Patients call during procedures and evenings. Receptionists miss calls during rush hours, losing walk-in and phone inquiries.',
      solution: 'AI answers every call 24/7, books appointments in Hindi & English, and sends instant WhatsApp confirmations to patients.',
      results: ['+15 new patients/month captured', '₹1,50,000+ additional monthly revenue', '100% call answer rate'],
      testimonial: 'We were missing 8-10 calls daily during procedures. Now every call gets answered and patients get booked instantly.',
      name2: 'Dr. Rajesh Sharma',
      company: 'Sharma Dental Clinic, Delhi'
    },
    {
      name: 'Orthodontics',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80',
      challenge: 'Long treatment plans mean constant follow-up calls. Parents call for their children\'s appointments during school hours.',
      solution: 'AI manages treatment follow-ups, answers queries about braces costs and timelines, and schedules monthly adjustments automatically.',
      results: ['+8 new orthodontic cases/month', '₹3,00,000+ in new treatment plans', '60% fewer no-shows with reminders'],
      testimonial: 'Parents love that they can call anytime and get appointment details. Our case acceptance rate jumped from 40% to 75%.',
      name2: 'Dr. Priya Kapoor',
      company: 'SmileAlign Orthodontics, Mumbai'
    },
    {
      name: 'Cosmetic Dentistry',
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80',
      challenge: 'High-value procedures like veneers and implants require detailed consultations. Prospects often call after hours to inquire.',
      solution: 'AI qualifies leads by discussing treatment options, costs, and EMI plans, then books premium consultation slots.',
      results: ['+5 high-value cases/month', '₹5,00,000+ additional revenue', '3x more consultation bookings'],
      testimonial: 'Our implant inquiries doubled because the AI explains costs and EMI options confidently at 11 PM when patients actually research.',
      name2: 'Dr. Ankit Mehta',
      company: 'Mehta Dental Aesthetics, Bangalore'
    },
    {
      name: 'Pediatric Dentistry',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80',
      challenge: 'Anxious parents call at odd hours when their child has dental emergencies. Managing scared parents requires patience.',
      solution: 'AI calms worried parents, triages dental emergencies (swelling, trauma, pain), and books urgent slots with the pediatric dentist.',
      results: ['+12 emergency cases/month handled', '₹1,80,000+ in emergency revenue', '95% parent satisfaction rate'],
      testimonial: 'A mother called at 2 AM when her child fell and chipped a tooth. The AI calmed her down and booked a morning emergency slot.',
      name2: 'Dr. Neha Verma',
      company: 'Little Smiles Dental, Pune'
    },
    {
      name: 'Dental Surgeons',
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80',
      challenge: 'Complex cases like wisdom tooth extractions and jaw surgeries need pre-operative consultations. Surgeons are always in OT.',
      solution: 'AI handles pre-surgery queries, explains procedures and costs, collects medical history, and schedules OPD consultations.',
      results: ['+6 surgical consultations/month', '₹4,00,000+ in surgical revenue', 'Zero missed referral calls'],
      testimonial: 'I was losing referrals from other dentists because I could never answer during surgery. The AI captures every referral now.',
      name2: 'Dr. Vikram Singh',
      company: 'Singh Oral Surgery Center, Hyderabad'
    }
  ]

  const industries = region === 'india' ? indiaIndustries : globalIndustries

  useEffect(() => {
    setSelectedIndustry(0)
  }, [region])

  return (
    <section id="industries" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {region === 'india' ? 'Built for Every Type of Dental Practice' : 'Built for Service Businesses Like Yours'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {region === 'india' 
              ? 'From general dentistry to specialized surgeries — our AI understands your patients and handles their needs in Hindi & English.'
              : 'Tailored solutions for your industry. Our AI understands your customers and handles their needs flawlessly.'}
          </p>
        </motion.div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {industries.map((industry, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndustry(index)}
              className={`relative px-6 py-3 rounded-full font-semibold transition-all ${
                selectedIndustry === index
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedIndustry === index && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-600 rounded-full shadow-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{industry.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Selected Industry Detail */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedIndustry}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid lg:grid-cols-2"
            >
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={industries[selectedIndustry].image}
                  alt={industries[selectedIndustry].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent lg:hidden"></div>
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <h3 className="text-2xl font-bold text-white">{industries[selectedIndustry].name}</h3>
                </div>
              </div>

              <div className="p-8 lg:p-12 bg-white">
                <h3 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">{industries[selectedIndustry].name}</h3>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">The Challenge</h4>
                    <p className="text-gray-700">{industries[selectedIndustry].challenge}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Our Solution</h4>
                    <p className="text-gray-700">{industries[selectedIndustry].solution}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Real Results</h4>
                    <ul className="space-y-3">
                      {industries[selectedIndustry].results.map((result, i) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          key={i} 
                          className="flex items-center gap-3 text-gray-700 font-medium"
                        >
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          {result}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-6 border-t border-gray-100"
                  >
                    <p className="text-gray-600 italic mb-4 text-lg">"{industries[selectedIndustry].testimonial}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-bold text-emerald-700">
                        {industries[selectedIndustry].name2.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{industries[selectedIndustry].name2}</div>
                        <div className="text-sm text-gray-500">{industries[selectedIndustry].company}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a 
            href="#contact" 
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg"
          >
            Get Your Industry Solution
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ROI Calculator
function ROICalculator() {
  const { region } = useRegion()
  const isIndia = region === 'india'
  const currencySymbol = isIndia ? '₹' : '$'

  const [callsPerDay, setCallsPerDay] = useState(15)
  const [avgJobValue, setAvgJobValue] = useState(isIndia ? 2000 : 400)
  const [answerRate, setAnswerRate] = useState(60)

  // Sync default job value when region changes
  useEffect(() => {
    if (isIndia && avgJobValue < 100) setAvgJobValue(2000)
    if (!isIndia && avgJobValue > 5000) setAvgJobValue(400)
  }, [isIndia])

  const missedCallsPerMonth = Math.round(callsPerDay * 30 * (1 - answerRate / 100))
  const lostRevenuePerMonth = Math.round(missedCallsPerMonth * avgJobValue * 0.5)

  return (
    <section id="results" className="py-24 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Calculate Your Revenue Opportunity
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              See exactly how much revenue you're leaving on the table from missed calls every month.
            </p>

            <div className="space-y-8">
              <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
                <div className="flex justify-between mb-4">
                  <label className="text-gray-300 font-medium">Average calls per day</label>
                  <span className="text-emerald-400 font-bold text-xl">{callsPerDay}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={callsPerDay}
                  onChange={(e) => setCallsPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
                <div className="flex justify-between mb-4">
                  <label className="text-gray-300 font-medium">{isIndia ? 'Average treatment value' : 'Average job value'}</label>
                  <span className="text-emerald-400 font-bold text-xl">{currencySymbol}{avgJobValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={isIndia ? 500 : 100}
                  max={isIndia ? 15000 : 1000}
                  step={isIndia ? 500 : 50}
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
                <div className="flex justify-between mb-4">
                  <label className="text-gray-300 font-medium">Current answer rate</label>
                  <span className="text-emerald-400 font-bold text-xl">{answerRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={answerRate}
                  onChange={(e) => setAnswerRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
              
              <h3 className="text-xl font-semibold mb-6 text-center text-white">Your Monthly Revenue Loss</h3>

              <div className="text-center mb-8 relative">
                <div className="text-6xl font-bold text-red-400 mb-2">
                  {currencySymbol}<AnimatedNumber value={lostRevenuePerMonth} />
                </div>
                <div className="text-gray-400">Lost to missed calls</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Missed calls per month</span>
                  <span className="font-bold text-white"><AnimatedNumber value={missedCallsPerMonth} /></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Avg. conversion rate</span>
                  <span className="font-bold text-white">50%</span>
                </div>
              </div>

                <motion.div 
                  initial={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                  animate={{ backgroundColor: ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.1)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-6 text-center"
                >
                <div className="text-4xl font-bold text-emerald-400 mb-2">
                  +{currencySymbol}<AnimatedNumber value={Math.round(lostRevenuePerMonth * 0.5)} />/mo
                </div>
                <div className="text-emerald-300">Revenue you could capture with CallCapture</div>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#10b981" }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-emerald-500 text-gray-900 py-4 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                Start Capturing This Revenue
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const { region } = useRegion()
  
  const globalTestimonials = [
    {
      name: 'Mike Rodriguez',
      company: 'Rodriguez Plumbing, Hayward CA',
      image: 'https://thumbs.dreamstime.com/b/headshot-successful-smiling-cheerful-african-american-businessman-executive-stylish-company-leader-strong-powerful-handsome-86822574.jpg',
      quote: "We were missing at least 5 emergency calls per week. Since getting the AI receptionist, we've captured every single one. Last month alone, we booked 8 additional jobs that would've gone to voicemail. That's $6,400 in revenue we would've lost.",
      result: '+$6,400/month revenue',
    },
    {
      name: 'Sarah Chen',
      company: 'Chen Construction, Oakland CA',
      image: 'https://media.istockphoto.com/id/1587604256/photo/portrait-lawyer-and-black-woman-with-tablet-smile-and-happy-in-office-workplace-african.jpg?s=612x612&w=0&k=20&c=n9yulMNKdIYIQC-Qns8agFj6GBDbiKyPRruaUTh4MKs=',
      quote: "I was skeptical about AI, but our customers can't tell the difference. The AI books consultations while I'm on job sites. I've added 4 new kitchen remodels this quarter from calls I would've missed.",
      result: '+$80,000 quarterly revenue',
    },
    {
      name: 'David Park',
      company: 'Park & Associates, San Jose CA',
      image: 'https://img.freepik.com/premium-photo/portrait-male-business-owner-showing-happy-smiling-face-as-he-has-successfully-invested-his-business-using-computers-financial-budget-documents-work_89286-655.jpg',
      quote: "In personal injury law, missing a call means losing a $50,000 case. The AI receptionist qualifies leads 24/7 and texts me immediately for urgent matters. It's like having an intake specialist who never sleeps.",
      result: '+12 qualified leads/month',
    },
  ]

  const indiaTestimonials = [
    {
      name: 'Dr. Rajesh Sharma',
      company: 'Sharma Dental Clinic, Delhi',
      image: 'https://img.freepik.com/premium-photo/portrait-indian-male-doctor_1168612-211764.jpg',
      quote: "We were missing 8-10 patient calls daily while I was doing procedures. The AI now books appointments in Hindi and English. Last month we added 18 new patients just from calls we would have missed. That's nearly ₹1.5 lakh extra revenue.",
      result: '+₹1,50,000/month revenue',
    },
    {
      name: 'Dr. Priya Kapoor',
      company: 'SmileAlign Orthodontics, Mumbai',
      image: 'https://img.freepik.com/premium-photo/portrait-indian-female-doctor_1168612-211748.jpg',
      quote: "Parents call at all hours asking about braces costs and timelines. The AI handles these queries perfectly and books consultations. Our case acceptance went from 40% to 75% because patients come in already informed.",
      result: '+₹3,00,000/month in new cases',
    },
    {
      name: 'Dr. Ankit Mehta',
      company: 'Mehta Dental Aesthetics, Bangalore',
      image: 'https://img.freepik.com/premium-photo/portrait-smiling-young-indian-doctor_1168612-211780.jpg',
      quote: "Most implant inquiries come at night when patients research online. The AI explains costs, EMI options, and books consultations at 11 PM. Our implant cases doubled in three months.",
      result: '+₹5,00,000/month in implants',
    },
  ]

  const testimonials = region === 'india' ? indiaTestimonials : globalTestimonials

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {region === 'india' 
              ? 'See how dental clinics across India are growing with CallCapture AI receptionist.'
              : 'Join 150+ service businesses that never miss a call — and the revenue that comes with it.'}
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
                  ></motion.div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="relative w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              </div>

              <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{testimonial.quote}"</p>

              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 w-fit px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
                {testimonial.result}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Replace with your Google Calendar appointment scheduling URL
// To create one: Google Calendar → Settings → Appointment Schedules → Create → Copy the booking link
const CALENDAR_BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/YOUR_CALENDAR_ID"

// CTA Section
function CTASection() {
  const { region } = useRegion()
  const [formData, setFormData] = useState({ name: '', business: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.business.trim()) newErrors.business = 'Business name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-700 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
             Ready to Capture Every Call?
           </h2>
           <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
             {region === 'india'
               ? 'Join dental clinics across India already growing with CallCapture. Get your free demo and see results within 48 hours.'
               : 'Join 150+ service businesses already growing with CallCapture. Get your free demo and see results within 48 hours.'}
           </p>
           <p className="text-emerald-200 mb-6">
             Call us at: <span className="font-semibold">{region === 'india' ? '+91 8796158579' : '(555) 123-4567'}</span>
           </p>
         </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-xl mx-auto shadow-2xl relative"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4 relative z-10"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-4 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={formData.business}
                    onChange={(e) => handleChange('business', e.target.value)}
                    className={`w-full px-4 py-4 rounded-xl border ${errors.business ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.business && <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.business}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-4 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-4 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.phone}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#065f46" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-5 rounded-xl font-bold text-xl transition-all shadow-xl shadow-emerald-600/20"
                >
                  Get Your Free Demo
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center py-4"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're Almost There!</h3>
                <p className="text-gray-500 mb-8">
                  Thanks <span className="font-semibold text-gray-700">{formData.name}</span>! Pick a time that works for you and we'll walk you through how CallCapture can grow your business.
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={CALENDAR_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/20"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Your Free Call
                </motion.a>
                <p className="text-gray-400 text-sm mt-6">30-minute call. No credit card required.</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!submitted && (
            <p className="text-gray-500 text-sm mt-6 font-medium">
              No credit card required. 30-minute call. Free ROI analysis.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const { region } = useRegion()
  return (
    <footer className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              <span className="text-emerald-500">Call</span>Capture
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered phone receptionists helping service businesses capture every opportunity and grow revenue.
            </p>
            <div className="flex gap-4">
              {['linkedin', 'twitter', 'facebook'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                    {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                    {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-400">
              {region === 'india' ? (
                <>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">General Dentistry</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Orthodontics</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Cosmetic Dentistry</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Pediatric Dentistry</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Dental Surgeons</a></li>
                </>
              ) : (
                <>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Plumbers</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">HVAC</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Electricians</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Contractors</a></li>
                  <li><a href="#industries" className="hover:text-emerald-400 transition">Law Firms</a></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
              <li><Link to="/transcripts" className="hover:text-emerald-400 transition">Example Transcripts</Link></li>
              <li><a href="#results" className="hover:text-emerald-400 transition">Results</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {region === 'india' ? '+91 8796158579' : '(555) 123-4567'}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@callcapture.ai
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 CallCapture. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Home Page Component
function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <TechnologySection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <IndustriesSection />
      <ROICalculator />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}

// Main App
function App() {
  const { pathname } = useLocation()
  const [region, setRegion] = useState<Region>('global')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/transcripts" element={<TranscriptsPage />} />
      </Routes>
        <Footer />
      </div>
    </RegionContext.Provider>
  )
}

export default App
