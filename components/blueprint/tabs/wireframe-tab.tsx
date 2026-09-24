"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, LayoutTemplate, Loader2 } from "lucide-react"

export function WireframeTab({ generated, data }: { generated: boolean; data?: any }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!generated) {
    return (
      <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
        Input requirements on the left to generate the low-fidelity UX Wireframe concept.
      </div>
    )
  }

  const title = data?.project_title || "Custom Enterprise Solution"
  const userProblem = data?.user_problem || ""
  const sections = data?.wireframe_sections || [
    { title: "Authentication", components: ["Email", "Password", "Sign In"] },
    { title: "Main Interface", components: ["Sidebar", "Main Content"] },
    { title: "Settings & Payment", components: ["Credit Card", "Checkout"] }
  ]

  // Detect the overall application type from the user's prompt
  const globalText = (title + " " + userProblem).toLowerCase();
  const isChatbotApp = globalText.includes("chat") || globalText.includes("bot") || globalText.includes("assistant") || globalText.includes("gpt");

  // Pure, Minimalist Low-Fidelity Wireframe Renderer
  const CleanWireframe = ({ sectionTitle, components, index }: { sectionTitle: string, components: string[], index: number }) => {
    
    // GUARANTEE 3 DIFFERENT SCREENS BASED ON INDEX (User Journey Flow)
    const isLoginScreen = index === 0;
    const isCoreScreen = index === 1;
    const isCheckoutOrSettingsScreen = index === 2;

    return (
      <div className="w-full rounded-md border border-slate-400 bg-white mb-10 overflow-hidden shadow-sm">
        
        {/* Browser Chrome */}
        <div className="bg-[#b3b3b3] border-b border-slate-400 px-3 py-2 flex items-center gap-3">
          <div className="flex gap-2 text-slate-700">
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            <RotateCw className="w-4 h-4 stroke-[2.5] mt-0.5" />
            <Home className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="bg-white border border-slate-400 rounded-sm h-6 flex-1 max-w-2xl mx-2 flex items-center px-2 text-[10px] text-slate-400 font-mono">
            https://app.internal/{isLoginScreen ? 'login' : isCoreScreen ? 'app' : 'checkout'}
          </div>
        </div>

        {/* Wireframe Body */}
        <div className="bg-white p-6 min-h-[450px] flex flex-col">
          
          {/* Universal Header */}
          <div className="flex justify-between items-center mb-8 border-b border-slate-300 pb-4">
            <div className="w-12 h-10 border border-slate-600 relative overflow-hidden flex items-center justify-center bg-[#f8f8f8]">
               <div className="absolute w-[150%] h-[1px] bg-slate-400 rotate-[35deg]" />
               <div className="absolute w-[150%] h-[1px] bg-slate-400 -rotate-[35deg]" />
            </div>
            <div className="text-sm font-bold text-slate-700 italic">{sectionTitle}</div>
            <div className="flex gap-3">
               <div className="border border-slate-500 rounded-full px-5 py-1 text-[10px] text-slate-700 font-medium italic">Menu</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            
            {/* SCREEN 1: LOGIN / SIGNUP */}
            {isLoginScreen && (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="text-lg italic font-bold text-slate-700 mb-6">Welcome / Authentication</div>
                <div className="w-full max-w-sm bg-[#f8f8f8] border border-slate-400 rounded-sm p-8 flex flex-col items-center gap-5 shadow-sm">
                  <div className="w-full border border-slate-500 bg-white py-3 px-4 text-[11px] text-slate-400 font-medium italic rounded-sm text-left">
                    Email Address...
                  </div>
                  <div className="w-full border border-slate-500 bg-white py-3 px-4 text-[11px] text-slate-400 font-medium italic rounded-sm text-left">
                    Password...
                  </div>
                  <div className="w-full border border-slate-600 bg-slate-200 py-3 px-4 text-center text-[11px] text-slate-700 font-bold italic rounded-full mt-2">
                    Login / Sign Up
                  </div>
                  <div className="text-[9px] text-slate-500 italic mt-2">Forgot password?</div>
                </div>
              </div>
            )}

            {/* SCREEN 2: CORE APP (CHATGPT OR STORE) */}
            {isCoreScreen && isChatbotApp && (
              /* ChatGPT-style Layout */
              <div className="flex-1 flex gap-4 h-[400px]">
                 {/* Chat History Sidebar */}
                 <div className="w-48 border border-slate-400 bg-[#f8f8f8] rounded-sm p-4 flex flex-col gap-3">
                    <div className="text-[10px] font-bold italic text-slate-700 border-b border-slate-300 pb-2 mb-2">+ New Chat</div>
                    {[1,2,3,4].map(i => <div key={i} className="h-4 w-3/4 bg-slate-200" />)}
                 </div>
                 {/* Main Chat Area */}
                 <div className="flex-1 border border-slate-400 bg-[#f4f4f5] flex flex-col p-6 rounded-sm relative">
                    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto flex-1">
                       {/* AI Message */}
                       <div className="flex gap-4 w-full">
                         <div className="w-8 h-8 rounded-full border border-slate-400 flex-shrink-0 bg-white" />
                         <div className="flex-1 border border-slate-400 bg-white p-4 rounded-sm text-[11px] italic text-slate-600">
                           Hello! I am your AI Assistant. How can I help you today?
                         </div>
                       </div>
                       {/* User Message */}
                       <div className="flex gap-4 w-full flex-row-reverse">
                         <div className="w-8 h-8 rounded-full border border-slate-400 flex-shrink-0 bg-[#e2e2e2]" />
                         <div className="flex-1 border border-slate-400 bg-[#e2e2e2] p-4 rounded-sm text-[11px] italic text-slate-700 text-right">
                           {components[0] || "User prompt here..."}
                         </div>
                       </div>
                    </div>
                    {/* Chat Input Field */}
                    <div className="w-full max-w-2xl mx-auto mt-4 h-12 border border-slate-500 bg-white rounded-sm flex items-center px-4 justify-between shadow-sm">
                       <div className="text-[11px] italic text-slate-400">Message ChatGPT...</div>
                       <div className="w-6 h-6 border border-slate-400 rounded-sm bg-[#e2e2e2] flex items-center justify-center text-[10px]">↑</div>
                    </div>
                 </div>
              </div>
            )}

            {isCoreScreen && !isChatbotApp && (
              /* Store / Catalog Grid Layout */
              <div className="flex-1 flex gap-6">
                {/* Left Sidebar (Filters) */}
                <div className="w-48 border border-slate-400 bg-[#f8f8f8] rounded-sm p-4 flex flex-col gap-4">
                  <div className="text-[11px] font-bold italic text-slate-700 border-b border-slate-300 pb-2">Categories / Filters</div>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-3 h-3 border border-slate-400 bg-white" />
                       <div className="h-2 w-16 bg-slate-300" />
                    </div>
                  ))}
                </div>
                {/* Product Grid */}
                <div className="flex-1 flex flex-col">
                  <div className="text-xs italic text-slate-600 font-bold mb-4">Product Catalog</div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="border border-slate-400 bg-white p-3 flex flex-col gap-3 rounded-sm shadow-sm">
                          {/* Image Placeholder */}
                          <div className="w-full h-24 border border-slate-300 bg-[#f8f8f8] flex items-center justify-center relative overflow-hidden">
                             <div className="absolute w-[150%] h-[1px] bg-slate-300 rotate-[35deg]" />
                             <div className="absolute w-[150%] h-[1px] bg-slate-300 -rotate-[35deg]" />
                          </div>
                          {/* Product Info Lines */}
                          <div className="space-y-1.5">
                             <div className="h-2 w-full bg-slate-400" />
                             <div className="h-2 w-1/3 bg-slate-300" />
                          </div>
                          {/* Add to Cart button */}
                          <div className="mt-2 w-full border border-slate-400 bg-slate-100 py-1.5 text-center text-[9px] italic text-slate-700 font-bold rounded-sm cursor-pointer">
                            {components[i % components.length] || "Add to Cart"}
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: PAYMENT / CHECKOUT / SETTINGS */}
            {isCheckoutOrSettingsScreen && (
              <div className="flex-1 flex justify-center py-6">
                <div className="w-full max-w-3xl border border-slate-400 bg-[#f8f8f8] rounded-sm flex overflow-hidden shadow-sm">
                  {/* Left: Payment Form */}
                  <div className="w-3/5 border-r border-slate-400 bg-white p-8 flex flex-col gap-5">
                     <div className="text-sm font-bold italic text-slate-700 border-b border-slate-300 pb-2">
                       {isChatbotApp ? "Account Settings & Upgrade" : "Payment & Checkout"}
                     </div>
                     <div className="space-y-2">
                       <div className="text-[10px] italic text-slate-600">Card Number</div>
                       <div className="w-full h-8 border border-slate-400 rounded-sm" />
                     </div>
                     <div className="flex gap-4">
                       <div className="flex-1 space-y-2">
                         <div className="text-[10px] italic text-slate-600">Expiry (MM/YY)</div>
                         <div className="w-full h-8 border border-slate-400 rounded-sm" />
                       </div>
                       <div className="flex-1 space-y-2">
                         <div className="text-[10px] italic text-slate-600">CVC</div>
                         <div className="w-full h-8 border border-slate-400 rounded-sm" />
                       </div>
                     </div>
                     <div className="w-full border border-slate-600 bg-slate-200 py-2.5 text-center text-[11px] text-slate-700 font-bold italic rounded-sm mt-4">
                        {isChatbotApp ? "Upgrade to Plus" : "Complete Purchase"}
                     </div>
                  </div>
                  {/* Right: Order Summary */}
                  <div className="w-2/5 p-6 flex flex-col gap-4 bg-[#f8f8f8]">
                    <div className="text-xs font-bold italic text-slate-700">Summary</div>
                    <div className="flex-1 border border-slate-400 bg-white p-4 rounded-sm flex flex-col gap-3">
                       <div className="h-3 w-3/4 bg-slate-200" />
                       <div className="h-3 w-1/2 bg-slate-200" />
                       <div className="h-3 w-2/3 bg-slate-200" />
                    </div>
                    <div className="h-8 border border-slate-400 bg-white rounded-sm flex items-center justify-between px-3">
                       <div className="text-[10px] italic font-bold">Total</div>
                       <div className="text-[10px] italic font-bold">$99.00</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  const exportPDF = async () => {
    const element = document.getElementById("wireframes-export");
    if (!element) return;
    
    try {
      setIsExporting(true);
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if the image is taller than one A4 page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Shift image up by the amount we've already printed
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save("wireframes-complete.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-300 bg-[#f4f4f5] p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-slate-600" />
            User Journey Wireframes
          </h3>
          <p className="text-xs text-slate-500 mt-1">Sequential flow based on: {isChatbotApp ? "AI Assistant Application" : "E-Commerce / Enterprise Platform"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Download PDF"}
          </button>
          <span className="rounded-sm bg-white px-3 py-1 text-[10px] font-bold text-slate-600 border border-slate-400 uppercase tracking-widest hidden md:inline-block">
            Wireframe Mode
          </span>
        </div>
      </div>

      <div id="wireframes-export" className="space-y-4 bg-[#f4f4f5] p-2">
        {sections.map((section: any, idx: number) => (
          <CleanWireframe key={idx} index={idx} sectionTitle={section.title} components={section.components} />
        ))}
      </div>
    </div>
  )
}