/**
 * Domain Intelligence & Application Context Classifier
 *
 * Dynamically determines the business domain, actors, entities, workflows,
 * navigation structure, and UI composition based strictly on the user's prompt.
 *
 * NEVER assumes e-commerce/shopping by default.
 */

export type BusinessDomainType =
  | "healthcare"
  | "hospitality"
  | "food_delivery"
  | "restaurant"
  | "education"
  | "real_estate"
  | "logistics"
  | "job_portal"
  | "fitness"
  | "finance"
  | "saas_project_mgmt"
  | "ecommerce"
  | "custom"

export interface DomainActionField {
  name: string
  label: string
  type: "text" | "number" | "select" | "date" | "textarea"
  placeholder: string
  options?: string[]
  required?: boolean
}

export interface DomainItem {
  id: number
  name: string
  desc: string
  category: string
  badge: string
  rating?: string
  icon: string
  metaLabel: string
  metaValue: string
  actionLabel: string
}

export interface ApplicationRequirementContext {
  originalPrompt: string
  projectTitle: string
  domain: BusinessDomainType
  domainLabel: string
  domainIcon: string
  primaryActor: string
  adminActor: string
  heroHeadline: string
  heroSubtext: string
  mainViewLabel: string
  mainViewIcon: string
  primaryAction: {
    label: string
    icon: string
    modalTitle: string
    modalDesc: string
    submitText: string
    successMessage: string
    fields: DomainActionField[]
  }
  categories: string[]
  items: DomainItem[]
  managementStats: Array<{
    label: string
    value: string
    change: string
    icon: string
  }>
  managementTableTitle: string
  managementTableColumns: string[]
  managementTableRows: string[][]
}

export function classifyApplicationDomain(
  prompt: string,
  blueprintTitle?: string
): ApplicationRequirementContext {
  const combined = (prompt + " " + (blueprintTitle || "")).toLowerCase()

  // 1. HEALTHCARE & HOSPITAL APPOINTMENTS
  if (
    /hospital|doctor|patient|clinic|medical|health|appointment|ehr|prescription|telemedicine|dental|physio|nurse|triage/.test(
      combined
    )
  ) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "MediCare Health Portal",
      domain: "healthcare",
      domainLabel: "Healthcare & Clinical Care",
      domainIcon: "🩺",
      primaryActor: "Patient / Care Seeker",
      adminActor: "Doctor / Medical Administrator",
      heroHeadline: "Specialized Healthcare & Instant Doctor Consultations",
      heroSubtext: prompt || "Connect with leading medical specialists, book verified clinical consultations, and manage digital health records seamlessly.",
      mainViewLabel: "Specialists & Services",
      mainViewIcon: "🩺",
      primaryAction: {
        label: "Book Appointment",
        icon: "📅",
        modalTitle: "Schedule Doctor Consultation",
        modalDesc: "Select specialist, appointment date, and describe your symptoms for priority clinical routing.",
        submitText: "Confirm Consultation",
        successMessage: "Appointment confirmed! Our medical triage team has received your request.",
        fields: [
          { name: "patient_name", label: "Patient Full Name", type: "text", placeholder: "e.g. John Doe", required: true },
          { name: "doctor_dept", label: "Specialty / Department", type: "select", placeholder: "Select Department", options: ["Cardiology", "Neurology", "General Medicine", "Pediatrics", "Orthopedics", "Dermatology"], required: true },
          { name: "preferred_date", label: "Appointment Date & Time", type: "text", placeholder: "e.g. Tomorrow, 10:30 AM", required: true },
          { name: "symptoms", label: "Symptoms & Medical Notes", type: "textarea", placeholder: "Describe symptoms or reason for visit...", required: false }
        ]
      },
      categories: ["All Specialists", "Cardiology", "Neurology", "General Medicine", "Pediatrics", "Orthopedics"],
      items: [
        { id: 1, name: "Dr. Sarah Jenkins, MD", desc: "Chief Cardiologist • 15+ Yrs Experience • Expert in Cardiac Care", category: "Cardiology", badge: "Available Today", rating: "4.9", icon: "❤️", metaLabel: "Consultation Fee", metaValue: "$120", actionLabel: "Book Appointment" },
        { id: 2, name: "Dr. Michael Chen, MD", desc: "Senior Neurologist • Cognitive & Nervous System Specialist", category: "Neurology", badge: "Top Rated", rating: "4.8", icon: "🧠", metaLabel: "Consultation Fee", metaValue: "$150", actionLabel: "Book Appointment" },
        { id: 3, name: "Dr. Elena Rostova", desc: "Lead Pediatrician • Gentle Pediatric & Neonatal Care", category: "Pediatrics", badge: "Family Favorite", rating: "5.0", icon: "👶", metaLabel: "Consultation Fee", metaValue: "$95", actionLabel: "Book Appointment" },
        { id: 4, name: "Dr. Robert Taylor", desc: "Orthopedic Surgeon • Joint Reconstruction & Sports Medicine", category: "Orthopedics", badge: "Available Tomorrow", rating: "4.7", icon: "🦴", metaLabel: "Consultation Fee", metaValue: "$130", actionLabel: "Book Appointment" },
        { id: 5, name: "Dr. Aisha Patel", desc: "General Physician • Preventive Health & Chronic Care Triage", category: "General Medicine", badge: "Instant Video Call", rating: "4.9", icon: "🩺", metaLabel: "Consultation Fee", metaValue: "$75", actionLabel: "Book Appointment" },
        { id: 6, name: "Dr. David Kim", desc: "Board-Certified Dermatologist • Skin Pathology & Laser Care", category: "General Medicine", badge: "High Demand", rating: "4.8", icon: "✨", metaLabel: "Consultation Fee", metaValue: "$110", actionLabel: "Book Appointment" }
      ],
      managementStats: [
        { label: "Today's Consultations", value: "38 Scheduled", change: "+12% vs yesterday", icon: "📅" },
        { label: "Active Doctors", value: "14 On-Duty", change: "100% Shift Coverage", icon: "🩺" },
        { label: "Patient Satisfaction", value: "98.4%", change: "Based on 320 reviews", icon: "⭐" },
        { label: "Avg Wait Time", value: "7.5 Mins", change: "-4 mins AI triage", icon: "⏱️" }
      ],
      managementTableTitle: "Clinical Appointments Roster",
      managementTableColumns: ["Patient", "Doctor", "Department", "Slot", "Status"],
      managementTableRows: [
        ["Emma Watson", "Dr. Sarah Jenkins", "Cardiology", "10:00 AM", "Confirmed"],
        ["Liam Neeson", "Dr. Michael Chen", "Neurology", "11:15 AM", "Checked In"],
        ["Sophia Loren", "Dr. Aisha Patel", "General Medicine", "01:30 PM", "Pending Triage"],
        ["Lucas Silva", "Dr. Robert Taylor", "Orthopedics", "03:00 PM", "Confirmed"]
      ]
    }
  }

  // 2. HOTEL & RESORT BOOKING
  if (
    /hotel|resort|room|suite|guest|booking|reservation|check-in|checkout|stay|vacation|villa|motel|inn|lodge/.test(
      combined
    ) &&
    !/food|dish|restaurant|order/.test(combined)
  ) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "Grand Horizon Hotel & Suites",
      domain: "hospitality",
      domainLabel: "Hospitality & Luxury Lodging",
      domainIcon: "🏨",
      primaryActor: "Guest / Traveler",
      adminActor: "Hotel Manager / Front Desk",
      heroHeadline: "Luxury Stays & Seamless Room Reservations",
      heroSubtext: prompt || "Discover world-class suites, check live availability, and reserve your premier getaway with instant concierge confirmation.",
      mainViewLabel: "Rooms & Suites",
      mainViewIcon: "🏨",
      primaryAction: {
        label: "Reserve Room",
        icon: "🛎️",
        modalTitle: "Hotel Room Reservation",
        modalDesc: "Select your desired suite tier, dates of stay, and guest details.",
        submitText: "Confirm Reservation",
        successMessage: "Room reservation confirmed! Digital key sent to your email.",
        fields: [
          { name: "guest_name", label: "Lead Guest Name", type: "text", placeholder: "e.g. Alex Morgan", required: true },
          { name: "room_type", label: "Suite / Room Category", type: "select", placeholder: "Select Suite", options: ["Presidential Penthouse", "Oceanfront Deluxe", "Executive King Suite", "Garden Villa", "Standard Double Room"], required: true },
          { name: "check_in", label: "Check-In Date", type: "text", placeholder: "e.g. Oct 15, 2026", required: true },
          { name: "check_out", label: "Check-Out Date", type: "text", placeholder: "e.g. Oct 20, 2026", required: true },
          { name: "guests_count", label: "Total Guests", type: "select", placeholder: "Guests", options: ["1 Adult", "2 Adults", "2 Adults + 1 Child", "Family (4+)"], required: true }
        ]
      },
      categories: ["All Suites", "Ocean View", "Executive", "Penthouse", "Garden Villa"],
      items: [
        { id: 1, name: "Presidential Penthouse Suite", desc: "Top floor panoramic skyline view • Private jacuzzi • 24/7 Butler Service", category: "Penthouse", badge: "VIP Exclusive", rating: "5.0", icon: "👑", metaLabel: "Nightly Rate", metaValue: "$580 / night", actionLabel: "Reserve Suite" },
        { id: 2, name: "Oceanfront Deluxe Suite", desc: "Direct balcony sea view • King Bed • Marble bathroom & lounge", category: "Ocean View", badge: "Best Seller", rating: "4.9", icon: "🌊", metaLabel: "Nightly Rate", metaValue: "$320 / night", actionLabel: "Reserve Suite" },
        { id: 3, name: "Executive King Suite", desc: "Dedicated work lounge • High-speed Wi-Fi • Complimentary Breakfast", category: "Executive", badge: "Business Pick", rating: "4.8", icon: "💼", metaLabel: "Nightly Rate", metaValue: "$240 / night", actionLabel: "Reserve Suite" },
        { id: 4, name: "Secluded Garden Villa", desc: "Private tropical garden • Plunge pool • King size canopy bed", category: "Garden Villa", badge: "Romantic Getaway", rating: "4.9", icon: "🌺", metaLabel: "Nightly Rate", metaValue: "$410 / night", actionLabel: "Reserve Suite" },
        { id: 5, name: "Luxury Family Suite", desc: "2 Interconnected Bedrooms • Living room • Kids play zone", category: "Executive", badge: "Family Choice", rating: "4.7", icon: "👨‍👩‍👧‍👦", metaLabel: "Nightly Rate", metaValue: "$290 / night", actionLabel: "Reserve Suite" }
      ],
      managementStats: [
        { label: "Occupancy Rate", value: "92.4%", change: "+8% this weekend", icon: "📈" },
        { label: "Active Guests", value: "148 Checked-In", change: "Full Front Desk Staff", icon: "🏨" },
        { label: "RevPAR", value: "$284", change: "+14% MoM", icon: "💵" },
        { label: "Pending Arrivals", value: "24 Today", change: "All Rooms Prepped", icon: "🛎️" }
      ],
      managementTableTitle: "Room Occupancy & Guest Roster",
      managementTableColumns: ["Guest", "Suite", "Check-In", "Check-Out", "Status"],
      managementTableRows: [
        ["Victoria Beckham", "Presidential Penthouse", "Today", "Oct 18", "Checked In"],
        ["Carlos Sainz", "Oceanfront Deluxe", "Today", "Oct 16", "Arrival Pending"],
        ["Hannah Schmitz", "Executive King Suite", "Oct 12", "Oct 19", "In Residence"],
        ["Marcus Aurelius", "Secluded Garden Villa", "Today", "Oct 22", "Confirmed"]
      ]
    }
  }

  // 3. RESTAURANT & FOOD ORDERING / TABLE BOOKING
  if (
    /food|restaurant|dish|menu|dine|dining|table|kitchen|culinary|chef|meal|pizza|burger|sushi|zomato|swiggy/.test(
      combined
    )
  ) {
    const isDelivery = /delivery|swiggy|zomato|courier|driver|rider/.test(combined)
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "Artisan Gourmet & Kitchen",
      domain: isDelivery ? "food_delivery" : "restaurant",
      domainLabel: isDelivery ? "Food Delivery & Cloud Kitchen" : "Restaurant & Table Reservations",
      domainIcon: "🍲",
      primaryActor: "Food Lover / Diner",
      adminActor: "Head Chef / Kitchen Manager",
      heroHeadline: isDelivery ? "Gourmet Meals Delivered to Your Doorstep" : "Culinary Excellence & Table Reservations",
      heroSubtext: prompt || "Explore curated chef specials, reserve prime dining tables, and enjoy culinary perfection.",
      mainViewLabel: "Menu & Culinary Specials",
      mainViewIcon: "🍲",
      primaryAction: {
        label: isDelivery ? "Place Delivery Order" : "Reserve Dining Table",
        icon: isDelivery ? "🛵" : "🍽️",
        modalTitle: isDelivery ? "Gourmet Food Delivery Order" : "Reserve Restaurant Table",
        modalDesc: isDelivery ? "Select menu items, enter delivery address, and track instant kitchen prep." : "Choose your dining date, party size, and dietary preferences.",
        submitText: isDelivery ? "Place Order Now" : "Confirm Table Reservation",
        successMessage: isDelivery ? "Order sent to kitchen! Rider assigned for delivery." : "Table reserved! We look forward to welcoming you.",
        fields: isDelivery
          ? [
              { name: "customer_name", label: "Full Name", type: "text", placeholder: "e.g. David Miller", required: true },
              { name: "delivery_address", label: "Delivery Address", type: "textarea", placeholder: "Apartment, Street, Landmark...", required: true },
              { name: "selected_items", label: "Selected Menu Items", type: "text", placeholder: "e.g. Truffle Pasta x2, Tiramisu x1", required: true },
              { name: "special_instructions", label: "Kitchen Notes / Allergies", type: "text", placeholder: "e.g. Extra spicy, no nuts...", required: false }
            ]
          : [
              { name: "diner_name", label: "Primary Guest Name", type: "text", placeholder: "e.g. David Miller", required: true },
              { name: "party_size", label: "Party Size", type: "select", placeholder: "Select Guests", options: ["2 Guests", "4 Guests (Standard)", "6 Guests", "8+ Private Dining"], required: true },
              { name: "reservation_time", label: "Dining Date & Time", type: "text", placeholder: "e.g. Tonight, 8:00 PM", required: true },
              { name: "table_preference", label: "Seating Preference", type: "select", placeholder: "Preference", options: ["Window View", "Outdoor Terrace", "Chef's Counter", "Quiet Booth"], required: false }
            ]
      },
      categories: ["All Delicacies", "Chef Signatures", "Handmade Pasta", "Woodfire Grill", "Artisan Desserts"],
      items: [
        { id: 1, name: "Wild Truffle Tagliolini", desc: "Fresh hand-rolled pasta, Umbrian black truffle emulsion, 24-month Parmigiano", category: "Handmade Pasta", badge: "Chef Signature", rating: "4.9", icon: "🍝", metaLabel: "Price", metaValue: "$28", actionLabel: isDelivery ? "Order Dish" : "Select Item" },
        { id: 2, name: "Prime Dry-Aged Ribeye (350g)", desc: "Charcoal grilled, bone marrow butter, roasted rosemary garlic glaze", category: "Woodfire Grill", badge: "Prime Cut", rating: "5.0", icon: "🥩", metaLabel: "Price", metaValue: "$46", actionLabel: isDelivery ? "Order Dish" : "Select Item" },
        { id: 3, name: "Woodfired Burrata Margherita", desc: "San Marzano tomatoes, artisanal creamy burrata, fresh basil, EVOO", category: "Chef Signatures", badge: "Crispy Crust", rating: "4.8", icon: "🍕", metaLabel: "Price", metaValue: "$22", actionLabel: isDelivery ? "Order Dish" : "Select Item" },
        { id: 4, name: "Pan-Seared Chilean Sea Bass", desc: "Saffron velouté, asparagus spears, caramelized shallot crisp", category: "Chef Signatures", badge: "Fresh Catch", rating: "4.9", icon: "🐟", metaLabel: "Price", metaValue: "$38", actionLabel: isDelivery ? "Order Dish" : "Select Item" },
        { id: 5, name: "Venetian Pistachio Tiramisu", desc: "Mascarpone cream, espresso-soaked ladyfingers, Bronte pistachio crunch", category: "Artisan Desserts", badge: "Must Try", rating: "4.9", icon: "🍰", metaLabel: "Price", metaValue: "$14", actionLabel: isDelivery ? "Order Dish" : "Select Item" }
      ],
      managementStats: [
        { label: "Active Orders", value: "28 Kitchen Queue", change: "Avg prep: 14 mins", icon: "🍳" },
        { label: "Table Reservations", value: "94% Booked", change: "Full evening shift", icon: "🍽️" },
        { label: "Kitchen Output", value: "142 Plates/hr", change: "+18% efficiency", icon: "🔥" },
        { label: "Customer Rating", value: "4.92 / 5.0", change: "Verified diners", icon: "⭐" }
      ],
      managementTableTitle: "Kitchen Orders & Table Dispatch",
      managementTableColumns: ["Customer / Table", "Order Details", "Time", "Server / Rider", "Status"],
      managementTableRows: [
        ["Table 04 (Marcus)", "Truffle Pasta, Sea Bass", "7:45 PM", "Server Julian", "Serving"],
        ["Delivery #409 (Elena)", "2x Margherita, Tiramisu", "7:52 PM", "Rider Sam (En Route)", "Dispatched"],
        ["Table 12 (Sophia)", "Ribeye Steak (Medium)", "8:00 PM", "Chef Station 2", "Cooking"],
        ["Table 08 (VIP Arthur)", "Chef Tasting Menu x4", "8:15 PM", "Head Chef Marco", "Prepping"]
      ]
    }
  }

  // 4. JOB RECRUITMENT & TALENT PORTAL
  if (/job|recruitment|career|resume|candidate|hire|hiring|recruiter|applicant|interview|talent|vacancy/.test(combined)) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "TalentSphere Global Careers",
      domain: "job_portal",
      domainLabel: "Job Recruitment & Talent Portal",
      domainIcon: "💼",
      primaryActor: "Candidate / Job Seeker",
      adminActor: "Recruiter / Hiring Manager",
      heroHeadline: "Find Your Dream Role & Accelerate Your Career",
      heroSubtext: prompt || "Discover verified opportunities across top tech and enterprise leaders. Apply with single-click AI resume matching.",
      mainViewLabel: "Open Positions",
      mainViewIcon: "💼",
      primaryAction: {
        label: "Submit Application",
        icon: "📝",
        modalTitle: "Apply for Open Position",
        modalDesc: "Submit your credentials, portfolio, and work history for hiring team review.",
        submitText: "Submit Job Application",
        successMessage: "Application submitted! Recruiter will contact you within 48 hours.",
        fields: [
          { name: "candidate_name", label: "Full Name", type: "text", placeholder: "e.g. Jane Doe", required: true },
          { name: "applied_role", label: "Target Job Role", type: "select", placeholder: "Select Position", options: ["Senior Full-Stack Engineer", "Staff AI / ML Scientist", "Principal Product Designer", "DevOps Cloud Architect", "Engineering Manager"], required: true },
          { name: "linkedin_url", label: "LinkedIn or Portfolio URL", type: "text", placeholder: "https://linkedin.com/in/...", required: true },
          { name: "years_exp", label: "Years of Experience", type: "select", placeholder: "Experience", options: ["1-3 Years", "3-5 Years", "5-8 Years", "8+ Years (Staff/Principal)"], required: true },
          { name: "cover_pitch", label: "Brief Pitch / Highlights", type: "textarea", placeholder: "Why are you a great fit for this role?", required: false }
        ]
      },
      categories: ["All Roles", "Engineering", "Design & UX", "AI & Data", "Product Management"],
      items: [
        { id: 1, name: "Senior Full-Stack Engineer", desc: "Next.js 16, TypeScript, Distributed PostgreSQL, GraphQL • High-growth startup", category: "Engineering", badge: "Remote (Global)", icon: "💻", metaLabel: "Salary Range", metaValue: "$140k - $175k", actionLabel: "Apply Now" },
        { id: 2, name: "Staff AI & Machine Learning Scientist", desc: "LLM fine-tuning, RAG architecture, PyTorch, agentic workflows • Silicon Valley", category: "AI & Data", badge: "High Priority", icon: "🤖", metaLabel: "Salary Range", metaValue: "$190k - $240k", actionLabel: "Apply Now" },
        { id: 3, name: "Principal Product Designer", desc: "Design systems, Figma mastery, user research, complex SaaS workflow UX", category: "Design & UX", badge: "Hybrid", icon: "🎨", metaLabel: "Salary Range", metaValue: "$130k - $160k", actionLabel: "Apply Now" },
        { id: 4, name: "Cloud Infrastructure & DevOps Lead", desc: "Kubernetes, AWS Terraform, CI/CD automation, 99.99% SLA reliability", category: "Engineering", badge: "Remote", icon: "☁️", metaLabel: "Salary Range", metaValue: "$150k - $185k", actionLabel: "Apply Now" }
      ],
      managementStats: [
        { label: "Total Applicants", value: "342 Active", change: "+48 this week", icon: "👥" },
        { label: "Interviews Scheduled", value: "18 This Week", change: "Top 5% qualified", icon: "🗓️" },
        { label: "Time-to-Hire", value: "14 Days", change: "-6 days with AI screen", icon: "⚡" },
        { label: "Offer Acceptance", value: "89.2%", change: "Industry benchmark", icon: "🎯" }
      ],
      managementTableTitle: "Candidate Pipeline & Application Tracker",
      managementTableColumns: ["Candidate", "Role", "Experience", "AI Match Score", "Stage"],
      managementTableRows: [
        ["Alexander Wright", "Staff AI Scientist", "8 Years", "96% (Strong Fit)", "Technical Round 2"],
        ["Elena Rostova", "Senior Full-Stack", "6 Years", "92% (Qualified)", "Recruiter Screen"],
        ["Devon Chen", "Principal Designer", "9 Years", "98% (Exceptional)", "Offer Stage"],
        ["Amina Diop", "DevOps Cloud Lead", "7 Years", "88% (Qualified)", "Code Review"]
      ]
    }
  }

  // 5. GYM, FITNESS & WELLNESS
  if (/gym|fitness|trainer|workout|exercise|member|membership|crossfit|yoga|pilates|bodybuilding|sports/.test(combined)) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "Apex Fitness & Performance Club",
      domain: "fitness",
      domainLabel: "Fitness Club & Member Management",
      domainIcon: "🏋️",
      primaryActor: "Gym Member / Athlete",
      adminActor: "Head Trainer / Club Owner",
      heroHeadline: "Unleash Your Peak Athletic Potential",
      heroSubtext: prompt || "Book elite training sessions, track personalized workout metrics, and join world-class fitness classes.",
      mainViewLabel: "Classes & Training Sessions",
      mainViewIcon: "🏋️",
      primaryAction: {
        label: "Book Training Session",
        icon: "💪",
        modalTitle: "Schedule Fitness Class / Session",
        modalDesc: "Select your training tier, preferred certified coach, and workout slot.",
        submitText: "Confirm Session Booking",
        successMessage: "Training slot confirmed! Added to your member calendar.",
        fields: [
          { name: "member_name", label: "Member Name", type: "text", placeholder: "e.g. Chris Evans", required: true },
          { name: "class_type", label: "Class / Training Discipline", type: "select", placeholder: "Select Session", options: ["High-Intensity CrossFit", "Personal Strength Coaching", "Power Vinyasa Yoga", "Cardio Kickboxing", "Recovery & Mobility"], required: true },
          { name: "preferred_trainer", label: "Preferred Trainer", type: "select", placeholder: "Trainer", options: ["Coach Marcus (Strength)", "Coach Elena (Mobility/Yoga)", "Coach Jake (HIIT/Boxing)", "Any Available Coach"], required: true },
          { name: "session_time", label: "Preferred Date & Time", type: "text", placeholder: "e.g. Tomorrow 7:00 AM", required: true }
        ]
      },
      categories: ["All Classes", "Strength & Conditioning", "HIIT & Cardio", "Yoga & Mobility", "Personal Coaching"],
      items: [
        { id: 1, name: "Advanced Functional Strength", desc: "Olympic lifting, power rack mechanics, barbell mastery • Max 8 athletes", category: "Strength & Conditioning", badge: "High Intensity", icon: "🏋️", metaLabel: "Duration", metaValue: "60 mins • $35", actionLabel: "Book Session" },
        { id: 2, name: "Extreme HIIT Conditioning", desc: "Kettlebells, assault bikes, rowers, tactical circuit intervals", category: "HIIT & Cardio", badge: "Calorie Burn", icon: "⚡", metaLabel: "Duration", metaValue: "45 mins • $25", actionLabel: "Book Session" },
        { id: 3, name: "Restorative Mobility & Yoga", desc: "Deep tissue myofascial release, joint decompression, breathwork", category: "Yoga & Mobility", badge: "All Levels", icon: "🧘", metaLabel: "Duration", metaValue: "50 mins • $20", actionLabel: "Book Session" },
        { id: 4, name: "1-on-1 Elite Athlete Coaching", desc: "Custom macro plan, biometric tracking, tailored hypertrophy programming", category: "Personal Coaching", badge: "Dedicated Coach", icon: "🎯", metaLabel: "Duration", metaValue: "60 mins • $75", actionLabel: "Book Session" }
      ],
      managementStats: [
        { label: "Active Members", value: "840 Members", change: "+35 this month", icon: "🏋️" },
        { label: "Today's Class Attendance", value: "164 Athletes", change: "96% Capacity", icon: "🔥" },
        { label: "Trainer Utilization", value: "88.5%", change: "Full Schedule", icon: "💪" },
        { label: "Renewal Rate", value: "94.2%", change: "Industry leading", icon: "📈" }
      ],
      managementTableTitle: "Today's Workout Classes & Member Check-Ins",
      managementTableColumns: ["Member", "Class / Session", "Coach", "Time Slot", "Status"],
      managementTableRows: [
        ["Marcus Vance", "Advanced Strength", "Coach Marcus", "07:00 AM", "Attended"],
        ["Sarah Connor", "Extreme HIIT", "Coach Jake", "08:30 AM", "Checked In"],
        ["Bruce Wayne", "1-on-1 Coaching", "Coach Marcus", "10:00 AM", "Confirmed"],
        ["Diana Prince", "Restorative Yoga", "Coach Elena", "05:30 PM", "Booked"]
      ]
    }
  }

  // 6. REAL ESTATE & PROPERTY PORTAL
  if (/real estate|property|realty|rental|apartment|house|housing|land|tenant|landlord|leasing|listing/.test(combined)) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "Prestige Prime Real Estate",
      domain: "real_estate",
      domainLabel: "Real Estate & Property Platform",
      domainIcon: "🏠",
      primaryActor: "Buyer / Tenant",
      adminActor: "Real Estate Broker / Property Manager",
      heroHeadline: "Find Luxury Properties & Schedule Private Viewings",
      heroSubtext: prompt || "Explore curated residential and commercial listings. Schedule instant on-site tours with licensed brokers.",
      mainViewLabel: "Featured Properties",
      mainViewIcon: "🏠",
      primaryAction: {
        label: "Schedule Viewing Tour",
        icon: "🔑",
        modalTitle: "Book Private Property Tour",
        modalDesc: "Select property listing, preferred viewing time, and contact information.",
        submitText: "Request Property Viewing",
        successMessage: "Viewing requested! Our licensed agent will confirm the access code.",
        fields: [
          { name: "visitor_name", label: "Full Name", type: "text", placeholder: "e.g. Arthur Pendelton", required: true },
          { name: "property_interest", label: "Property Listing", type: "select", placeholder: "Select Property", options: ["Skyline Penthouse (4BHK)", "Oceanfront Villa (5BHK)", "Modern Downtown Loft (2BHK)", "Suburban Family Residence (3BHK)"], required: true },
          { name: "tour_type", label: "Tour Preference", type: "select", placeholder: "Tour Type", options: ["In-Person Guided Tour", "Live 3D Virtual Walkthrough", "Self-Guided Smart Lock Visit"], required: true },
          { name: "preferred_time", label: "Preferred Date & Time", type: "text", placeholder: "e.g. Saturday 2:00 PM", required: true }
        ]
      },
      categories: ["All Listings", "Luxury Penthouses", "Villas & Estates", "Modern Lofts", "Commercial"],
      items: [
        { id: 1, name: "The Luminary Skyline Penthouse", desc: "4 Beds • 4.5 Baths • 4,200 sqft • Private rooftop infinity pool", category: "Luxury Penthouses", badge: "Exclusive Listing", icon: "🏙️", metaLabel: "List Price", metaValue: "$2,450,000", actionLabel: "Book Viewing" },
        { id: 2, name: "Azure Coastline Modern Villa", desc: "5 Beds • 6 Baths • 6,100 sqft • Direct beach access & private dock", category: "Villas & Estates", badge: "Waterfront", icon: "🏖️", metaLabel: "List Price", metaValue: "$3,800,000", actionLabel: "Book Viewing" },
        { id: 3, name: "Tribeca Industrial Loft", desc: "2 Beds • 2 Baths • 2,100 sqft • 14ft Ceilings, exposed brick & smart tech", category: "Modern Lofts", badge: "Prime Location", icon: "🏢", metaLabel: "List Price", metaValue: "$1,150,000", actionLabel: "Book Viewing" },
        { id: 4, name: "Greenwood Family Sanctuary", desc: "3 Beds • 3 Baths • 2,800 sqft • Solar powered, private garden & 2-car garage", category: "Villas & Estates", badge: "Move-in Ready", icon: "🏡", metaLabel: "List Price", metaValue: "$820,000", actionLabel: "Book Viewing" }
      ],
      managementStats: [
        { label: "Active Listings", value: "42 Properties", change: "$48M Portfolio Value", icon: "🏠" },
        { label: "Scheduled Tours", value: "26 This Week", change: "+8 new leads", icon: "🔑" },
        { label: "Avg Days on Market", value: "18 Days", change: "Fast Liquidity", icon: "⏱️" },
        { label: "Escrow Pipeline", value: "$6.4M Active", change: "3 closings pending", icon: "💼" }
      ],
      managementTableTitle: "Property Viewing Schedule & Buyer Leads",
      managementTableColumns: ["Buyer Lead", "Property", "Tour Type", "Schedule Time", "Status"],
      managementTableRows: [
        ["Jonathan Sterling", "Skyline Penthouse", "In-Person Guided", "Tomorrow 2:00 PM", "Confirmed"],
        ["Claire Redfield", "Azure Coastline Villa", "Live 3D Virtual", "Friday 11:00 AM", "Pending Broker"],
        ["Gordon Freeman", "Tribeca Loft", "Smart Lock Self Tour", "Saturday 1:30 PM", "Access Code Sent"]
      ]
    }
  }

  // 7. EDUCATION & E-LEARNING (LMS)
  if (/education|school|college|course|student|teacher|learning|lms|study|academic|tutor|class|curriculum/.test(combined)) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "EduSphere Academy & LMS",
      domain: "education",
      domainLabel: "Education & Learning Management",
      domainIcon: "🎓",
      primaryActor: "Student / Learner",
      adminActor: "Instructor / Academic Dean",
      heroHeadline: "Master Modern Skills with Expert-Led Courses",
      heroSubtext: prompt || "Interactive curriculum, hands-on coding labs, and certified credential pathways designed for modern career growth.",
      mainViewLabel: "Course Catalog",
      mainViewIcon: "🎓",
      primaryAction: {
        label: "Enroll in Course",
        icon: "📚",
        modalTitle: "Course Enrollment & Student Registration",
        modalDesc: "Register for your selected course and gain instant access to labs and mentorship.",
        submitText: "Complete Enrollment",
        successMessage: "Enrolled successfully! Course materials unlocked in your student portal.",
        fields: [
          { name: "student_name", label: "Student Full Name", type: "text", placeholder: "e.g. Michael Scott", required: true },
          { name: "selected_course", label: "Course Selection", type: "select", placeholder: "Select Course", options: ["Next.js 16 & Full-Stack Mastery", "Applied Generative AI & LLMs", "Cloud Architecture & Kubernetes", "UI/UX System Design"], required: true },
          { name: "cohort_batch", label: "Preferred Cohort", type: "select", placeholder: "Cohort", options: ["Live Weekend Batch", "Self-Paced with Mentor Support", "Fast-Track Immersion"], required: true }
        ]
      },
      categories: ["All Courses", "Software Engineering", "AI & Machine Learning", "Cloud & DevOps", "Design"],
      items: [
        { id: 1, name: "Next.js 16 & Enterprise Full-Stack", desc: "React 19, Server Actions, PostgreSQL architecture, end-to-end production testing", category: "Software Engineering", badge: "Bestseller", rating: "4.9", icon: "💻", metaLabel: "Curriculum", metaValue: "8 Weeks • $199", actionLabel: "Enroll Now" },
        { id: 2, name: "Production AI & LLM Engineering", desc: "Gemini APIs, RAG pipelines, fine-tuning, autonomous agentic tools with LangChain", category: "AI & Machine Learning", badge: "Trending", rating: "5.0", icon: "🤖", metaLabel: "Curriculum", metaValue: "10 Weeks • $249", actionLabel: "Enroll Now" },
        { id: 3, name: "Cloud Architecture & Kubernetes", desc: "AWS, Docker container orchestration, microservices, Terraform automation", category: "Cloud & DevOps", badge: "Advanced", rating: "4.8", icon: "☁️", metaLabel: "Curriculum", metaValue: "6 Weeks • $179", actionLabel: "Enroll Now" },
        { id: 4, name: "Product UI/UX & Design Systems", desc: "Figma design tokens, micro-interactions, responsive accessibility standards", category: "Design", badge: "Hands-on Labs", rating: "4.8", icon: "🎨", metaLabel: "Curriculum", metaValue: "6 Weeks • $149", actionLabel: "Enroll Now" }
      ],
      managementStats: [
        { label: "Enrolled Students", value: "1,420 Active", change: "+112 this term", icon: "🎓" },
        { label: "Course Completion", value: "91.8%", change: "+14% vs industry", icon: "🏆" },
        { label: "Active Cohorts", value: "8 Live Batches", change: "Full Instructor Load", icon: "📚" },
        { label: "Student Rating", value: "4.94 / 5.0", change: "Verified feedback", icon: "⭐" }
      ],
      managementTableTitle: "Student Enrollments & Progress Roster",
      managementTableColumns: ["Student", "Enrolled Course", "Cohort", "Progress", "Status"],
      managementTableRows: [
        ["Maya Lin", "Production AI & LLMs", "Weekend Batch", "74%", "Active"],
        ["Lucas Silva", "Next.js 16 Full-Stack", "Fast-Track", "92%", "Capstone Phase"],
        ["Noah Bennett", "Cloud Architecture", "Self-Paced", "45%", "In Progress"]
      ]
    }
  }

  // 8. LOGISTICS, SUPPLY CHAIN & SHIPMENT TRACKING
  if (/logistics|supply chain|shipment|tracking|freight|courier|fleet|warehouse|cargo|dispatch|truck|delivery tracking/.test(combined)) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "OmniLogistics Fleet & Dispatch",
      domain: "logistics",
      domainLabel: "Logistics & Fleet Dispatch",
      domainIcon: "🚚",
      primaryActor: "Shipper / Consignee",
      adminActor: "Dispatch Manager / Fleet Operator",
      heroHeadline: "Real-Time Freight Telemetry & Fleet Optimization",
      heroSubtext: prompt || "Track shipments end-to-end, automate route dispatching, and manage multi-hub warehouse operations with zero latency.",
      mainViewLabel: "Shipment Consignments",
      mainViewIcon: "🚚",
      primaryAction: {
        label: "Book Parcel Consignment",
        icon: "📦",
        modalTitle: "Create Freight & Parcel Consignment",
        modalDesc: "Register cargo parameters, pickup origin, and delivery destination.",
        submitText: "Generate Consignment Barcode",
        successMessage: "Consignment registered! Tracking barcode generated and driver assigned.",
        fields: [
          { name: "sender_name", label: "Shipper Company / Name", type: "text", placeholder: "e.g. Apex Industrial Corp", required: true },
          { name: "origin_city", label: "Pickup Origin", type: "text", placeholder: "e.g. Chicago Hub A", required: true },
          { name: "destination_city", label: "Delivery Destination", type: "text", placeholder: "e.g. Dallas Central Depot", required: true },
          { name: "freight_type", label: "Cargo Classification", type: "select", placeholder: "Classification", options: ["Express Parcel", "Cold Chain Logistics", "Heavy Freight (Pallet)", "Hazardous Material (Hazmat)"], required: true },
          { name: "weight_kg", label: "Estimated Weight (kg)", type: "number", placeholder: "e.g. 450", required: true }
        ]
      },
      categories: ["All Shipments", "Active En-Route", "Warehoused", "Cold Chain", "Delivered"],
      items: [
        { id: 1, name: "Consignment #SHP-90821", desc: "Chicago Hub -> Dallas Central • Medical Cold Chain • Temp: 4°C Maintained", category: "Cold Chain", badge: "On Time (ETA: 4h)", icon: "❄️", metaLabel: "Tracking Code", metaValue: "GPS: 32.7767° N", actionLabel: "Track Consignment" },
        { id: 2, name: "Consignment #SHP-88412", desc: "Seattle Port -> Denver Depot • High-value Electronics • Escorted Fleet", category: "Active En-Route", badge: "In Transit", icon: "🚚", metaLabel: "Tracking Code", metaValue: "GPS: 39.7392° N", actionLabel: "Track Consignment" },
        { id: 3, name: "Consignment #SHP-77210", desc: "Atlanta Warehouse -> Miami Terminal • Palletized Dry Goods", category: "Warehoused", badge: "Cross-Docking", icon: "📦", metaLabel: "Tracking Code", metaValue: "Warehouse Bay 14", actionLabel: "Track Consignment" }
      ],
      managementStats: [
        { label: "Fleet in Transit", value: "64 Vehicles", change: "100% GPS Signal", icon: "🚚" },
        { label: "On-Time Delivery", value: "98.4%", change: "+2.1% SLA", icon: "⏱️" },
        { label: "Fuel Optimization", value: "14% Saved", change: "AI Route Dispatch", icon: "⛽" },
        { label: "Active Cargo Value", value: "$4.2M", change: "Insured Transit", icon: "🛡️" }
      ],
      managementTableTitle: "Live Dispatch Manifest & GPS Telemetry",
      managementTableColumns: ["Tracking ID", "Origin -> Destination", "Cargo Type", "Assigned Driver", "Status"],
      managementTableRows: [
        ["#SHP-90821", "Chicago -> Dallas", "Cold Chain Pharma", "Driver Frank M.", "En Route"],
        ["#SHP-88412", "Seattle -> Denver", "High-Value Tech", "Driver Sarah K.", "En Route"],
        ["#SHP-77210", "Atlanta -> Miami", "Dry Freight", "Driver Alex P.", "Loading"]
      ]
    }
  }

  // 9. E-COMMERCE & RETAIL SHOPPING (ONLY WHEN EXPLICITLY REQUESTED)
  if (
    /ecommerce|e-commerce|online store|shopping cart|clothing shop|retail shop|product marketplace|buy products online|fashion store/.test(
      combined
    )
  ) {
    return {
      originalPrompt: prompt,
      projectTitle: blueprintTitle || "Urban Luxe Commerce",
      domain: "ecommerce",
      domainLabel: "E-Commerce & Retail Marketplace",
      domainIcon: "🛍️",
      primaryActor: "Online Shopper / Buyer",
      adminActor: "Store Owner / Inventory Manager",
      heroHeadline: "Curated Premium Collection & Seamless Shopping",
      heroSubtext: prompt || "Discover trending collections, enjoy personalized product recommendations, and checkout securely.",
      mainViewLabel: "Product Catalog",
      mainViewIcon: "🛍️",
      primaryAction: {
        label: "Place Product Order",
        icon: "🛒",
        modalTitle: "Checkout & Order Confirmation",
        modalDesc: "Review items in cart, enter shipping destination, and confirm payment.",
        submitText: "Complete Purchase",
        successMessage: "Order placed successfully! Tracking confirmation sent.",
        fields: [
          { name: "customer_name", label: "Customer Full Name", type: "text", placeholder: "e.g. Emma Stone", required: true },
          { name: "shipping_address", label: "Shipping Address", type: "textarea", placeholder: "Street, City, Postal Code...", required: true },
          { name: "payment_method", label: "Payment Method", type: "select", placeholder: "Payment", options: ["Credit / Debit Card", "Apple Pay / Google Pay", "Instant Bank Transfer"], required: true }
        ]
      },
      categories: ["All Products", "Apparel & Fashion", "Tech & Gadgets", "Home & Living", "Accessories"],
      items: [
        { id: 1, name: "Premium Merino Wool Overcoat", desc: "Tailored fit, Italian woven wool, thermal water-resistant lining", category: "Apparel & Fashion", badge: "New Arrival", rating: "4.9", icon: "🧥", metaLabel: "Price", metaValue: "$240", actionLabel: "Add to Cart" },
        { id: 2, name: "Noise-Cancelling Wireless Headphones", desc: "40hr battery, spatial audio, custom EQ, ultra-soft memory foam", category: "Tech & Gadgets", badge: "Best Seller", rating: "4.8", icon: "🎧", metaLabel: "Price", metaValue: "$180", actionLabel: "Add to Cart" },
        { id: 3, name: "Minimalist Ceramic Table Lamp", desc: "Handcrafted stoneware, dimmable warm ambient LED, brass accents", category: "Home & Living", badge: "Trending", rating: "4.7", icon: "💡", metaLabel: "Price", metaValue: "$95", actionLabel: "Add to Cart" },
        { id: 4, name: "Full-Grain Leather Everyday Tote", desc: "Hand-stitched vegetable-tanned leather, fits 16-inch laptop", category: "Accessories", badge: "Handmade", rating: "4.9", icon: "👜", metaLabel: "Price", metaValue: "$145", actionLabel: "Add to Cart" }
      ],
      managementStats: [
        { label: "Today's Revenue", value: "$4,820", change: "+16% vs yesterday", icon: "💵" },
        { label: "Orders Shipped", value: "62 Orders", change: "99% Fulfillment", icon: "📦" },
        { label: "Cart Conversion", value: "3.8%", change: "+0.6% conversion", icon: "📈" },
        { label: "Avg Order Value", value: "$142", change: "Consistent Basket", icon: "🛍️" }
      ],
      managementTableTitle: "Customer Orders & Fulfillment Tracker",
      managementTableColumns: ["Order ID", "Customer", "Items", "Total Amount", "Status"],
      managementTableRows: [
        ["#ORD-1092", "Emma Stone", "Merino Overcoat x1", "$240.00", "Shipped"],
        ["#ORD-1093", "David Beckham", "Wireless Headphones x1", "$180.00", "Processing"],
        ["#ORD-1094", "Sarah Connor", "Ceramic Lamp x2", "$190.00", "Delivered"]
      ]
    }
  }

  // 10. GENERIC / CUSTOM DOMAIN FALLBACK (DOMAIN-NEUTRAL!)
  const cleanTitle = blueprintTitle || "Smart Operations Platform"
  return {
    originalPrompt: prompt,
    projectTitle: cleanTitle,
    domain: "custom",
    domainLabel: "Enterprise Management & Workflows",
    domainIcon: "⚡",
    primaryActor: "Operations User / Requester",
    adminActor: "System Administrator / Manager",
    heroHeadline: `Operational Command & Management Portal`,
    heroSubtext: prompt || "Streamlined operational workflows, automated request processing, and real-time activity intelligence.",
    mainViewLabel: "Operational Modules",
    mainViewIcon: "⚡",
    primaryAction: {
      label: "Create New Request",
      icon: "➕",
      modalTitle: "Submit Operational Request",
      modalDesc: "Provide task parameters to trigger automated backend pipeline execution.",
      submitText: "Submit Request",
      successMessage: "Request processed and logged in operational registry.",
      fields: [
        { name: "requester_name", label: "Requester Name", type: "text", placeholder: "e.g. Alex Morgan", required: true },
        { name: "request_title", label: "Request Identifier / Title", type: "text", placeholder: "e.g. Q4 Fleet Optimization Project", required: true },
        { name: "priority", label: "Priority Level", type: "select", placeholder: "Priority", options: ["Standard", "High Priority", "Urgent / Critical"], required: true },
        { name: "details", label: "Scope & Requirements Description", type: "textarea", placeholder: "Describe operational parameters...", required: false }
      ]
    },
    categories: ["All Modules", "Core Operations", "Automation Engines", "Analytics & Reports"],
    items: [
      { id: 1, name: "Core Operational Gateway", desc: "Automated entry ingestion with instantaneous schema validation and event triggers.", category: "Core Operations", badge: "Active Engine", icon: "🚀", metaLabel: "Throughput", metaValue: "1,200 reqs/min", actionLabel: "Execute Action" },
      { id: 2, name: "AI Decision & Reasoning Agent", desc: "Autonomous reasoning engine evaluating complex business rules and anomalies.", category: "Automation Engines", badge: "AI Powered", icon: "🤖", metaLabel: "Latency", metaValue: "380 ms", actionLabel: "Execute Action" },
      { id: 3, name: "Real-Time Telemetry & Audit Matrix", desc: "Live event logging, PostgreSQL state sync, and compliance tracking.", category: "Analytics & Reports", badge: "Live Sync", icon: "📊", metaLabel: "SLA", metaValue: "99.98% Uptime", actionLabel: "Execute Action" }
    ],
    managementStats: [
      { label: "Active Transactions", value: "1,420 Executed", change: "+18% efficiency", icon: "⚡" },
      { label: "System Health", value: "99.98% SLA", change: "All systems nominal", icon: "🛡️" },
      { label: "Queue Latency", value: "42 ms", change: "Zero bottlenecks", icon: "⏱️" },
      { label: "Data Integrity", value: "100% ACID", change: "PostgreSQL verified", icon: "🗄️" }
    ],
    managementTableTitle: "Live Operational Activity Ledger",
    managementTableColumns: ["Request ID", "Requester", "Module Target", "Timestamp", "Status"],
    managementTableRows: [
      ["#REQ-801", "Alex Morgan", "Core Gateway", "Just now", "Completed"],
      ["#REQ-802", "Diana Prince", "AI Decision Agent", "4 mins ago", "Processing"],
      ["#REQ-803", "Bruce Wayne", "Audit Matrix", "12 mins ago", "Archived"]
    ]
  }
}
