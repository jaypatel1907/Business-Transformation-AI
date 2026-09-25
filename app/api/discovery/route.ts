import { NextRequest, NextResponse } from "next/server"
import { DiscoveryQuestion } from "@/lib/discovery-types"

export async function POST(req: NextRequest) {
  try {
    const { prompt, language = "English" } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY
    const cleanPrompt = (prompt || "").trim()

    // Domain heuristic fallback generator for Discovery Questions
    const getDomainDiscoveryQuestions = (p: string, lang: string): DiscoveryQuestion[] => {
      const lower = p.toLowerCase()
      const isGuj = lang.toLowerCase().includes("gu")

      if (lower.includes("food") || lower.includes("restaurant") || lower.includes("dine") || lower.includes("kitchen") || lower.includes("table")) {
        return [
          {
            id: "q1",
            category: "Goals & Audience",
            question: isGuj ? "તમારો મુખ્ય બિઝનેસ મૉડલ કયો છે?" : "What is your primary restaurant operating model?",
            context_hint: isGuj ? "તમારા ગ્રાહકો કેવી રીતે ઓર્ડર કરશે?" : "Defines how customer orders and reservations flow.",
            options: [
              "Dine-in with Table QR Ordering & Advance Booking",
              "Direct Online Food Delivery & Takeaway",
              "Hybrid: Multi-Outlet Cloud Kitchen + Dine-In",
              "Catering & Event Group Bookings"
            ],
            selected_option: "Dine-in with Table QR Ordering & Advance Booking"
          },
          {
            id: "q2",
            category: "Operations & Pain Points",
            question: isGuj ? "હાલમાં સૌથી મોટો ઓપરેશનલ પડકાર શું છે?" : "What is currently your largest operational bottleneck?",
            context_hint: isGuj ? "ક્યાં વધુ સમય અને પૈસા બગડે છે?" : "Helps pinpoint where automation produces fastest ROI.",
            options: [
              "High peak-hour order delays & kitchen miscommunication (KDS)",
              "Manual phone reservations leading to double-booking & no-shows",
              "Third-party delivery platform commission fees (25-30%)",
              "Inventory wastage & inaccurate raw ingredient forecasting"
            ],
            selected_option: "High peak-hour order delays & kitchen miscommunication (KDS)"
          },
          {
            id: "q3",
            category: "Technology & Constraints",
            question: isGuj ? "હાલમાં કઈ POS અથવા બિલિંગ સિસ્ટમ વાપરો છો?" : "What existing POS or billing infrastructure do you use?",
            context_hint: isGuj ? "ઇન્ટિગ્રેશન માટે જરૂરી છે." : "Determines API connectivity and data sync needs.",
            options: [
              "Standalone modern cloud POS (e.g. Petpooja / Square / Toast)",
              "Legacy desktop offline billing software",
              "Spreadsheets & manual receipt books",
              "Fresh greenfield setup (no legacy software)"
            ],
            selected_option: "Fresh greenfield setup (no legacy software)"
          },
          {
            id: "q4",
            category: "AI & Innovation",
            question: isGuj ? "તમે કઈ AI સુવિધાઓ ઉમેરવા માંગો છો?" : "Which AI capability will provide the highest immediate value?",
            context_hint: isGuj ? "AI સ્માર્ટ ફીચર્સ પસંદ કરો." : "Prioritizes AI model selection and agent architecture.",
            options: [
              "AI WhatsApp/Voice Assistant for 24/7 table booking & menu queries",
              "Smart dynamic surge pricing & chef recommendation engine",
              "Predictive demand forecasting to cut kitchen ingredient food waste",
              "Automated sentiment analysis of customer reviews & feedback"
            ],
            selected_option: "AI WhatsApp/Voice Assistant for 24/7 table booking & menu queries"
          }
        ]
      }

      if (lower.includes("shop") || lower.includes("store") || lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("retail") || lower.includes("product")) {
        return [
          {
            id: "q1",
            category: "Goals & Audience",
            question: isGuj ? "તમારી ટાર્ગેટ માર્કેટ અને ગ્રાહક કેટેગરી કઈ છે?" : "What is your primary sales channel & target market?",
            context_hint: isGuj ? "D2C કે B2B?" : "Identifies checkout complexity and multi-currency needs.",
            options: [
              "Direct to Consumer (D2C) Brand Storefront",
              "B2B Wholesale / Multi-Vendor Marketplace",
              "Omnichannel: Physical Retail Stores + Online App",
              "Subscription Box / Recurring Membership Products"
            ],
            selected_option: "Direct to Consumer (D2C) Brand Storefront"
          },
          {
            id: "q2",
            category: "Operations & Pain Points",
            question: isGuj ? "હાલમાં સૌથી મોટો ઓર્ડર/સેલ્સ પડકાર કયો છે?" : "What is your top fulfillment and customer conversion challenge?",
            context_hint: isGuj ? "કાર્ટ ડ્રોપ-ઓફ કે ઇન્વેન્ટરી?" : "Highlights key customer conversion drop-offs.",
            options: [
              "High shopping cart abandonment before payment",
              "Inventory mismatch between warehouse and online stock",
              "Manual order tracking and high customer support ticket volume",
              "Lack of personalized product recommendations"
            ],
            selected_option: "High shopping cart abandonment before payment"
          },
          {
            id: "q3",
            category: "Technology & Constraints",
            question: isGuj ? "કયા પેમેન્ટ અને શિપિંગ પાર્ટનર્સ જોઈએ છે?" : "Which payment gateway and shipping integrations are mandatory?",
            context_hint: isGuj ? "પેમેન્ટ ગેટવે સિલેક્શન" : "Defines third-party webhook integrations.",
            options: [
              "Stripe / Razorpay + Automated Courier Dispatch (Shiprocket)",
              "Cash on Delivery (COD) with OTP Phone Verification",
              "Global Multi-Currency + PayPal + Apple Pay",
              "UPI Instant QR + Crypto / Buy-Now-Pay-Later (BNPL)"
            ],
            selected_option: "Stripe / Razorpay + Automated Courier Dispatch (Shiprocket)"
          },
          {
            id: "q4",
            category: "AI & Innovation",
            question: isGuj ? "તમે કઈ AI ક્ષમતાથી સેલ્સ વધારવા માંગો છો?" : "What AI transformation capability do you want to prioritize?",
            context_hint: isGuj ? "સ્માર્ટ AI ફીચર" : "Defines AI inference touchpoints.",
            options: [
              "AI Visual Product Search & Instant Style Matching",
              "Personalized Cross-sell / Upsell Recommendation Engine",
              "24/7 AI Shopping Assistant Chatbot with live cart access",
              "Automated Dynamic Pricing & Inventory Restock Predictor"
            ],
            selected_option: "Personalized Cross-sell / Upsell Recommendation Engine"
          }
        ]
      }

      // Universal Generic Business Discovery
      return [
        {
          id: "q1",
          category: "Goals & Audience",
          question: isGuj ? "આ પ્લેટફોર્મનો પ્રાથમિક ઉદ્દેશ્ય અને ટાર્ગેટ યુઝર્સ કોણ છે?" : "What is the primary business model and primary end-user group?",
          context_hint: isGuj ? "મુખ્ય લક્ષ્ય વ્યાખ્યાયિત કરો" : "Defines user persona, authentication, and permission scope.",
          options: [
            "B2B Enterprise Clients with Multi-Role Portals",
            "B2C Direct Consumers with Self-Serve Mobile/Web UI",
            "Internal Operations & Employee Workforce Automation",
            "Two-Sided Marketplace (Buyers & Service Providers)"
          ],
          selected_option: "B2C Direct Consumers with Self-Serve Mobile/Web UI"
        },
        {
          id: "q2",
          category: "Operations & Pain Points",
          question: isGuj ? "હાલમાં પ્રક્રિયામાં સૌથી મોટો અવરોધ ક્યાં છે?" : "What is the most critical manual bottleneck or pain point today?",
          context_hint: isGuj ? "ક્યાં મેન્યુઅલ કામ વધુ થાય છે?" : "Directly guides the future-state automation priorities.",
          options: [
            "Heavy reliance on manual spreadsheets & email follow-ups",
            "Slow customer response times and high repetitive query load",
            "Data fragmentation across multiple disconnected tools",
            "Lack of real-time visibility, reporting, and predictive analytics"
          ],
          selected_option: "Heavy reliance on manual spreadsheets & email follow-ups"
        },
        {
          id: "q3",
          category: "Technology & Constraints",
          question: isGuj ? "ઇન્ફ્રાસ્ટ્રક્ચર અને સિક્યુરિટી માટે તમારી શું પ્રાથમિકતા છે?" : "What are your core infrastructure and security requirements?",
          context_hint: isGuj ? "સિક્યોરિટી અને સ્કેલેબિલિટી" : "Determines database isolation and cloud hosting topology.",
          options: [
            "Cloud-Native Serverless with High Scalability (PostgreSQL + Vercel/AWS)",
            "Strict Enterprise Compliance (Role-Based Access Control + Row Level Security)",
            "Rapid MVP Launch with Zero Maintenance Overhead",
            "Hybrid / On-Premise API Gateway Integration"
          ],
          selected_option: "Cloud-Native Serverless with High Scalability (PostgreSQL + Vercel/AWS)"
        },
        {
          id: "q4",
          category: "AI & Innovation",
          question: isGuj ? "કઈ AI સુવિધાથી તમારી કંપનીમાં સૌથી મોટો બદલાવ આવશે?" : "Which AI technology will deliver the greatest transformational impact?",
          context_hint: isGuj ? "AI સોલ્યુશન પસંદ કરો" : "Shapes the AI microservice architecture.",
          options: [
            "Autonomous Generative AI Assistant with Context Retrieval (RAG)",
            "Intelligent Workflow Automation & Smart Form Processing",
            "Predictive Forecasting & Business Decision Analytics",
            "Real-Time Multilingual Voice & Communication Agent"
          ],
          selected_option: "Autonomous Generative AI Assistant with Context Retrieval (RAG)"
        }
      ]
    }

    if (apiKey && apiKey.trim() !== "") {
      try {
        const candidateModels = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]
        const sysPrompt = `You are a Senior AI Management Consultant conducting a high-impact discovery interview.
Analyze the user's business idea: "${cleanPrompt}".
Generate exactly 4 insightful, tailored discovery questions covering:
1. Goals & Audience
2. Operations & Pain Points
3. Technology & Constraints
4. AI & Innovation

For each question, provide:
- id: "q1", "q2", "q3", "q4"
- category
- question (clear, direct, written in ${language})
- context_hint (why this matters for solution architecture, in ${language})
- options (4 realistic, high-value selectable choices in ${language})
- selected_option (the most recommended default choice)

Return ONLY a JSON array of 4 question objects matching this schema.`

        for (const model of candidateModels) {
          try {
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: sysPrompt }] }],
                  generationConfig: {
                    temperature: 0.3,
                    responseMimeType: "application/json"
                  }
                })
              }
            )

            if (resp.ok) {
              const resData = await resp.json()
              const text = resData.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) {
                const cleaned = text.replace(/^```(json)?|```$/gi, "").trim()
                const parsed = JSON.parse(cleaned)
                const questionsArray: DiscoveryQuestion[] = Array.isArray(parsed)
                  ? parsed
                  : (parsed.questions || parsed.discovery_questions || Object.values(parsed).find(v => Array.isArray(v)) || [])
                
                if (questionsArray && questionsArray.length > 0) {
                  return NextResponse.json({
                    success: true,
                    questions: questionsArray,
                    consultant_summary: `Tailored discovery interview calibrated for "${cleanPrompt.slice(0, 50)}..."`
                  })
                }
              }
            }
          } catch (mErr) {
            console.warn(`Discovery Gemini ${model} failed, trying next`, mErr)
          }
        }
      } catch (err) {
        console.warn("Gemini discovery failed, falling back to domain logic", err)
      }
    }

    const fallbackQuestions = getDomainDiscoveryQuestions(cleanPrompt, language)
    return NextResponse.json({
      success: true,
      questions: fallbackQuestions,
      consultant_summary: "Domain-calibrated enterprise discovery assessment"
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate discovery questions" }, { status: 500 })
  }
}
