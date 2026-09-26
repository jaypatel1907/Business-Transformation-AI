"use client"

import { useState } from "react"
import { useRole } from "@/lib/role-context"
import { getTranslation } from "@/lib/i18n"
import { DeepBusinessAnalysis, GapItem, GapCategory, GapSeverity, AIOpportunityItem } from "@/lib/discovery-types"
import {
  BrainCircuit,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  Save,
  Check,
  Building,
  Target,
  Cpu,
  Zap,
  BarChart3,
  Users,
  Database,
  Briefcase
} from "lucide-react"

interface AnalysisTabProps {
  generated: boolean
  data?: any
  targetLanguage?: string
  onUpdateAnalysis?: (updatedAnalysis: DeepBusinessAnalysis) => void
  onApproveAnalysis?: (analysis: DeepBusinessAnalysis) => void
}

export function AnalysisTab({
  generated,
  data,
  targetLanguage = "English",
  onUpdateAnalysis,
  onApproveAnalysis
}: AnalysisTabProps) {
  const { role } = useRole()
  const isEmployee = role === "Employee"

  const rawLang = targetLanguage || data?.target_language || "English"
  const lang = rawLang.toLowerCase()
  const isGuj = lang.includes("gu")
  const isHindi = lang.includes("hi")
  const isSpanish = lang.includes("es") || lang.includes("span")
  const isFr = lang.includes("fr") || lang.includes("fren")
  const isDe = lang.includes("de") || lang.includes("germ")

  // Multi-language helper
  const t = (gu: string, hi: string, es: string, fr: string, de: string, en: string): string => {
    if (isGuj) return gu
    if (isHindi) return hi
    if (isSpanish) return es
    if (isFr) return fr
    if (isDe) return de
    return en
  }

  // Fallback / default rich analysis structure if not populated
  const defaultAnalysis: DeepBusinessAnalysis = data?.business_analysis || {
    project_title:
      data?.project_title ||
      t(
        "એન્ટરપ્રાઇઝ સોલ્યુશન આર્કિટેક્ચર",
        "एंटरप्राइज सॉल्यूशन आर्किटेक्चर",
        "Arquitectura de Solución Empresarial",
        "Architecture de Solution d'Entreprise",
        "Enterprise-Lösungsarchitektur",
        "Enterprise Solution Architecture"
      ),
    executive_summary: {
      strategic_intent:
        data?.user_problem ||
        t(
          "AI ઓટોમેશન, રિયલ-ટાઇમ એનાલિટિક્સ અને સ્કેલેબલ ક્લાઉડ આર્કિટેક્ચર દ્વારા મુખ્ય કામગીરીનું આધુનિકીકરણ.",
          "AI स्वचालन, रीयल-टाइम एनालिटिक्स और स्केलेबल क्लाउड आर्किटेक्चर के माध्यम से मुख्य कार्यों का आधुनिकीकरण।",
          "Transformar operaciones clave con automatización de IA, analítica en tiempo real y nube escalable.",
          "Transformer les opérations clés grâce à l'automatisation IA, aux analyses en temps réel et au cloud.",
          "Kernprozesse mit KI-Automatisierung, Echtzeitanalysen und skalierbarer Cloud-Architektur transformieren.",
          "Transform core operations with AI automation, real-time analytics, and scalable cloud architecture."
        ),
      key_value_drivers: [
        t("મેન્યુઅલ ઓપરેશનલ સમયમાં 70% ઘટાડો", "मैन्युअल परिचालन विलंबता में 70% की कमी", "Reducción del 70% en latencia operativa manual", "Réduction de 70% de la latence opérationnelle manuelle", "70% Reduzierung der manuellen Durchlaufzeit", "70% reduction in manual operational latency"),
        t("AI એજન્ટો દ્વારા 24/7 આપમેળે ગ્રાહક સેવા", "AI एजेंटों के माध्यम से स्वचालित 24/7 ग्राहक सेवा", "Interacciones de clientes automatizadas 24/7 mediante agentes IA", "Interactions clients automatisées 24/7 via agents IA", "Automatisierte 24/7-Kundeninteraktion über KI-Agenten", "Automated 24/7 client interactions via AI agents"),
        t("બધા વિભાગોમાં રિયલ-ટાઇમ ડેટા પારદર્શિતા", "सभी विभागों में रीयल-टाइम डेटा दृश्यता", "Visibilidad de datos en tiempo real en todos los departamentos", "Visibilité des données en temps réel entre les départements", "Abteilungsübergreifende Echtzeit-Datentransparenz", "Unified real-time data visibility across departments"),
        t("ડબલ-બુકિંગ અને ઇન્વેન્ટરી મેળ ન ખાવાની સમસ્યાઓ દૂર", "डबल-बुकिंग और इन्वेंटरी बेमेल का उन्मूलन", "Eliminación de reservas duplicadas y errores de inventario", "Élimination des doubles réservations et erreurs de stock", "Beseitigung von Doppelbuchungen und Bestandsdiskrepanzen", "Elimination of double-bookings & inventory mismatches")
      ],
      projected_roi_percentage: "320%",
      estimated_payback_months: t("4.5 મહિના", "4.5 महीने", "4.5 Meses", "4.5 Mois", "4.5 Monate", "4.5 Months"),
      operational_efficiency_gain: "65%"
    },
    current_state: {
      summary: t(
        "સ્પ્રેડશીટ્સ અને જૂના મેન્યુઅલ ટૂલ્સ સાથે વિખરાયેલું કામકાજ અને ધીમો ગ્રાહક સપોર્ટ.",
        "मैन्युअल स्प्रेडशीट, असंबद्ध पुराने टूल और धीमी ग्राहक प्रतिक्रिया के साथ बिखरा हुआ संचालन।",
        "Operaciones fragmentadas con hojas de cálculo manuales, herramientas heredadas y tiempos de respuesta lentos.",
        "Opérations fragmentées avec tableurs manuels, outils obsolètes et délais de réponse lents.",
        "Fragmentierte Abläufe mit Tabellenkalkulationen, isolierten Altsystemen und langen Antwortzeiten.",
        "Fragmented operations with manual spreadsheets, disconnected legacy tools, and slow customer resolution times."
      ),
      manual_workflows: [
        t("ફોન/ઇમેઇલ દ્વારા મેન્યુઅલ ઓર્ડર અને બુકિંગ પ્રોસેસિંગ", "फोन/ईमेल द्वारा मैन्युअल ऑर्डर और बुकिंग प्रसंस्करण", "Procesamiento manual de pedidos y reservas por teléfono/correo", "Traitement manuel des commandes et réservations par e-mail/téléphone", "Manuelle Bestell- und Buchungsbearbeitung per Telefon/E-Mail", "Manual phone/email order & booking processing"),
        t("વિખરાયેલી ઇન્વેન્ટરી ગણતરી અને સ્પ્રેડશીટ અપડેટ્સ", "असंगठित इन्वेंटरी गणना और स्प्रेडशीट अपडेट", "Conteo de inventario manual y actualizaciones en hojas de cálculo", "Comptage manuel des stocks et saisies sur tableur", "Manuelle Bestandszählung und Tabellenaktualisierungen", "Disjointed inventory counting and spreadsheet updates"),
        t("મેન્યુઅલ ગ્રાહક પૂછપરછ અને વિલંબિત જવાબો", "मैन्युअल ग्राहक पूछताछ और विलंबित प्रतिक्रिया", "Triaje manual de consultas de clientes con demoras", "Traitement manuel des demandes clients et délais d'attente", "Manuelle Kundenanfragen-Sortierung mit Verzögerungen", "Manual customer query triage and delayed response")
      ],
      core_bottlenecks: [
        t("પીક અવર્સ દરમિયાન સ્ટાફ પર વધુ પડતો બોજ", "व्यस्त घंटों के दौरान कर्मचारियों का अत्यधिक ओवरटाइम", "Horas extras elevadas del personal durante picos de trabajo", "Heures supplémentaires élevées du personnel en période de pointe", "Hohe Überstunden des Personals zu Spitzenzeiten", "High staff overtime during peak operational hours"),
        t("મલ્ટી-ચેનલ રિયલ-ટાઇમ સિંક્રનાઇઝેશનનો અભાવ", "मल्टी-चैनल रीयल-टाइम सिंक्रोनाइज़ेशन की कमी", "Falta de sincronización multicanal en tiempo real", "Manque de synchronisation multicanal en temps réel", "Fehlende mandantenfähige Echtzeit-Synchronisation", "Lack of real-time multi-channel synchronization"),
        t("મેન્યુઅલ ભૂલો અને ડેટા અસંગતતાનું જોખમ", "मानवीय प्रविष्टि त्रुटियों और डेटा विसंगतियों का जोखिम", "Propenso a errores humanos de entrada y datos inconsistentes", "Sujet aux erreurs de saisie manuelle et aux incohérences", "Anfällig für manuelle Eingabefehler und Dateninkonsistenzen", "Prone to human entry errors and data inconsistency")
      ],
      legacy_limitations: [
        t("સેન્ટ્રલાઈઝ્ડ API ગેટવે અથવા ઈવેન્ટ સ્ટ્રીમિંગ નથી", "कोई केंद्रीकृत API गेटवे या रीयल-टाइम इवेंट स्ट्रीमिंग नहीं", "Sin pasarela API centralizada ni transmisión de eventos", "Aucune passerelle API centralisée ni streaming d'événements", "Kein zentrales API-Gateway oder Event-Streaming", "No centralized API gateway or real-time event streaming"),
        t("એકીકૃત એનાલિટિક્સ વિના અલગ-અલગ યુઝર રેકોર્ડ્સ", "एकीकृत एनालिटिक्स के बिना अलग-अलग उपयोगकर्ता रिकॉर्ड", "Registros de usuarios aislados sin analítica unificada", "Dossiers utilisateurs cloisonnés sans analyse unifiée", "Isolierte Benutzerdatensätze ohne einheitliche Analysen", "Siloed user records without unified analytics")
      ]
    },
    future_state: {
      vision_summary: t(
        "ઓટોનોમસ AI એજન્ટો, ત્વરિત ચેકઆઉટ અને રિયલ-ટાઇમ એનાલિટિક્સ સાથેનું આધુનિક ડિજિટલ પ્લેટફોર્મ.",
        "स्वायत्त AI एजेंटों, त्वरित चेकआउट और रीयल-टाइम परिचालन टेलीमेट्री के साथ आधुनिक डिजिटल प्लेटफ़ॉर्म।",
        "Empresa digital aumentada con IA, flujos autónomos, checkout instantáneo y telemetría en tiempo real.",
        "Entreprise numérique augmentée par l'IA avec flux autonomes, paiement instantané et télémétrie en temps réel.",
        "KI-gestütztes digitales Unternehmen mit autonomen Workflows, Sofort-Checkout und Echtzeit-Telemetrie.",
        "AI-augmented digital enterprise with autonomous agent workflows, instant checkout, and real-time operational telemetry."
      ),
      automated_workflows: [
        t("ત્વરિત સેલ્ફ-સર્વિસ વેબ અને મોબાઇલ ડિજિટલ જર્ની", "त्वरित सेल्फ-सर्विस वेब और मोबाइल डिजिटल अनुभव", "Recorrido digital instantáneo de autoservicio web y móvil", "Parcours numérique instantané en libre-service web et mobile", "Sofortiger Self-Service-Web- und Mobile-Workflow", "Instant self-service web & mobile digital journey"),
        t("24/7 ગ્રાહક સેવા અને બુકિંગ માટે ઓટોનોમસ AI એજન્ટ", "24/7 ग्राहक पूछताछ और बुकिंग के लिए स्वायत्त AI एजेंट", "Agente autónomo de IA para consultas y reservas 24/7", "Agent IA autonome pour les requêtes clients et réservations 24/7", "Autonomer KI-Agent für 24/7-Kundenanfragen und Buchungen", "Autonomous AI agent for 24/7 customer queries & booking"),
        t("ત્વરિત વેબહૂક સિંક સાથે રિયલ-ટાઇમ PostgreSQL ડેટાબેઝ", "त्वरित वेबहुक सिंक के साथ रीयल-टाइम PostgreSQL डेटाबेस", "Estado de base de datos PostgreSQL en tiempo real con webhooks", "Base PostgreSQL en temps réel avec synchronisation instantanée par webhooks", "Echtzeit-PostgreSQL-Datenbank mit sofortiger Webhook-Synchronisation", "Real-time PostgreSQL database state with instant webhook sync")
      ],
      ai_transformation_touchpoints: [
        t("ઓર્ડર અને એપોઇન્ટમેન્ટ માટે કન્વર્ઝેશનલ AI આસિસ્ટન્ટ", "ऑर्डर और अपॉइंटमेंट के लिए संवादात्मक AI सहायक", "Asistente de IA conversacional para triaje de pedidos y citas", "Assistant IA conversationnel pour le tri des commandes et rendez-vous", "KI-Dialogassistent für Bestell- und Termin-Triage", "Conversational AI Assistant for order & appointment triage"),
        t("ડિમાન્ડ પ્રિડિક્શન અને સ્માર્ટ રિસોર્સ ફાળવણી", "मांग पूर्वानुमान और स्मार्ट संसाधन आवंटन", "Previsión predictiva de la demanda y asignación de recursos", "Prévision de la demande et allocation intelligente des ressources", "Prädiktive Nachfrageprognose und Ressourcenallokation", "Predictive demand forecasting & resource allocation"),
        t("ઇન્ટેલિજન્ટ એક્સેપ્શન એલર્ટ્સ અને વિસંગતતા શોધ", "इंटेलिजेंट अपवाद अलर्ट और विसंगति पहचान", "Alertas inteligentes de excepciones y detección de anomalías", "Alertes d'exceptions intelligentes et détection d'anomalies", "Intelligente Ausnahmebenachrichtigungen & Anomalieerkennung", "Intelligent exception alerts & anomaly detection")
      ],
      target_kpis: [
        t("એક સેકન્ડથી ઓછા સમયમાં ઓર્ડર કન્ફર્મેશન", "एक सेकंड से भी कम समय में ऑर्डर पुष्टि", "Latencia de confirmación de pedidos inferior a un segundo", "Confirmation de commande en moins d'une seconde", "Bestellbestätigung in unter einer Sekunde", "Sub-second order confirmation latency"),
        t("સ્કેલેબલ ક્લાઉડ સાથે 99.9% અપટાઇમ", "स्केलेबल क्लाउड के साथ 99.9% अपटाइम", "99.9% de tiempo de actividad con infraestructura en la nube", "Disponibilité de 99.9% avec cloud évolutif", "99,9% Betriebszeit mit skalierbarer Cloud", "99.9% uptime with scalable serverless cloud"),
        t("90%+ ગ્રાહક સંતોષ સ્કોર (CSAT)", "90%+ सकारात्मक ग्राहक संतुष्टि स्कोर (CSAT)", "Más del 90% de puntuación de satisfacción del cliente (CSAT)", "Score de satisfaction client (CSAT) supérieur à 90%", "90%+ Kundenzufriedenheit (CSAT)", "90%+ positive customer satisfaction score (CSAT)")
      ]
    },
    gap_analysis: [
      {
        id: "gap-1",
        category: "Process",
        current_state: t("ફોન/કાગળ દ્વારા મેન્યુઅલ ઓર્ડર અને રિઝર્વેશન", "फोन/कागज के माध्यम से मैन्युअल ऑर्डर और आरक्षण", "Toma de pedidos y reservas manuales en papel/teléfono", "Prise de commandes et réservations manuelles sur papier/téléphone", "Manuelle Bestell- und Reservierungsaufnahme auf Papier/Telefon", "Manual order taking and reservation tracking via paper/phone"),
        future_state: t("સંપૂર્ણ ઓટોમેટેડ ડિજિટલ બુકિંગ અને ઓર્ડર ડિસ્પેચ", "स्वचालित एंड-टू-एंड डिजिटल बुकिंग और ऑर्डर डिस्पैच", "Reserva y despacho de pedidos digital automatizado de extremo a extremo", "Réservation et expédition de commandes 100% automatisées", "Durchgängig automatisierte digitale Buchung & Auftragsabwicklung", "Automated end-to-end digital booking & order dispatch"),
        gap_description: t("ઓટોમેટેડ શેડ્યુલિંગ અને પેમેન્ટ ગેટવેનો અભાવ", "स्वचालित शेड्यूलिंग और पेमेंट गेटवे का अभाव", "Falta de programación automatizada y pasarela de pago", "Absence de planification automatisée et de passerelle de paiement", "Fehlende automatisierte Terminplanung und Zahlungsabwicklung", "Missing automated scheduling and payment gateway capture"),
        severity: "Critical",
        mitigation_strategy: t("વેબહૂક પેમેન્ટ કન્ફર્મેશન સાથે ડાયરેક્ટ API ચેકઆઉટ લાગુ કરો", "वेबहुक भुगतान पुष्टि के साथ डायरेक्ट API चेकआउट लागू करें", "Implementar checkout directo con confirmación de pago por webhook", "Intégrer le paiement direct par API avec confirmation par webhook", "Direkten API-Checkout mit Webhook-Zahlungsbestätigung implementieren", "Implement direct API checkout with webhook payment confirmation")
      },
      {
        id: "gap-2",
        category: "Technology",
        current_state: t("સેન્ટ્રલ API ડેટાબેઝ વિનાના વિખરાયેલા ટૂલ્સ", "सेंट्रल API डेटाबेस के बिना असंबद्ध टूल्स", "Herramientas fragmentadas sin base de datos API centralizada", "Outils fragmentés sans base de données API centralisée", "Fragmentierte Tools ohne zentrale API-Datenbank", "Fragmented tools with no central API database"),
        future_state: t("રો-લેવલ સિક્યુરિટી (RLS) સાથે ક્લાઉડ-નેટિવ PostgreSQL", "रो-लेवल सिक्योरिटी (RLS) के साथ क्लाउड-नेटिव PostgreSQL", "Base de datos PostgreSQL en la nube con seguridad RLS", "Base de données PostgreSQL cloud-native avec sécurité RLS", "Cloud-native PostgreSQL-Datenbank mit Row-Level Security (RLS)", "Cloud-native PostgreSQL database with Row-Level Security (RLS)"),
        gap_description: t("રિલેશનલ સ્કીમા અને યુનિફાઇડ REST એન્ડપોઇન્ટ્સનો અભાવ", "रिलेशनल स्कीमा और एकीकृत REST एंडपॉइंट्स की कमी", "Falta de esquema relacional y endpoints REST unificados", "Manque de schéma relationnel et de points d'accès REST unifiés", "Fehlendes relationales Schema und einheitliche REST-Endpunkte", "Lack of relational schema and unified REST endpoints"),
        severity: "High",
        mitigation_strategy: t("સ્ટ્રક્ચર્ડ ટેબલ્સ અને રોલ-બેઝ્ડ એક્સેસ કંટ્રોલ (RBAC) બનાવો", "संरचित टेबल और भूमिका-आधारित एक्सेस कंट्रोल (RBAC) बनाएं", "Aprovisionar tablas estructuradas y control de acceso (RBAC)", "Configurer des tables structurées et le contrôle d'accès (RBAC)", "Strukturierte Tabellen und rollenbasierte Zugriffskontrolle (RBAC) bereitstellen", "Provision structured tables and role-based access control (RBAC)")
      },
      {
        id: "gap-3",
        category: "Data",
        current_state: t("અલગ-અલગ ઑફલાઇન ફાઇલોમાં સંગ્રહિત ગ્રાહક હિસ્ટ્રી", "अलग-अलग ऑफ़लाइन फ़ाइलों में संग्रहीत ग्राहक इतिहास", "Historial de compras almacenado en archivos desconectados", "Historique d'achats stocké dans des fichiers hors ligne disparates", "Kundenkaufhistorie in separaten Offline-Dateien gespeichert", "Customer purchase history stored in disparate offline files"),
        future_state: t("રિયલ-ટાઇમ ટેલિમેટ્રી સાથે એકીકૃત ગ્રાહક 360 પ્રોફાઇલ", "रीयल-टाइम टेलीमेट्री के साथ एकीकृत ग्राहक 360 प्रोफ़ाइल", "Perfil de cliente 360 unificado con telemetría en tiempo real", "Profil client 360 unifié avec télémétrie en temps réel", "Einheitliches 360-Grad-Kundenprofil mit Echtzeit-Telemetrie", "Unified customer 360 profile with real-time telemetry"),
        gap_description: t("વ્યક્તિગત ભલામણો અથવા લોયલ્ટી એન્જિન ચલાવવામાં અસમર્થતા", "व्यक्तिगत अनुशंसाएं या लॉयल्टी इंजन चलाने में असमर्थता", "Incapacidad para ejecutar motores de recomendación o fidelización", "Incapacité à exécuter des moteurs de recommandation ou fidélité", "Unfähigkeit zur Durchführung personalisierter Empfehlungen", "Inability to run personalized recommendation or loyalty engines"),
        severity: "Medium",
        mitigation_strategy: t("સુરક્ષિત એન્ક્રિપ્ટેડ ડેટાબેઝમાં યુઝર પ્રોફાઇલ્સ એકત્રિત કરો", "सुरक्षित एन्क्रिप्टेड डेटाबेस में उपयोगकर्ता प्रोफ़ाइल समेकित करें", "Consolidar perfiles de usuario en una base de datos cifrada y segura", "Consolider les profils utilisateurs dans une base sécurisée et chiffrée", "Benutzerprofile in einer sicheren verschlüsselten Datenbank zusammenführen", "Consolidate user profiles in a secure encrypted database")
      },
      {
        id: "gap-4",
        category: "People",
        current_state: t("સ્ટાફ નિયમિત પુનરાવર્તિત પ્રશ્નો પર 60% સમય વિતાવે છે", "कर्मचारी नियमित दोहराव वाले प्रश्नों पर 60% समय बिताते हैं", "El personal dedica el 60% de su tiempo a consultas repetitivas", "Le personnel consacre 60% de son temps à des requêtes répétitives", "Mitarbeiter verbringen 60% der Arbeitszeit mit Routineanfragen", "Staff spends 60% of work hours on routine repetitive queries"),
        future_state: t("AI કોપાયલટ સ્ટાફને મદદ કરે છે; નિયમિત વિનંતીઓ આપમેળે ઉકેલાય છે", "AI कोपायलट कर्मचारियों की मदद करता है; नियमित अनुरोध स्वचालित रूप से हल होते हैं", "El copiloto de IA asiste al equipo; las solicitudes de rutina se resuelven solas", "Le copilote IA assiste l'équipe ; requêtes courantes résolues automatiquement", "KI-Copilot unterstützt Personal; Routineanfragen autonom gelöst", "AI Copilot assists staff; routine requests resolved autonomously"),
        gap_description: t("સ્ટાફનો સમય બિન-આવક વહીવટી કાર્યોમાં વેડફાય છે", "कर्मचारियों का समय गैर-राजस्व प्रशासनिक कार्यों में खर्च होता है", "Sobrecarga del personal en tareas administrativas que no generan ingresos", "Surcharge de travail administratif sans valeur ajoutée pour l'équipe", "Arbeitszeit wird durch nicht-wertschöpfende Administration gebunden", "Staff bandwidth exhausted on non-revenue administrative overhead"),
        severity: "High",
        mitigation_strategy: t("ગ્રાહક સહાય માટે કન્વર્ઝેશનલ AI આસિસ્ટન્ટ તૈનાત કરો", "ग्राहक सेवा के लिए संवादात्मक AI सहायक तैनात करें", "Desplegar asistente conversacional de IA para atención al cliente", "Déployer un assistant IA conversationnel pour le support client", "KI-Konversationsassistenten für Frontline-Support bereitstellen", "Deploy conversational AI assistant for frontline customer triage")
      }
    ],
    digital_maturity: {
      overall_score: data?.digital_maturity || 84,
      level: t("અદ્યતન", "उन्नत", "Avanzado", "Avancé", "Fortgeschritten", "Advanced"),
      dimensions: [
        {
          name: t("વ્યૂહરચના અને વિઝન", "रणनीति और विजन", "Estrategia y Visión", "Stratégie & Vision", "Strategie & Vision", "Strategy & Vision"),
          score: 88,
          level: t("અદ્યતન", "उन्नत", "Avanzado", "Avancé", "Fortgeschritten", "Advanced"),
          description: t("ડિજિટલ પરિવર્તન સાથે જોડાયેલો સ્પષ્ટ રોડમેપ.", "डिजिटल परिवर्तन से जुड़ा स्पष्ट रोडमैप।", "Hoja de ruta clara alineada con la transformación digital.", "Feuille de route claire alignée sur la transformation numérique.", "Klare Roadmap ausgerichtet auf die digitale Transformation.", "Clear roadmap aligned with digital business transformation."),
          recommendation: t("ત્રિમાસિક KPI સમીક્ષા ચક્ર સ્થાપિત કરો.", "त्रैमासिक KPI समीक्षा चक्र स्थापित करें।", "Establecer ciclos de revisión trimestral de KPI.", "Mettre en place des revues trimestrielles des KPI.", "Vierteljährliche KPI-Überprüfungszyklen etablieren.", "Establish quarterly KPI review cycles.")
        },
        {
          name: t("ટેકનોલોજી આર્કિટેક્ચર", "तकनीकी आर्किटेक्चर", "Arquitectura Tecnológica", "Architecture Technologique", "Technologie-Architektur", "Technology Architecture"),
          score: 82,
          level: t("નિર્ધારિત", "परिभाषित", "Definido", "Défini", "Definiert", "Defined"),
          description: t("જૂના ટૂલ્સમાંથી આધુનિક ક્લાઉડ અને API લેયર્સ તરફ સંક્રમણ.", "पुराने उपकरणों से आधुनिक क्लाउड और API परतों में संक्रमण।", "Transición de herramientas heredadas a capas modernas en la nube y API.", "Transition des outils existants vers des couches cloud et API modernes.", "Übergang von Altsystemen zu modernen Cloud- & API-Ebenen.", "Transitioning from legacy tools to modern cloud & API layers."),
          recommendation: t("માઇક્રોસર્વિસિસ અને ઓટોમેટેડ CI/CD લાગુ કરો.", "माइक्रोसर्विसेज और स्वचालित CI/CD लागू करें।", "Implementar microservicios y CI/CD automatizado.", "Mettre en œuvre des microservices et un CI/CD automatisé.", "Microservices und automatisiertes CI/CD implementieren.", "Implement microservices and automated CI/CD.")
        },
        {
          name: t("ડેટા અને એનાલિટિક્સ", "डेटा और एनालिटिक्स", "Datos y Analítica", "Données & Analyses", "Daten & Analysen", "Data & Analytics"),
          score: 78,
          level: t("નિર્ધારિત", "परिभाषित", "Definido", "Défini", "Definiert", "Defined"),
          description: t("રિયલ-ટાઇમ ટ્રેકિંગ માટે ડિઝાઇન કરાયેલ સ્ટ્રક્ચર્ડ સ્કીમા.", "रीयल-टाइम ट्रैकिंग के लिए संरचित स्कीमा डिज़ाइन किए गए।", "Esquemas estructurados diseñados para seguimiento en tiempo real.", "Schémas structurés conçus pour le suivi en temps réel.", "Strukturierte Schemas für Echtzeit-Tracking entworfen.", "Structured schemas designed for real-time tracking."),
          recommendation: t("ઓટોમેટેડ રિપોર્ટિંગ ડેશબોર્ડ્સ બનાવો.", "स्वचालित रिपोर्टिंग डैशबोर्ड बनाएं।", "Construir paneles de informes automatizados.", "Créer des tableaux de bord de rapports automatisés.", "Automatisierte Reporting-Dashboards erstellen.", "Build automated reporting dashboards.")
        },
        {
          name: t("ઓપરેશન્સ અને ઓટોમેશન", "संचालन और स्वचालन", "Operaciones y Automatización", "Opérations & Automatisation", "Betrieb & Automatisierung", "Operations & Automation"),
          score: 86,
          level: t("અદ્યતન", "उन्नत", "Avanzado", "Avancé", "Fortgeschritten", "Advanced"),
          description: t("મેન્યુઅલ હસ્તક્ષેપ દૂર કરતું વર્કફ્લો ઓટોમેશન.", "मैन्युअल हस्तक्षेप को समाप्त करने वाला वर्कफ़्लो स्वचालन।", "Automatización del flujo de trabajo que elimina transferencias manuales.", "Automatisation des flux éliminant les tâches manuelles.", "Workflow-Automatisierung eliminiert manuelle Übergaben.", "Workflow automation eliminating manual handoffs."),
          recommendation: t("પ્રિડિક્ટિવ ઇન્વેન્ટરી અને શેડ્યુલિંગ સક્ષમ કરો.", "पूर्वानुमानित इन्वेंटरी और शेड्यूलिंग सक्षम करें।", "Habilitar inventario predictivo y programación.", "Activer les stocks prédictifs et la planification.", "Prädiktive Bestandsführung & Terminierung aktivieren.", "Enable predictive inventory & scheduling.")
        }
      ]
    },
    ai_readiness: {
      overall_score: data?.ai_adoption || 90,
      readiness_grade: t("ઉચ્ચ AI રેડીનેસ", "उच्च AI तत्परता", "Alta Preparación para IA", "Haute Préparation IA", "Hohe KI-Bereitschaft", "High AI Readiness"),
      dimensions: [
        {
          dimension: t("ડેટા ગુણવત્તા અને ઉપલબ્ધતા", "डेटा गुणवत्ता और उपलब्धता", "Calidad y Disponibilidad de Datos", "Qualité & Disponibilité des Données", "Datenqualität & Verfügbarkeit", "Data Quality & Availability"),
          score: 84,
          status: "Ready",
          finding: t("LLM એમ્બેડિંગ્સ માટે રિલેશનલ ટેબલ્સ તૈયાર છે.", "LLM एम्बेडिंग के लिए रिलेशनल टेबल तैयार हैं।", "Tablas relacionales preparadas para incrustaciones LLM.", "Tables relationnelles prêtes pour les plongements LLM.", "Relationale Tabellen für LLM-Embeddings vorbereitet.", "Relational tables and clean attributes prepared for LLM embeddings."),
          action_item: t("ડેટા વેલિડેશન સ્કીમા જાળવી રાખો.", "डेटा सत्यापन स्कीमा बनाए रखें।", "Mantener esquemas de validación de datos.", "Maintenir les schémas de validation des données.", "Datenschemavalidierung aufrechterhalten.", "Maintain data validation schemas.")
        },
        {
          dimension: t("ઇન્ફ્રાસ્ટ્રક્ચર અને API ચપળતા", "इन्फ्रास्ट्रक्चर और API चपलता", "Infraestructura y Agilidad de API", "Infrastructure & Agilité API", "Infrastruktur & API-Agilität", "Infrastructure & API Agility"),
          score: 92,
          status: "Ready",
          finding: t("હાઇ-થ્રુપુટ AI કૉલ્સ માટે સ્ટેક સંપૂર્ણ તૈયાર.", "उच्च-थ्रूपुट AI कॉल के लिए स्टैक पूरी तरह तैयार।", "Stack preparado para llamadas de inferencia de IA de alto rendimiento.", "Stack prêt pour les appels d'inférence IA à haut débit.", "Stack bereit für hochperformante KI-Inferenzaufrufe.", "Next.js / Node.js stack ready for high-throughput AI inference calls."),
          action_item: t("રેટ લિમિટિંગ અને ફોલબેક કેસ્કેડ્સ સેટ કરો.", "दर सीमित करने और फ़ॉलबैक कैस्केड सेट करें।", "Configurar límites de tasa y cascadas de respaldo.", "Configurer la limitation de débit et cascades de secours.", "Ratenbegrenzung und Fallback-Kaskaden einrichten.", "Set up rate limiting and fallback cascades.")
        },
        {
          dimension: t("ટીમ અને સંસ્થાકીય સ્વીકૃતિ", "टीम और संगठनात्मक स्वीकृति", "Adopción Organizacional y del Equipo", "Adoption par l'Équipe & l'Organisation", "Team- & Organisationsakzeptanz", "Team & Organizational Adoption"),
          score: 86,
          status: "Ready",
          finding: t("મેન્યુઅલ કામકાજ ઓટોમેટ કરવા ટીમ ઉત્સાહિત.", "मैन्युअल काम को स्वचालित करने के लिए टीम उत्सुक है।", "Equipo entusiasmado por automatizar cargas de trabajo manuales.", "Équipe motivée pour automatiser les tâches manuelles répétitives.", "Team bereit zur Automatisierung manueller Workloads.", "Staff eager to automate repetitive manual workloads."),
          action_item: t("ઇન્ટરેક્ટિવ AI કોપાયલટ તાલીમ પૂરી પાડો.", "इंटरैक्टिव AI कोपायलट प्रशिक्षण प्रदान करें।", "Proporcionar capacitación interactiva sobre el copiloto de IA.", "Fournir une formation interactive sur le copilote IA.", "Interaktive KI-Copilot-Schulungen bereitstellen.", "Provide interactive AI copilot training.")
        },
        {
          dimension: t("ગવર્નન્સ, સિક્યુરિટી અને નીતિમત્તા", "शासन, सुरक्षा और नैतिकता", "Gobernanza, Seguridad y Ética", "Gouvernance, Sécurité & Éthique", "Governance, Sicherheit & Ethik", "Governance, Security & Ethics"),
          score: 88,
          status: "Ready",
          finding: t("રોલ-બેઝ્ડ ઓથેન્ટિકેશન (RBAC) ગોઠવાયેલું છે.", "भूमिका-आधारित प्रमाणीकरण (RBAC) कॉन्फ़िगर किया गया।", "Autenticación basada en roles (RBAC) y aislamiento de datos configurados.", "Authentification basée sur les rôles (RBAC) et isolation configurées.", "Rollenbasierte Authentifizierung (RBAC) und Datenisolation konfiguriert.", "Role-based authentication (RBAC) and data isolation configured."),
          action_item: t("ઓડિટ લોગિંગ અને પાલન તપાસ લાગુ કરો.", "ऑडिट लॉगिंग और अनुपालन जांच लागू करें।", "Hacer cumplir el registro de auditoría y controles de cumplimiento.", "Appliquer la journalisation d'audit et les vérifications de conformité.", "Audit-Logging und Compliance-Prüfungen durchsetzen.", "Enforce audit logging and compliance checks.")
        }
      ],
      key_enablers: [
        t("આધુનિક ક્લાઉડ API રેડીનેસ", "आधुनिक क्लाउड API तत्परता", "Preparación moderna de API en la nube", "Maturité moderne des API cloud", "Moderne Cloud-API-Bereitschaft", "Modern cloud API readiness"),
        t("સ્વચ્છ રિલેશનલ ડેટાબેઝ સ્કીમા", "स्वच्छ रिलेशनल डेटाबेस स्कीमा", "Esquema limpio de base de datos relacional", "Schéma de base de données relationnelle propre", "Sauberes relationales Datenbankschema", "Clean relational database schema"),
        t("મલ્ટી-મોડેલ Gemini ફોલબેક આર્કિટેક્ચર", "मल्टी-मॉडल जेमिनी फ़ॉलबैक आर्किटेक्चर", "Arquitectura de respaldo multimodelo Gemini", "Architecture de secours multi-modèles Gemini", "Multi-Modell Gemini Fallback-Architektur", "Multi-model Gemini fallback architecture")
      ],
      key_blockers: [
        t("મેન્યુઅલ સ્પ્રેડશીટ્સ વાપરવાની જૂની આદત", "मैन्युअल स्प्रेडशीट का उपयोग करने की पुरानी आदत", "Hábito del personal de usar hojas de cálculo manuales", "Habitude du personnel à utiliser des tableurs manuels", "Gewohnheit manueller Tabellenkalkulationen", "Legacy staff habit of using manual spreadsheets"),
        t("સેલ્ફ-સર્વિસ એપમાં પ્રારંભિક ગ્રાહક ઓનબોર્ડિંગ", "सेल्फ-सर्विस ऐप में शुरुआती ग्राहक ऑनबोर्डिंग", "Incorporación inicial de clientes a la aplicación de autoservicio", "Intégration initiale des clients sur l'application libre-service", "Erstes Kunden-Onboarding in die Self-Service-App", "Initial customer onboarding to self-service app")
      ]
    },
    ai_opportunities: [
      {
        id: "opp-1",
        title: t("કન્વર્ઝેશનલ ગ્રાહક સેવા AI એજન્ટ", "संवादात्मक ग्राहक सेवा AI एजेंट", "Agente de IA de Atención al Cliente Conversacional", "Agent IA de Service Client Conversationnel", "KI-Dialogagent für Kundenservice", "Conversational Customer Service AI Agent"),
        category: "Generative AI",
        business_impact: t("પરિવર્તનકારી", "परिवर्तनकारी", "Transformacional", "Transformationnel", "Transformational", "Transformational"),
        feasibility: t("સરળ (પ્લગ એન્ડ પ્લે)", "सरल (प्लग एंड प्ले)", "Alta (Plug & Play)", "Haute (Plug & Play)", "Hoch (Plug & Play)", "High (Plug & Play)"),
        estimated_roi: "340% ROI",
        time_to_value: t("2-3 અઠવાડિયા", "2-3 सप्ताह", "2-3 Semanas", "2-3 Semaines", "2-3 Wochen", "2-3 Weeks"),
        description: t("પૂછપરછ, બુકિંગ, ઓર્ડર અને FAQs માટે 24/7 ઓટોમેટેડ ગ્રાહક સહાય.", "पूछताछ, बुकिंग, ऑर्डर और अक्सर पूछे जाने वाले प्रश्नों के लिए 24/7 स्वचालित सहायता।", "Asistencia al cliente automatizada 24/7 para consultas, reservas, pedidos y preguntas frecuentes.", "Support client automatisé 24/7 pour demandes, réservations, commandes et FAQ instantanées.", "24/7 automatisierte Kundenbetreuung für Anfragen, Buchungen, Bestellungen und FAQs.", "24/7 automated customer assistance for inquiries, bookings, orders, and instant FAQs."),
        recommended: true
      },
      {
        id: "opp-2",
        title: t("ઇન્ટેલિજન્ટ ડાયનેમિક ભલામણ એન્જિન", "इंटेलिजेंट डायनामिक अनुशंसा इंजन", "Motor Inteligente de Recomendaciones Dinámicas", "Moteur Intelligent de Recommandations Dynamiques", "Intelligente dynamische Empfehlungs-Engine", "Intelligent Dynamic Recommendation Engine"),
        category: "Predictive Analytics",
        business_impact: t("ઉચ્ચ", "उच्च", "Alto", "Élevé", "Hoch", "High"),
        feasibility: t("મધ્યમ (કસ્ટમ ઇન્ટિગ્રેશન)", "मध्यम (कस्टम एकीकरण)", "Media (Integración Personalizada)", "Moyenne (Intégration Personnalisée)", "Mittel (Custom Integration)", "Medium (Custom Integration)"),
        estimated_roi: "210% ROI",
        time_to_value: t("4 અઠવાડિયા", "4 सप्ताह", "4 Semanas", "4 Semaines", "4 Wochen", "4 Weeks"),
        description: t("યુઝર પસંદગીઓ અને ખરીદી ઇતિહાસ પર આધારિત સંદર્ભિત સૂચનો.", "उपयोगकर्ता प्राथमिकताओं और खरीद इतिहास पर आधारित प्रासंगिक सुझाव।", "Sugerencias contextuales de venta cruzada según preferencias del usuario e historial.", "Suggestions contextuelles de vente croisée basées sur les préférences et l'historique.", "Kontextbezogene Upselling- & Cross-Selling-Vorschläge basierend auf Historie.", "Contextual upsell & cross-sell suggestions based on user preferences and purchase history."),
        recommended: true
      },
      {
        id: "opp-3",
        title: t("ઓટોમેટેડ વર્કફ્લો ડિસ્પેચ અને વિસંગતતા ચેતવણીઓ", "स्वचालित वर्कफ़्लो डिस्पैच और विसंगति अलर्ट", "Despacho Automatizado de Flujos y Alertas de Anomalías", "Distribution Automatisée des Flux & Alertes d'Anomalies", "Automatisierter Workflow-Dispatch & Anomalie-Warnungen", "Automated Workflow Dispatch & Anomaly Alerts"),
        category: "Intelligent Automation",
        business_impact: t("ઉચ્ચ", "उच्च", "Alto", "Élevé", "Hoch", "High"),
        feasibility: t("સરળ (પ્લગ એન્ડ પ્લે)", "सरल (प्लग एंड प्ले)", "Alta (Plug & Play)", "Haute (Plug & Play)", "Hoch (Plug & Play)", "High (Plug & Play)"),
        estimated_roi: "180% ROI",
        time_to_value: t("1-2 અઠવાડિયા", "1-2 सप्ताह", "1-2 Semanas", "1-2 Semaines", "1-2 Wochen", "1-2 Weeks"),
        description: t("નવા ઓર્ડર પર ઓટોમેટેડ ટાસ્ક ટ્રિગર્સ અને વિલંબ માટે મેનેજર એલર્ટ્સ.", "नए ऑर्डर पर स्वचालित कार्य ट्रिगर और देरी के लिए प्रबंधक अलर्ट।", "Activadores automáticos de tareas en nuevos pedidos con alertas de retraso.", "Déclencheurs automatiques sur nouvelles commandes avec alertes de retard.", "Automatisierte Aufgaben-Trigger bei Neubestellungen mit Manager-Warnungen.", "Automated task triggers on new orders with instant manager alerts for delays."),
        recommended: true
      }
    ],
    is_approved: data?.business_analysis?.is_approved || false
  }

  const [analysis, setAnalysis] = useState<DeepBusinessAnalysis>(defaultAnalysis)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isEditing, setIsEditing] = useState(false)
  const [isApproved, setIsApproved] = useState(analysis.is_approved || false)
  const [newGap, setNewGap] = useState<Partial<GapItem>>({
    category: "Process",
    severity: "High",
    current_state: "",
    future_state: "",
    gap_description: "",
    mitigation_strategy: ""
  })
  const [showAddGapModal, setShowAddGapModal] = useState(false)

  if (!generated) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm space-y-3">
        <BrainCircuit className="h-10 w-10 text-indigo-400 mx-auto" />
        <p className="font-bold text-slate-700 text-base">
          {t(
            "બિઝનેસ એનાલિસિસ હજુ તૈયાર નથી",
            "बिजनेस एनालिसिस अभी तैयार नहीं है",
            "Análisis de negocio aún no generado",
            "Analyse d'affaires non encore générée",
            "Geschäftsanalyse noch nicht generiert",
            "No Business Analysis Generated Yet"
          )}
        </p>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {t(
            "ડાબી બાજુ બિઝનેસ રિક્વાયરમેન્ટ લખો અથવા 'Start Guided AI Discovery' પર ક્લિક કરીને ઊંડાણપૂર્વક એનાલિસિસ મેળવો.",
            "बाईं ओर व्यावसायिक आवश्यकताएं दर्ज करें या गहन विश्लेषण प्राप्त करने के लिए 'Start Guided AI Discovery' पर क्लिक करें।",
            "Ingrese su idea de negocio a la izquierda o ejecute Guided AI Discovery para obtener la evaluación completa.",
            "Saisissez votre idée à gauche ou lancez Guided AI Discovery pour générer l'évaluation complète.",
            "Geben Sie Ihre Geschäftsidee links ein oder starten Sie die Guided AI Discovery für eine umfassende Analyse.",
            "Enter your business idea on the left or run the Guided AI Discovery to generate the comprehensive Gap Analysis & Digital Maturity assessment."
          )}
        </p>
      </div>
    )
  }

  const filteredGaps =
    selectedCategory === "All"
      ? analysis.gap_analysis
      : analysis.gap_analysis.filter((g) => g.category === selectedCategory)

  const handleApprove = () => {
    const updated = {
      ...analysis,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: role || "Manager"
    }
    setAnalysis(updated)
    setIsApproved(true)
    if (onApproveAnalysis) onApproveAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
  }

  const handleAddGap = () => {
    if (!newGap.current_state || !newGap.gap_description) return
    const gapToAdd: GapItem = {
      id: `gap-${Date.now()}`,
      category: (newGap.category as GapCategory) || "Process",
      current_state: newGap.current_state,
      future_state: newGap.future_state || t("ઓટોમેટેડ લક્ષિત સ્થિતિ", "स्वचालित लक्षित स्थिति", "Estado objetivo automatizado", "État cible automatisé", "Automatisierter Zielzustand", "Automated Target State"),
      gap_description: newGap.gap_description,
      severity: (newGap.severity as GapSeverity) || "High",
      mitigation_strategy: newGap.mitigation_strategy || t("વર્કફ્લો સોલ્યુશન લાગુ કરો", "वर्कफ़्लो समाधान लागू करें", "Implementar solución de flujo", "Mettre en œuvre la solution de flux", "Workflow-Lösung implementieren", "Implement engineered workflow")
    }
    const updated = {
      ...analysis,
      gap_analysis: [gapToAdd, ...analysis.gap_analysis]
    }
    setAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
    setShowAddGapModal(false)
    setNewGap({
      category: "Process",
      severity: "High",
      current_state: "",
      future_state: "",
      gap_description: "",
      mitigation_strategy: ""
    })
  }

  const handleDeleteGap = (id: string) => {
    const updated = {
      ...analysis,
      gap_analysis: analysis.gap_analysis.filter((g) => g.id !== id)
    }
    setAnalysis(updated)
    if (onUpdateAnalysis) onUpdateAnalysis(updated)
  }

  const getSeverityBadge = (sev: GapSeverity) => {
    switch (sev) {
      case "Critical":
        return "bg-rose-100 text-rose-800 border-rose-300"
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-slate-100 text-slate-700 border-slate-300"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Approval & Review Header */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                <BrainCircuit className="h-3.5 w-3.5" />
                {t(
                  "ડીપ બિઝનેસ એનાલિસિસ એન્જિન",
                  "डीप बिजनेस एनालिसिस इंजन",
                  "Motor de Análisis Profundo de Negocio",
                  "Moteur d'Analyse Métier Approfondie",
                  "Deep-Business-Analyse-Engine",
                  "Deep Business Analysis & AI Consultant"
                )}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                  isApproved
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }`}
              >
                {isApproved
                  ? t("✅ એનાલિસિસ માન્ય (Approved)", "✅ विश्लेषण स्वीकृत (Approved)", "✅ Análisis Aprobado", "✅ Analyse Approuvée", "✅ Analyse Freigegeben", "✅ Analysis Approved")
                  : t("⏳ સમીક્ષા બાકી (Pending Review)", "⏳ समीक्षा लंबित (Pending Review)", "⏳ Pendiente de Revisión", "⏳ En Attente de Révision", "⏳ Überprüfung ausstehend", "⏳ Pending Review")}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
              {analysis.project_title || t("એન્ટરપ્રાઇઝ ડિજિટલ ટ્રાન્સફોર્મેશન", "एंटरप्राइज डिजिटल ट्रांसफॉर्मेशन", "Transformación Digital Empresarial", "Transformation Numérique d'Entreprise", "Digitale Unternehmenstransformation", "Enterprise Digital Transformation")}
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              {analysis.executive_summary.strategic_intent}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              {isEditing
                ? t("સેવ કરો", "सहेजें", "Guardar", "Enregistrer", "Speichern", "Done Editing")
                : t("એડિટ મોડ", "एडिट मोड", "Modo Edición", "Mode Édition", "Bearbeiten", "Edit Analysis")}
            </button>

            {!isEmployee && !isApproved && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{t("એનાલિસિસ મંજૂર કરો (Approve)", "विश्लेषण स्वीकृत करें (Approve)", "Aprobar Análisis", "Approuver l'Analyse", "Analyse freigeben", "Approve & Enrich Blueprint")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Value Driver Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t("અંદાજિત ROI", "अनुमानित ROI", "ROI Proyectado", "ROI Projeté", "Erwarteter ROI", "Projected ROI")}</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">
            {analysis.executive_summary.projected_roi_percentage}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {t("પેબેક પિરિયડ:", "पेबैक अवधि:", "Recuperación:", "Délai retour :", "Amortisation:", "Payback Period:")} {analysis.executive_summary.estimated_payback_months}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t("ઓપરેશનલ કાર્યક્ષમતા", "परिचालन दक्षता", "Eficiencia Operativa", "Gain d'Efficacité", "Effizienzgewinn", "Efficiency Gain")}</span>
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-600">
            +{analysis.executive_summary.operational_efficiency_gain}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {t("મેન્યુઅલ સમય બચત", "मैन्युअल समय बचत", "Ahorro de tiempo manual", "Réduction du temps manuel", "Manuelle Zeiteinsparung", "Reduction in manual latency")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t("ડિજિટલ મેચ્યોરિટી", "डिजिटल परिपक्वता", "Madurez Digital", "Maturité Numérique", "Digitale Reife", "Digital Maturity")}</span>
            <Gauge className="h-5 w-5 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-purple-600">
            {analysis.digital_maturity.overall_score}%
          </p>
          <p className="mt-1 text-[11px] text-purple-700 font-semibold">
            {analysis.digital_maturity.level}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>{t("AI સ્વીકૃતિ રેડીનેસ", "AI तत्परता स्तर", "Nivel Preparación IA", "Niveau Préparation IA", "KI-Bereitschaftsstufe", "AI Adoption Grade")}</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {analysis.ai_readiness.overall_score}%
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            {analysis.ai_readiness.readiness_grade}
          </p>
        </div>
      </div>

      {/* Current State vs Future State Split Comparator */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t(
                "વર્તમાન સ્થિતિ vs ભવિષ્યની લક્ષિત સ્થિતિ",
                "वर्तमान स्थिति vs भविष्य की लक्षित स्थिति",
                "Estado Actual vs Arquitectura Futura Objetivo",
                "État Actuel vs Architecture Cible Future",
                "Ist-Zustand vs. Ziel-Architektur",
                "Current State vs. Target Future State Architecture"
              )}
            </h3>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {t("ડિજિટલ ટ્રાન્સફોર્મેશન શિફ્ટ", "डिजिटल परिवर्तन बदलाव", "Cambio de Paradigma", "Changement de Paradigme", "Paradigmenwechsel", "Operational Paradigm Shift")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current State Card */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-white text-xs font-bold">
                1
              </span>
              <h4 className="font-bold text-rose-950 text-xs uppercase tracking-wider">
                {t("વર્તમાન અડચણો (Current Bottlenecks)", "वर्तमान अड़चनें (Current Bottlenecks)", "As-Is: Ineficiencias Actuales", "État Actuel : Inefficacités", "Ist-Zustand: Ineffizienzen", "As-Is: Current State Inefficiencies")}
              </h4>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {analysis.current_state.summary}
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                {t("મેન્યુઅલ પ્રક્રિયાઓ:", "मैन्युअल प्रक्रियाएं:", "Procesos Manuales:", "Processus Manuels :", "Manuelle Abläufe:", "Manual Workflows & Pain Points:")}
              </p>
              <ul className="space-y-1.5 text-xs text-rose-900">
                {analysis.current_state.manual_workflows.map((wf, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{wf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Target Future State Card */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold">
                2
              </span>
              <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                {t("ભવિષ્યની AI-ઓટોમેટેડ સિસ્ટમ (Target State)", "भविष्य की AI-स्वचालित प्रणाली (Target State)", "To-Be: Arquitectura Objetivo IA", "État Cible : Architecture IA", "Ziel-Zustand: KI-Architektur", "To-Be: AI-Driven Target Architecture")}
              </h4>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {analysis.future_state.vision_summary}
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                {t("AI ઓટોમેશન ટચપોઇન્ટ્સ:", "AI स्वचालन टचपॉइंट्स:", "Puntos de Contacto con IA:", "Points d'Impact IA :", "KI-Touchpoints:", "Automated Touchpoints & KPI Impact:")}
              </p>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {analysis.future_state.ai_transformation_touchpoints.map((tp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PPTD Gap Analysis Matrix */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                {t(
                  "PPTD ગેપ એનાલિસિસ મેટ્રિક્સ",
                  "PPTD गैप एनालिसिस मैट्रिक्स",
                  "Matriz de Brechas PPTD (Personas, Procesos, Tecnología, Datos)",
                  "Matrice d'Écarts PPTD (Personnes, Processus, Technologie, Données)",
                  "PPTD-Lückenanalyse-Matrix",
                  "People, Process, Technology & Data (PPTD) Gap Matrix"
                )}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                "હાલની સિસ્ટમ અને લક્ષિત આર્કિટેક્ચર વચ્ચેના તફાવતો અને ઉકેલો",
                "वर्तमान प्रणाली और लक्षित आर्किटेक्चर के बीच अंतर और समाधान",
                "Brechas identificadas con severidad y estrategias de mitigación",
                "Écarts identifiés avec gravité et stratégies d'atténuation",
                "Identifizierte Lücken mit Schweregrad und Minderungsstrategien",
                "Identified operational & architectural gaps with severity and mitigation strategies"
              )}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "People", "Process", "Technology", "Data"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "All" ? t("બધું (All)", "सभी (All)", "Todos", "Tous", "Alle", "All") : cat}
              </button>
            ))}
            {isEditing && (
              <button
                onClick={() => setShowAddGapModal(true)}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("ગેપ ઉમેરો", "गैप जोड़ें", "Añadir Brecha", "Ajouter un Écart", "Lücke hinzufügen", "Add Gap")}
              </button>
            )}
          </div>
        </div>

        {/* Gap Cards Table */}
        <div className="grid grid-cols-1 gap-3">
          {filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    {gap.category}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getSeverityBadge(
                      gap.severity
                    )}`}
                  >
                    {gap.severity}
                  </span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleDeleteGap(gap.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {t("વર્તમાન ગેપ:", "वर्तमान गैप:", "Brecha Identificada:", "Écart Identifié :", "Identifizierte Lücke:", "Identified Gap:")}
                  </p>
                  <p className="font-semibold text-slate-900 mt-0.5">{gap.gap_description}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {t("હાલની પરિસ્થિતિ:", "वर्तमान स्थिति:", "Estado As-Is:", "Statut Actuel :", "Ist-Zustand:", "As-Is Status:")}
                  </p>
                  <p className="text-slate-600 mt-0.5">{gap.current_state}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    {t("મિટીગેશન પ્લાન:", "समाधान रणनीति:", "Plan de Mitigación:", "Plan d'Atténuation :", "Minderungsplan:", "Mitigation Architecture:")}
                  </p>
                  <p className="text-emerald-800 font-medium mt-0.5">{gap.mitigation_strategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Opportunities Portfolio */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t(
                "AI ઓપોર્ચ્યુનિટી પોર્ટફોલિયો અને ROI",
                "AI अवसर पोर्टफोलियो और ROI",
                "Portafolio de Oportunidades de IA y ROI",
                "Portefeuille d'Opportunités IA & ROI",
                "KI-Chancen-Portfolio & ROI",
                "High-Impact AI Opportunity Portfolio"
              )}
            </h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
            {t("પ્રાથમિકતા ધરાવતા કેસ", "प्राथमिकता वाले उपयोग के मामले", "Casos de Uso Prioritarios", "Cas d'Usage Prioritaires", "Priorisierte Anwendungsfälle", "Prioritized Use Cases")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.ai_opportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/30 to-white p-5 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                    {opp.category}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {opp.estimated_roi}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{opp.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{opp.description}</p>
              </div>

              <div className="pt-2 border-t border-purple-100/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {t("ડિલિવરી:", "वितरण समय:", "Tiempo de valor:", "Délai de valeur :", "Lieferzeit:", "Time-to-Value:")} <strong>{opp.time_to_value}</strong>
                </span>
                <span className="font-semibold text-indigo-600">{opp.feasibility}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Gap Modal */}
      {showAddGapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              {t("નવો ગેપ ઉમેરો", "नया गैप जोड़ें", "Añadir Brecha Operativa", "Ajouter un Écart Opérationnel", "Neue Betriebslücke hinzufügen", "Add Operational / Architectural Gap")}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={newGap.category}
                    onChange={(e) => setNewGap({ ...newGap, category: e.target.value as GapCategory })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                  >
                    <option value="Process">Process</option>
                    <option value="Technology">Technology</option>
                    <option value="Data">Data</option>
                    <option value="People">People</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Severity</label>
                  <select
                    value={newGap.severity}
                    onChange={(e) => setNewGap({ ...newGap, severity: e.target.value as GapSeverity })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Gap Description</label>
                <input
                  type="text"
                  placeholder="e.g. Lack of automated booking confirmation"
                  value={newGap.gap_description}
                  onChange={(e) => setNewGap({ ...newGap, gap_description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Current As-Is State</label>
                <input
                  type="text"
                  placeholder="e.g. Manual phone call confirmation"
                  value={newGap.current_state}
                  onChange={(e) => setNewGap({ ...newGap, current_state: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Mitigation Strategy</label>
                <input
                  type="text"
                  placeholder="e.g. Implement webhook notification trigger"
                  value={newGap.mitigation_strategy}
                  onChange={(e) => setNewGap({ ...newGap, mitigation_strategy: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddGapModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {t("રદ કરો", "रद्द करें", "Cancelar", "Annuler", "Abbrechen", "Cancel")}
              </button>
              <button
                onClick={handleAddGap}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                {t("ઉમેરો", "जोड़ें", "Añadir", "Ajouter", "Hinzufügen", "Add Gap")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
