"use client";
import { getTranslation } from "@/lib/i18n"
import { GitCommitHorizontal, CheckCircle2, ArrowRight } from "lucide-react"

export function BpmnTab({ generated, data, targetLanguage = "English" }: { generated: boolean; data?: any; targetLanguage?: string }) {
  const lang = (targetLanguage || data?.target_language || "English").toLowerCase()
  const isGuj = lang.includes("gu")
  const isHindi = lang.includes("hi")

  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        {isGuj
          ? "પ્રોજેક્ટ ગાઈડ જોવા માટે ડાબી બાજુ રિક્વાયરમેન્ટ દાખલ કરો."
          : isHindi
          ? "विज़ुअल प्रोसेस वर्कफ़्लो उत्पन्न करने के लिए बाईं ओर आवश्यकताएं दर्ज करें।"
          : "Input requirements on the left to generate the visual process workflow."}
      </div>
    )
  }

  const steps = data?.bpmn_steps || [
    {
      id: 1,
      title: isGuj ? "સ્ટેપ 1: ડિઝાઇન અને હોમપેજ" : isHindi ? "चरण 1: डिज़ाइन और होमपेज" : "Step 1: Design & Homepage",
      desc: isGuj ? "સૌ પ્રથમ, વપરાશકર્તાઓ માટે આકર્ષક અને સરળ હોમપેજ ડિઝાઇન તૈયાર થશે." : isHindi ? "सबसे पहले, उपयोगकर्ताओं के लिए एक सुंदर और आकर्षक होमपेज तैयार करेंगे।" : "First, we will design a beautiful and attractive homepage for your users."
    },
    {
      id: 2,
      title: isGuj ? "સ્ટેપ 2: ફીચર્સ અને પ્રોડક્ટ કેટલોગ" : isHindi ? "चरण 2: सुविधाएं और उत्पाद कैटलॉग" : "Step 2: Features & Catalog",
      desc: isGuj ? "ત્યારબાદ, મુખ્ય ફીચર્સ, સર્ચ ફિલ્ટર્સ અને પ્રોડક્ટ કેટલોગ ઉમેરવામાં આવશે." : isHindi ? "इसके बाद, मुख्य विशेषताएं और उत्पाद कैटलॉग जोड़ेंगे।" : "Next, we will add the core features and product catalog so users can interact."
    },
    {
      id: 3,
      title: isGuj ? "સ્ટેપ 3: ડેટાબેઝ અને API સેટઅપ" : isHindi ? "चरण 3: डेटाबेस सेटअप" : "Step 3: Database Setup",
      desc: isGuj ? "બધો ડેટા સુરક્ષિત રાખવા માટે PostgreSQL ડેટાબેઝ અને REST API સેટઅપ થશે." : isHindi ? "सभी उपयोगकर्ता डेटा को सुरक्षित रखने के लिए बैकएंड डेटाबेस सेट करेंगे।" : "Then, we will set up the backend database to save all user data securely."
    },
    {
      id: 4,
      title: isGuj ? "સ્ટેપ 4: ટેસ્ટિંગ અને લાઇવ લોન્ચ" : isHindi ? "चरण 4: परीक्षण और लॉन्च" : "Step 4: Testing & Launch",
      desc: isGuj ? "છેલ્લે, સમગ્ર એપ્લિકેશનનું ટેસ્ટિંગ કરીને ઇન્ટરનેટ પર લાઇવ કરવામાં આવશે!" : isHindi ? "अंत में, हम सब कुछ परीक्षण करेंगे और वेबसाइट को इंटरनेट पर लाइव करेंगे!" : "Finally, we will test everything and launch the website live on the internet!"
    }
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          {isGuj ? "સ્ટેપ-બાય-સ્ટેપ પ્રોજેક્ટ ગાઈડ" : isHindi ? "स्टेप-बाय-स्टेप प्रोजेक्ट गाइड" : "Step-by-Step Project Guide"}
        </h2>
        <p className="text-sm text-slate-600">
          {isGuj
            ? "આ તમારો સંપૂર્ણ અને સરળ એક્શન પ્લાન છે. પ્રોજેક્ટ પૂરો કરવા માટે આ પગલાં અનુસરો."
            : isHindi
            ? "यह आपकी पूरी और समझने में आसान कार्य योजना है। प्रोजेक्ट पूरा करने के लिए इन चरणों का पालन करें।"
            : "This is your complete, easy-to-understand action plan. Follow these exact steps to build your project from start to finish."}
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step: any, idx: number) => (
          <div key={step.id || idx} className="flex flex-col md:flex-row gap-5 p-6 rounded-2xl bg-[#f8f9fa] border border-slate-200 transition-all hover:border-emerald-300 hover:shadow-md">
            
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-extrabold border-2 border-emerald-200">
                {idx + 1}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{step.desc}</p>
              
              {step.phase && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white text-slate-600 border border-slate-200 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {isGuj ? "ફેઝ" : isHindi ? "चरण" : "Phase"}: {step.phase}
                  </span>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}


