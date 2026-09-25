import { UXBlueprint } from "./ux-wireframe-types"

export const restaurantUXFixture: UXBlueprint = {
  projectTitle: "Smart Restaurant Online Ordering & Table Booking Platform",
  activeScreenId: "screen-home",
  status: "draft",
  updatedAt: new Date().toISOString(),
  metadata: {
    designSystem: "modern_enterprise",
    targetAudience: "Diners & Restaurant Operations Staff",
    primaryColor: "#4f46e5"
  },
  personas: [
    {
      id: "persona-1",
      name: "Rohan Patel",
      role: "Busy Professional & Food Enthusiast",
      avatar: "🍽️",
      goals: ["Reserve a table during peak hours without calling", "Browse daily chef specials", "Order takeaway with zero wait time"],
      painPoints: ["Busy phone lines leading to missed bookings", "Unclear menu allergies & ingredient info"],
      keyScreens: ["screen-home", "screen-menu", "screen-booking", "screen-checkout"]
    },
    {
      id: "persona-2",
      name: "Chef & Floor Manager",
      role: "Operations & Kitchen Lead",
      avatar: "👨‍🍳",
      goals: ["Real-time table occupancy visibility", "Instant digital order tickets (KDS)"],
      painPoints: ["Double-booking during weekends", "Manual ticket entry errors"],
      keyScreens: ["screen-admin-dashboard", "screen-orders-live"]
    }
  ],
  journeys: [
    {
      id: "journey-1",
      personaId: "persona-1",
      title: "Seamless Table Booking & Advance Meal Pre-Order",
      goal: "Reserve dinner for 4 and pre-order chef special appetizers",
      steps: [
        {
          stepNumber: 1,
          title: "Explore Restaurant & Live Availability",
          description: "User lands on homepage and checks real-time table availability.",
          screenId: "screen-home",
          action: "Click 'Book a Table'",
          aiTouchpoint: "Smart peak-hour recommendation"
        },
        {
          stepNumber: 2,
          title: "Select Guests, Date & Dining Zone",
          description: "Choose 4 guests, 8:00 PM, Outdoor Patio.",
          screenId: "screen-booking",
          action: "Submit reservation details",
          aiTouchpoint: "AI dynamic seating allocator"
        },
        {
          stepNumber: 3,
          title: "Browse Interactive Menu & Add Items",
          description: "Selects appetizers and beverages for immediate service upon arrival.",
          screenId: "screen-menu",
          action: "Add to cart & Proceed",
          aiTouchpoint: "Chef recommendation engine"
        },
        {
          stepNumber: 4,
          title: "Instant Secure Checkout",
          description: "Review booking time, dishes, and pay holding deposit.",
          screenId: "screen-checkout",
          action: "Confirm & Pay via UPI/Card"
        },
        {
          stepNumber: 5,
          title: "Booking Confirmation & Digital Pass",
          description: "Receive QR pass with live countdown and calendar sync.",
          screenId: "screen-confirmation",
          action: "Add to Google Calendar",
          aiTouchpoint: "Automated WhatsApp confirmation assistant"
        }
      ]
    }
  ],
  screens: [
    {
      id: "screen-home",
      name: "Home & Discovery",
      route: "/",
      description: "Landing experience with hero banner, quick reservation bar, and curated chef specials.",
      purpose: "Attract diners, showcase ambiance, and provide 1-click booking/ordering pathways.",
      deviceType: "desktop",
      isInitial: true,
      metadata: { category: "Core", tags: ["Landing", "Hero", "Entry"] },
      components: [
        {
          id: "cmp-nav",
          type: "navbar",
          label: "Header Navigation",
          variant: "primary",
          width: "full",
          properties: {
            brandName: "Artisan Bistro AI",
            menuItems: ["Menu", "Book Table", "Catering", "Contact"]
          }
        },
        {
          id: "cmp-hero-card",
          type: "card",
          label: "Hero Showcase Banner",
          variant: "primary",
          width: "full",
          content: "Experience Gourmet Dining Crafted by Master Chefs. Reserve in real-time or order online.",
          properties: {
            title: "Culinary Excellence Meets Instant AI Booking",
            badge: "Chef's Special Tasting Menu Live"
          }
        },
        {
          id: "cmp-btn-book",
          type: "button",
          label: "📅 Book a Table Now",
          variant: "primary",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-booking", label: "Go to Table Reservation" }
        },
        {
          id: "cmp-btn-menu",
          type: "button",
          label: "🍽️ View Digital Menu & Order",
          variant: "secondary",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-menu", label: "Open Digital Menu" }
        },
        {
          id: "cmp-stats",
          type: "stat_card",
          label: "Live Restaurant Pulse",
          width: "full",
          properties: {
            statValue: "18 Tables Available Today",
            statChange: "Fast Booking Recommended",
            badgeTone: "emerald"
          }
        }
      ]
    },
    {
      id: "screen-booking",
      name: "Table Reservation Studio",
      route: "/booking",
      description: "Interactive table selector, guest count picker, time slot matrix, and dietary notes.",
      purpose: "Fast friction-free reservation with real-time seat availability.",
      deviceType: "desktop",
      metadata: { category: "Core", tags: ["Booking", "Form", "Table"] },
      components: [
        {
          id: "cmp-booking-header",
          type: "heading",
          label: "Reserve Your Dining Experience",
          content: "Select party size, date, time slot, and preferred dining area.",
          width: "full"
        },
        {
          id: "cmp-input-party",
          type: "select",
          label: "Party Size (Guests)",
          placeholder: "Select number of guests",
          width: "1/2",
          properties: {
            options: ["2 Guests (Cozy Table)", "4 Guests (Standard)", "6-8 Guests (Family Booth)", "10+ Guests (Private Dining Hall)"],
            required: true
          }
        },
        {
          id: "cmp-input-date",
          type: "input",
          label: "Reservation Date & Time",
          placeholder: "Today, 8:00 PM",
          width: "1/2",
          properties: { inputType: "datetime-local", required: true }
        },
        {
          id: "cmp-input-seating",
          type: "select",
          label: "Preferred Seating Area",
          placeholder: "Select Seating Preference",
          width: "1/2",
          properties: {
            options: ["Main Dining Room", "Rooftop Garden Patio", "Chef's Counter (Live View)", "Quiet Lounge Booth"]
          }
        },
        {
          id: "cmp-input-special",
          type: "textarea",
          label: "Special Occasion / Dietary Notes",
          placeholder: "e.g., Birthday celebration, vegan preference, peanut allergy...",
          width: "1/2"
        },
        {
          id: "cmp-btn-proceed-menu",
          type: "button",
          label: "Confirm Table & Pre-Order Dishes →",
          variant: "primary",
          width: "full",
          action: { type: "navigate", targetScreenId: "screen-menu", label: "Proceed to Menu Selection" }
        }
      ]
    },
    {
      id: "screen-menu",
      name: "Interactive Digital Menu & Cart",
      route: "/menu",
      description: "Categorized food items with high-res photos, allergen filters, portion size modifiers, and instant cart drawer.",
      purpose: "Showcase food offerings and facilitate smooth pre-order or delivery cart accumulation.",
      deviceType: "desktop",
      metadata: { category: "Catalog", tags: ["Menu", "Food", "Cart"] },
      components: [
        {
          id: "cmp-menu-search",
          type: "search",
          label: "Search Gourmet Dishes, Appetizers, Drinks...",
          placeholder: "Type dish name or dietary tag (e.g. Gluten-Free Pasta)...",
          width: "full"
        },
        {
          id: "cmp-menu-tabs",
          type: "tabs",
          label: "Menu Categories",
          width: "full",
          properties: {
            items: ["Chef Signature Specials", "Appetizers", "Woodfired Mains", "Desserts", "Beverages & Cocktails"]
          }
        },
        {
          id: "cmp-menu-card-1",
          type: "card",
          label: "Truffle Infused Risotto",
          variant: "outline",
          width: "1/3",
          content: "Arborio rice, wild forest mushrooms, black truffle shavings, 24-mo aged parmesan.",
          properties: {
            price: "$28.00",
            badge: "Best Seller",
            imageUrl: "/placeholder.jpg"
          }
        },
        {
          id: "cmp-menu-card-2",
          type: "card",
          label: "Woodfired Burrata Pizza",
          variant: "outline",
          width: "1/3",
          content: "San Marzano tomatoes, fresh pugliese burrata, sweet basil, cold-pressed olive oil.",
          properties: {
            price: "$24.00",
            badge: "Vegetarian",
            imageUrl: "/placeholder.jpg"
          }
        },
        {
          id: "cmp-menu-card-3",
          type: "card",
          label: "Pan-Seared Atlantic Salmon",
          variant: "outline",
          width: "1/3",
          content: "Crispy skin salmon, asparagus spear velouté, lemon herb emulsion.",
          properties: {
            price: "$34.00",
            badge: "Gluten Free",
            imageUrl: "/placeholder.jpg"
          }
        },
        {
          id: "cmp-btn-checkout",
          type: "button",
          label: "🛒 View Cart (3 Items • $86.00) & Checkout →",
          variant: "primary",
          width: "full",
          action: { type: "navigate", targetScreenId: "screen-checkout", label: "Proceed to Checkout" }
        }
      ]
    },
    {
      id: "screen-checkout",
      name: "Checkout & Deposit Gateway",
      route: "/checkout",
      description: "Order & reservation summary, guest contact details, payment method selection, and tip options.",
      purpose: "Secure transactional checkout with instant payment processing.",
      deviceType: "desktop",
      metadata: { category: "Checkout", tags: ["Checkout", "Payment"] },
      components: [
        {
          id: "cmp-chk-summary",
          type: "card",
          label: "Reservation & Order Summary",
          variant: "secondary",
          width: "full",
          content: "Table for 4 • Tonight @ 8:00 PM • 3 Pre-Ordered Dishes ($86.00) • Booking Deposit ($20.00)",
          properties: { total: "$106.00" }
        },
        {
          id: "cmp-input-name",
          type: "input",
          label: "Lead Guest Full Name",
          placeholder: "e.g. Rohan Patel",
          width: "1/2",
          properties: { required: true }
        },
        {
          id: "cmp-input-phone",
          type: "input",
          label: "Mobile Number (for WhatsApp SMS Confirmation)",
          placeholder: "+91 98765 43210",
          width: "1/2",
          properties: { required: true }
        },
        {
          id: "cmp-payment-select",
          type: "select",
          label: "Select Payment Method",
          placeholder: "Choose Payment Option",
          width: "full",
          properties: {
            options: ["Instant UPI (Google Pay, PhonePe, Paytm)", "Credit / Debit Card (Visa, Mastercard)", "Apple Pay / Google Wallet", "Pay at Restaurant Desk"]
          }
        },
        {
          id: "cmp-btn-pay",
          type: "button",
          label: "🔒 Pay $106.00 & Confirm Booking",
          variant: "success",
          width: "full",
          action: { type: "navigate", targetScreenId: "screen-confirmation", label: "Complete Order & Reservation" }
        }
      ]
    },
    {
      id: "screen-confirmation",
      name: "Confirmation & Live Pass",
      route: "/confirmation",
      description: "Digital reservation pass with QR code, real-time status tracker, direction map, and instant cancel/modify options.",
      purpose: "Reassure diners and provide actionable arrival instructions.",
      deviceType: "desktop",
      metadata: { category: "Core", tags: ["Confirmation", "QR", "Status"] },
      components: [
        {
          id: "cmp-conf-alert",
          type: "alert",
          label: "🎉 Reservation & Order Confirmed!",
          content: "Booking ID #RES-94821 is confirmed. We have sent your pass to your WhatsApp & Email.",
          variant: "success",
          width: "full"
        },
        {
          id: "cmp-qr-card",
          type: "card",
          label: "Digital Dining Pass",
          variant: "primary",
          width: "full",
          content: "Show this QR code at the reception desk for instant seating and automated kitchen dispatch.",
          properties: {
            qrPlaceholder: true,
            tableNumber: "Table #14 (Patio)",
            timeRemaining: "1 Hr 45 Mins Remaining"
          }
        },
        {
          id: "cmp-btn-home",
          type: "button",
          label: "Return to Home Page",
          variant: "outline",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-home", label: "Back to Home" }
        },
        {
          id: "cmp-btn-manage",
          type: "button",
          label: "Modify / Reschedule Booking",
          variant: "secondary",
          width: "1/2",
          action: { type: "navigate", targetScreenId: "screen-booking", label: "Edit Reservation" }
        }
      ]
    }
  ],
  navigation: [
    {
      id: "nav-1",
      sourceScreenId: "screen-home",
      targetScreenId: "screen-booking",
      trigger: "click",
      sourceComponentId: "cmp-btn-book",
      label: "Book Table CTA"
    },
    {
      id: "nav-2",
      sourceScreenId: "screen-home",
      targetScreenId: "screen-menu",
      trigger: "click",
      sourceComponentId: "cmp-btn-menu",
      label: "View Menu CTA"
    },
    {
      id: "nav-3",
      sourceScreenId: "screen-booking",
      targetScreenId: "screen-menu",
      trigger: "click",
      sourceComponentId: "cmp-btn-proceed-menu",
      label: "Proceed to Food Selection"
    },
    {
      id: "nav-4",
      sourceScreenId: "screen-menu",
      targetScreenId: "screen-checkout",
      trigger: "click",
      sourceComponentId: "cmp-btn-checkout",
      label: "Cart Checkout Flow"
    },
    {
      id: "nav-5",
      sourceScreenId: "screen-checkout",
      targetScreenId: "screen-confirmation",
      trigger: "submit",
      sourceComponentId: "cmp-btn-pay",
      label: "Payment Success Redirection"
    },
    {
      id: "nav-6",
      sourceScreenId: "screen-confirmation",
      targetScreenId: "screen-home",
      trigger: "click",
      sourceComponentId: "cmp-btn-home",
      label: "Back to Home"
    }
  ]
}
