import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, User, Bot, CheckCircle2, MessageSquare, Clock, ChevronRight, Wrench, HardHat, Scale, Home, Zap, Snowflake, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'

const transcripts = [
  {
    id: 1,
    industry: 'Plumbing',
    title: 'EMERGENCY - Burst Pipe',
    duration: '2:15',
    outcome: 'Emergency Dispatched, Technician Called',
    messages: [
      { role: 'AI', text: 'Thank you for calling Rodriguez Plumbing, this is Ava. How can I help you today?' },
      { role: 'Caller', text: "Hi, I have water everywhere! My pipe burst in the basement!" },
      { role: 'AI', text: "Oh no, that sounds stressful. First - is everyone safe? And do you know where your main water shut-off valve is?" },
      { role: 'Caller', text: "Yes everyone's fine. I shut off the water already." },
      { role: 'AI', text: "Good, you did exactly the right thing. I'm going to get help to you right away. Can I get your name and the address where you need us?" },
      { role: 'Caller', text: "It's Mike Chen, 4521 Maple Street in Hayward." },
      { role: 'AI', text: "Thank you Mike. And the best number to reach you?" },
      { role: 'Caller', text: "510-555-0142." },
      { role: 'AI', text: "Perfect. Is this a single-family home or multi-unit building?" },
      { role: 'Caller', text: "Single family home." },
      { role: 'AI', text: "Got it. Mike, since this is an emergency, I'm dispatching our on-call technician right now. You'll get a call from Mike Rodriguez within 5 minutes, and he can be there within 45 minutes. Our emergency rate is $180 for the first hour, and we'll fix that pipe today. Does that work?" },
      { role: 'Caller', text: "Yes, please just get someone here fast!" },
      { role: 'AI', text: "Absolutely. Mike Rodriguez is calling you now. You'll also get a text confirmation with his direct number. Is there anything else I can help with while you wait?" },
      { role: 'Caller', text: "No, just please hurry." },
      { role: 'AI', text: "I completely understand. Help is on the way. Mike will call you within 5 minutes. Thank you for calling Rodriguez Plumbing." }
    ],
    sms: "🚨 EMERGENCY DISPATCH\nName: Mike Chen\nPhone: 510-555-0142\nAddress: 4521 Maple St, Hayward\nIssue: Burst pipe, basement flooding\nWater shut off: YES\nETA: 45 min\nCALL NOW"
  },
  {
    id: 2,
    industry: 'Contracting',
    title: 'KITCHEN REMODEL - Consultation Booking',
    duration: '3:45',
    outcome: 'Consultation Scheduled',
    messages: [
      { role: 'AI', text: 'Good morning, thank you for calling Chen Construction. This is Sofia. How can I help you today?' },
      { role: 'Caller', text: "Hi, I'm interested in getting my kitchen remodeled. Do you guys do that?" },
      { role: 'AI', text: "Absolutely, kitchen remodeling is one of our specialties. I'd love to help you with that. Can I get your name?" },
      { role: 'Caller', text: "It's Sarah Johnson." },
      { role: 'AI', text: "Nice to meet you Sarah. And where is the project located?" },
      { role: 'Caller', text: "I'm in Oakland, near Lake Merritt." },
      { role: 'AI', text: "Great, we work all over the East Bay. Sarah, are you looking to do a full kitchen renovation or just update certain elements like cabinets or countertops?" },
      { role: 'Caller', text: "Probably a full renovation. The kitchen is from the 80s and pretty outdated." },
      { role: 'AI', text: "I see. Full renovations are exciting - you get to really transform the space. What's your timeline looking like? Are you hoping to start soon or still in the planning phase?" },
      { role: 'Caller', text: "We'd like to start in the next month or two if possible." },
      { role: 'AI', text: "Perfect timing. We actually have a promotion right now - $1,000 off any kitchen or bathroom remodel when you book your consultation this month." },
      { role: 'Caller', text: "Oh that's nice. How much do kitchen remodels usually cost?" },
      { role: 'AI', text: "Great question. Our kitchen remodels typically range from $25,000 to $75,000 depending on the size, materials, and scope. The best way to get an accurate estimate is to have our designer come out, take measurements, and discuss your vision. That consultation is free, by the way." },
      { role: 'Caller', text: "Okay, that sounds good. When could someone come out?" },
      { role: 'AI', text: "I have availability this Thursday at 2 PM or Saturday at 10 AM. Which works better for you?" },
      { role: 'Caller', text: "Saturday at 10 would be great." },
      { role: 'AI', text: "Perfect. Let me confirm: Saturday, April 5th at 10:00 AM for a free kitchen remodel consultation at your home in Oakland. I'll need your address and the best phone number for our designer to confirm." },
      { role: 'Caller', text: "It's 1842 Lakeshore Avenue, and my number is 510-555-0298." },
      { role: 'AI', text: "Excellent. Sarah, you're all set. Our designer David will arrive Saturday at 10 AM. He'll bring samples and take measurements. You'll get a confirmation text and email shortly. Any questions before we wrap up?" },
      { role: 'Caller', text: "No, that sounds great. Thank you!" },
      { role: 'AI', text: "You're very welcome, Sarah. We're excited to help transform your kitchen. Have a wonderful day!" }
    ]
  },
  {
    id: 3,
    industry: 'Law Firm',
    title: 'Personal Injury Intake',
    duration: '4:20',
    outcome: 'Qualified Lead, Consultation Scheduled',
    messages: [
      { role: 'AI', text: 'Thank you for calling Park & Associates. This is Rachel. How may I direct your call?' },
      { role: 'Caller', text: "Hi, I was in a car accident last week and I think I need a lawyer." },
      { role: 'AI', text: "I'm sorry to hear about your accident. I'd be happy to help you get connected with the right attorney. Can I get your name?" },
      { role: 'Caller', text: "It's David Kim." },
      { role: 'AI', text: "Thank you David. Can you tell me briefly what happened?" },
      { role: 'Caller', text: "I was stopped at a red light and someone rear-ended me. I've been having back pain since then." },
      { role: 'AI', text: "I'm sorry that happened to you. Were you injured? Did you seek medical attention?" },
      { role: 'Caller', text: "Yeah, I went to the ER that night and they said I have whiplash. I've been seeing a chiropractor since then." },
      { role: 'AI', text: "Okay. And was the other driver insured? Did police come to the scene?" },
      { role: 'Caller', text: "Yes, they have insurance. Police came and made a report." },
      { role: 'AI', text: "Good, that's important. David, do you have the police report or the other driver's insurance information?" },
      { role: 'Caller', text: "I have the police report number and the other driver's insurance info." },
      { role: 'AI', text: "Excellent. David, based on what you've shared, this sounds like something our personal injury team can definitely help with. We offer free consultations for cases like yours. During that meeting, the attorney will review your case, explain your options, and discuss how we can help. There's no obligation." },
      { role: 'Caller', text: "Okay, that sounds good. When could I come in?" },
      { role: 'AI', text: "I have openings tomorrow at 11 AM or Thursday at 2 PM. Which works better?" },
      { role: 'Caller', text: "Tomorrow at 11." },
      { role: 'AI', text: "Perfect. Let me get some information to prepare for your consultation. What's the best phone number for you?" },
      { role: 'Caller', text: "415-555-0367." },
      { role: 'AI', text: "And your email address?" },
      { role: 'Caller', text: "david.kim at gmail.com." },
      { role: 'AI', text: "Great. David, you're confirmed for tomorrow, Wednesday at 11:00 AM for a free personal injury consultation. Please bring your police report, insurance information, and any medical records you have. Our office is at 450 Market Street, Suite 2200. Do you know where that is?" },
      { role: 'Caller', text: "Yes, I can find it." },
      { role: 'AI', text: "Perfect. You'll receive a confirmation text and email. Is there anything else I can help with today?" },
      { role: 'Caller', text: "No, that's all. Thank you." },
      { role: 'AI', text: "You're welcome, David. We'll see you tomorrow at 11. Take care." }
    ]
  },
  {
    id: 4,
    industry: 'Roofing',
    title: 'Storm Damage Assessment',
    duration: '2:50',
    outcome: 'Emergency Inspection Scheduled',
    messages: [
      { role: 'AI', text: 'Thank you for calling Bay Area Roofing. This is Jessica speaking. How can I help you?' },
      { role: 'Caller', text: "Hi, we had that big storm last night and I think I have roof damage. There are shingles in my yard." },
      { role: 'AI', text: "Oh no, I'm sorry to hear that. Storm damage can be really concerning. First - is there any active leaking inside your home right now?" },
      { role: 'Caller', text: "Yes, there's a water stain on my ceiling in the living room." },
      { role: 'AI', text: "Okay, that's something we need to address quickly to prevent further damage. Can I get your name and address?" },
      { role: 'Caller', text: "It's Lisa Martinez, 7823 Pine Street in San Leandro." },
      { role: 'AI', text: "Thank you Lisa. And your phone number?" },
      { role: 'Caller', text: "510-555-0483." },
      { role: 'AI', text: "Got it. Lisa, since you have active leaking, I'm going to schedule you for an emergency inspection today. We have a crew that can come out this afternoon to assess the damage and do temporary tarping if needed to stop the leak. Are you available between 2 and 4 PM?" },
      { role: 'Caller', text: "Yes, that would be great." },
      { role: 'AI', text: "Perfect. Our inspector will arrive between 2 and 4 PM today. He'll assess the damage, take photos for your insurance, and can do emergency tarping if necessary. There's no charge for the inspection. Do you have homeowners insurance?" },
      { role: 'Caller', text: "Yes, I do." },
      { role: 'AI', text: "Excellent. Our inspector will provide documentation that you can submit to your insurance company. Most storm damage is covered. You'll get a text confirmation shortly with the inspector's name and direct number. Is there anything else?" },
      { role: 'Caller', text: "No, just please come today. I'm worried about more rain." },
      { role: 'AI', text: "I completely understand, Lisa. You're on our emergency list for today between 2-4 PM. We'll take care of you. Thank you for calling Bay Area Roofing." }
    ]
  },
  {
    id: 5,
    industry: 'HVAC',
    title: 'After Hours Emergency',
    duration: '1:45',
    outcome: 'Emergency Dispatched',
    messages: [
      { role: 'AI', text: "You've reached Bay Area Heating and Cooling. Our office is currently closed, but I'm here to help. What can I do for you?" },
      { role: 'Caller', text: "My AC just died and it's 95 degrees in my house! I have a baby and it's getting really hot." },
      { role: 'AI', text: "I understand - that's urgent with a baby in the house. Let me get you help right away. Can I get your name and address?" },
      { role: 'Caller', text: "Jennifer Walsh, 2345 Cedar Drive in Fremont." },
      { role: 'AI', text: "Thank you Jennifer. Phone number?" },
      { role: 'Caller', text: "510-555-0521." },
      { role: 'AI', text: "Got it. Jennifer, I'm dispatching our on-call technician now. You'll get a call within 10 minutes, and they can be there within an hour. Our after-hours emergency rate is $200 for the first hour. Is that okay?" },
      { role: 'Caller', text: "Yes, just please send someone!" },
      { role: 'AI', text: "Absolutely. Help is on the way. You'll get a text with the technician's direct number. They'll call you within 10 minutes. Is there anything else?" },
      { role: 'Caller', text: "No, thank you!" },
      { role: 'AI', text: "You're welcome, Jennifer. Stay cool - help is coming. Goodbye." }
    ]
  },
  {
    id: 6,
    industry: 'Electrical',
    title: 'General Inquiry - Pricing',
    duration: '2:10',
    outcome: 'Information Provided, Follow-up Scheduled',
    messages: [
      { role: 'AI', text: 'Good afternoon, thank you for calling Oakland Electric. This is Marcus. How can I help you?' },
      { role: 'Caller', text: "Hi, I need to get some outlets installed in my garage. How much does something like that cost?" },
      { role: 'AI', text: "I'd be happy to help with that. Can I get your name?" },
      { role: 'Caller', text: "Tom Anderson." },
      { role: 'AI', text: "Thanks Tom. For outlet installation, it really depends on a few factors - how many outlets, the current wiring situation, and whether we need to run new lines from the panel. Ballpark, you're looking at $150-300 per outlet typically. The best way to get an accurate quote is to have our electrician come take a look - that estimate is free." },
      { role: 'Caller', text: "Okay, I need probably 4 outlets. So maybe $600-1200?" },
      { role: 'AI', text: "That's in the right range, yes. It could be on the lower end if the wiring is straightforward. Would you like me to schedule a free estimate? We can usually get someone out within a day or two." },
      { role: 'Caller', text: "Sure, that would be good." },
      { role: 'AI', text: "Great. What's your address, Tom?" },
      { role: 'Caller', text: "1567 Oak Street in Oakland." },
      { role: 'AI', text: "Got it. And your phone number?" },
      { role: 'Caller', text: "510-555-0619." },
      { role: 'AI', text: "Perfect. I have Tuesday at 9 AM or Wednesday at 2 PM available. Which works better?" },
      { role: 'Caller', text: "Tuesday at 9." },
      { role: 'AI', text: "Excellent. Tom, you're all set for Tuesday at 9 AM. Our electrician will call when they're on the way. You'll get a confirmation text shortly. Any other questions?" },
      { role: 'Caller', text: "No, that's it. Thanks!" },
      { role: 'AI', text: "You're welcome, Tom. We'll see you Tuesday. Have a great day!" }
    ]
  },
  {
    id: 7,
    industry: 'Contracting',
    title: 'Unsure Customer - Guidance',
    duration: '3:30',
    outcome: 'Consultation Booked',
    messages: [
      { role: 'AI', text: 'Thank you for calling MEJA Construction. This is Sofia. How can I help you today?' },
      { role: 'Caller', text: "Hi, I'm not really sure if you guys can help me. I have this weird situation with my house." },
      { role: 'AI', text: "Of course, I'm happy to help figure that out. What's going on?" },
      { role: 'Caller', text: "Well, I have this space above my garage that I never use. It's just storage. And I was thinking maybe I could turn it into something, like an apartment or something? But I don't even know if that's possible." },
      { role: 'AI', text: "That sounds like it could be an ADU - an accessory dwelling unit. We actually specialize in those! Converting unused space into a rental unit or guest house can be a great investment. Where are you located?" },
      { role: 'Caller', text: "I'm in Hayward." },
      { role: 'AI', text: "Perfect, we work all over the East Bay. So just to understand - it's space above your garage, currently used for storage. Do you know roughly how big the space is?" },
      { role: 'Caller', text: "Maybe 400-500 square feet? I'm not sure exactly." },
      { role: 'AI', text: "That's actually a great size for an ADU. You could potentially get a one-bedroom unit or a nice studio. And Hayward has been pretty supportive of ADU development lately. Do you know if the space has electrical and plumbing access?" },
      { role: 'Caller', text: "I think there's electricity up there, but probably no plumbing." },
      { role: 'AI', text: "That's totally workable. We'd need to run plumbing, but that's common with garage conversions. The big question is what you'd want to use it for - rental income, family, guests?" },
      { role: 'Caller', text: "Rental income definitely. I could use the extra money." },
      { role: 'AI', text: "Smart thinking. ADUs can rent for $1,500-2,500 per month in Hayward depending on size and finishes. The investment usually pays for itself pretty quickly. Would you like to have our ADU specialist come out and take a look? They can assess the space, explain the process, and give you a realistic budget. That consultation is free." },
      { role: 'Caller', text: "Yeah, that would be helpful. I don't even know where to start." },
      { role: 'AI', text: "That's exactly why we're here. I have availability Friday at 1 PM or next Monday at 10 AM. Which works better?" },
      { role: 'Caller', text: "Friday at 1." },
      { role: 'AI', text: "Perfect. Can I get your name and address?" },
      { role: 'Caller', text: "It's Robert Chang, 8923 Birch Avenue in Hayward." },
      { role: 'AI', text: "And your phone number, Robert?" },
      { role: 'Caller', text: "510-555-0734." },
      { role: 'AI', text: "Great. Robert, you're confirmed for Friday at 1 PM. Our ADU specialist will come assess your space, explain the permit process, and give you budget ranges. You'll get a confirmation text. This could be a really exciting project!" },
      { role: 'Caller', text: "Thanks, I'm looking forward to learning more." },
      { role: 'AI', text: "You're very welcome, Robert. We'll see you Friday. Have a wonderful day!" }
    ]
  },
  {
    id: 8,
    industry: 'Plumbing',
    title: 'Existing Customer - Status Check',
    duration: '1:30',
    outcome: 'Issue Resolved',
    messages: [
      { role: 'AI', text: 'Good morning, Rodriguez Plumbing. This is Ava. How can I help you?' },
      { role: 'Caller', text: "Hi, I had a job scheduled for yesterday but the technician never showed. I'm calling to find out what happened." },
      { role: 'AI', text: "I'm so sorry about that. Let me look that up for you. Can I get your name and address?" },
      { role: 'Caller', text: "Patricia Moore, 3421 Elm Street." },
      { role: 'AI', text: "Thank you Patricia. Let me check... I see you were scheduled for a water heater installation yesterday between 2-4 PM. I sincerely apologize - it looks like there was a scheduling error on our end. That should not have happened." },
      { role: 'Caller', text: "Yeah, I waited home all afternoon." },
      { role: 'AI', text: "I completely understand your frustration, Patricia. Let me fix this right now. I have first priority openings tomorrow at 8 AM or Saturday at 9 AM. Which would work better for you?" },
      { role: 'Caller', text: "Tomorrow at 8." },
      { role: 'AI', text: "Perfect. You're confirmed for tomorrow at 8 AM, and I'm flagging this as priority. The technician will call you 30 minutes before arrival. You'll also get a text confirmation. Again, I sincerely apologize for yesterday. Is there anything else I can help with?" },
      { role: 'Caller', text: "No, just please make sure they show up tomorrow." },
      { role: 'AI', text: "Absolutely, Patricia. You're our first call tomorrow at 8 AM. Thank you for your patience, and we'll take care of you tomorrow." }
    ]
  },
  {
    id: 9,
    industry: 'Dentistry',
    title: 'Emergency Toothache Booking',
    duration: '2:10',
    outcome: 'Emergency Slot Booked',
    messages: [
      { role: 'AI', text: 'Welcome to SmileCare Dental. This is Sarah, your AI assistant. How can we make you smile today?' },
      { role: 'Caller', text: "I have a terrible toothache and need to see a dentist immediately. It's keeping me awake." },
      { role: 'AI', text: "I'm so sorry you're in pain. Toothaches can be miserable. Are you experiencing any swelling or fever along with the pain?" },
      { role: 'Caller', text: "A little bit of swelling on the right side." },
      { role: 'AI', text: "Thank you for letting me know. That's definitely an emergency. Can I get your full name, please?" },
      { role: 'Caller', text: "It's John Davies." },
      { role: 'AI', text: "Thanks John. I can squeeze you in for an emergency appointment today at 4:00 PM with Dr. Mehra. Does that time work for you?" },
      { role: 'Caller', text: "Yes, 4 PM is perfect." },
      { role: 'AI', text: "Great. I have you scheduled for 4:00 PM today. Our clinic is located at 1200 Dental Way. Do you know where that is?" },
      { role: 'Caller', text: "Yes, I've been there before." },
      { role: 'AI', text: "Perfect. Since you've been here before, we have your information on file. You'll receive a text confirmation shortly. Please try to arrive 10 minutes early. Is there anything else I can help with?" },
      { role: 'Caller', text: "No, that's it. Thank you." },
      { role: 'AI', text: "You're welcome, John. Hang in there, and we'll see you at 4." }
    ],
    sms: "🚨 EMERGENCY DENTAL BOOKING\nPatient: John Davies (Existing)\nIssue: Severe toothache, right side swelling\nTime: 4:00 PM Today\nProvider: Dr. Mehra"
  }
]

const industries = [
  { name: 'Plumbing', icon: Wrench, image: '/plumbing.png' },
  { name: 'Contracting', icon: HardHat, image: '/contracting.png' },
  { name: 'Law Firm', icon: Scale, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80' },
  { name: 'Roofing', icon: Home, image: '/roofer.png' },
  { name: 'HVAC', icon: Snowflake, image: '/hvac.png' },
  { name: 'Electrical', icon: Zap, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80' },
  { name: 'Dentistry', icon: Stethoscope, image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80' },
]

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

export default function TranscriptsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedTranscript, setSelectedTranscript] = useState<number | null>(null)

  const filteredTranscripts = selectedIndustry
    ? transcripts.filter((t) => t.industry === selectedIndustry)
    : []

  const activeTranscript = selectedTranscript !== null
    ? transcripts.find((t) => t.id === selectedTranscript)
    : null

  const industryInfo = selectedIndustry
    ? industries.find((i) => i.name === selectedIndustry)
    : null

  const handleBack = () => {
    if (selectedTranscript !== null) {
      setSelectedTranscript(null)
    } else if (selectedIndustry !== null) {
      setSelectedIndustry(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 font-semibold mb-8 hover:text-emerald-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Example AI Call Transcripts
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            See how CallCapture handles real-world scenarios across different industries. From emergencies to consultations, our AI ensures zero missed opportunities.
          </p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* STEP 1: Industry Selection */}
        {selectedIndustry === null && (
          <motion.section
            key="industries"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Select an Industry</h2>
              <p className="text-gray-500 text-center mb-12 text-lg">Choose an industry to view example AI call transcripts</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {industries.map((industry) => {
                  const count = transcripts.filter((t) => t.industry === industry.name).length
                  const Icon = industry.icon
                  return (
                    <motion.button
                      key={industry.name}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedIndustry(industry.name)}
                      className="relative h-48 md:h-56 overflow-hidden rounded-2xl p-8 text-left transition-all shadow-lg hover:shadow-2xl group"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={industry.image} 
                          alt={industry.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                      </div>

                      {/* Content (Z-indexed above image) */}
                      <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-10 h-10 bg-emerald-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-emerald-600/40 transition-colors">
                              <Icon className="w-6 h-6 text-white opacity-90 group-hover:opacity-100" />
                           </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{industry.name}</h3>
                          <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{count} example{count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* STEP 2: Scenario List for Selected Industry */}
        {selectedIndustry !== null && selectedTranscript === null && (
          <motion.section
            key="scenarios"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                All Industries
              </button>

              <div className="flex items-center gap-4 mb-10">
                {industryInfo && (
                  <div className="bg-emerald-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <industryInfo.icon className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">{selectedIndustry}</h2>
                  <p className="text-gray-500 text-lg">{filteredTranscripts.length} call example{filteredTranscripts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredTranscripts.map((call) => (
                  <motion.button
                    key={call.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTranscript(call.id)}
                    className="w-full text-left bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Call {call.id}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {call.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{call.title}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {call.outcome}
                      </span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* STEP 3: Full Transcript View */}
        {selectedTranscript !== null && activeTranscript && (
          <motion.section
            key="transcript"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to {activeTranscript.industry} Scenarios
              </button>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                  <div>
                    <div className="text-emerald-600 font-bold mb-1 uppercase tracking-wider text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call {activeTranscript.id}: {activeTranscript.industry}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{activeTranscript.title}</h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {activeTranscript.duration}
                    </div>
                    <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight">
                      {activeTranscript.outcome}
                    </div>
                  </div>
                </div>

                {/* Chat View */}
                <div className="space-y-6 bg-gray-50 rounded-3xl p-6 md:p-10 border border-gray-100 shadow-inner">
                  {activeTranscript.messages.map((msg, mIndex) => (
                    <div key={mIndex} className={`flex ${msg.role === 'AI' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'AI' ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'AI' ? 'bg-emerald-600' : 'bg-gray-800'}`}>
                          {msg.role === 'AI' ? <Bot className="text-white w-5 h-5" /> : <User className="text-white w-5 h-5" />}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'AI' ? 'bg-white rounded-tl-none border-l-4 border-emerald-500' : 'bg-gray-900 text-white rounded-tr-none'}`}>
                          <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-50">
                            {msg.role}
                          </div>
                          <p className="text-lg leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeTranscript.sms && (
                    <div className="mt-12">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Instant SMS Alert Sent to Professional
                      </div>
                      <div className="bg-emerald-50 border-2 border-emerald-200 border-dashed rounded-2xl p-6 max-w-sm mx-auto shadow-sm">
                        <p className="text-emerald-900 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                          {activeTranscript.sms}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to capture these results?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Stop losing leads to voicemail. Join the service businesses already growing with CallCapture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all">
              Get Started Now
            </Link>
            <Link to="/" className="w-full sm:w-auto border-2 border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-full font-bold text-lg transition-all">
              Watch Demo Video
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 CallCapture. All rights reserved.</p>
      </footer>
    </div>
  )
}
