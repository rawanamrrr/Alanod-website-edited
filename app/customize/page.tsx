"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MessageCircle, ArrowRight, Sparkles, Scissors, Ruler, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLocale } from "@/lib/locale-context"
import { useTranslation } from "@/lib/translations"

export default function CustomizePage() {
  const { settings } = useLocale()
  const t = useTranslation(settings.language)

  const steps = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: settings.language === 'en' ? "Consultation" : "الاستشارة",
      desc: settings.language === 'en' 
        ? "Share your vision, preferences, and inspiration with our expert stylists." 
        : "شاركي رؤيتك وتفضيلاتك وإلهامك مع خبراء التصميم لدينا."
    },
    {
      icon: <Ruler className="h-8 w-8" />,
      title: settings.language === 'en' ? "Measurements" : "القياسات",
      desc: settings.language === 'en'
        ? "We guide you through taking precise measurements for a perfect fit."
        : "نساعدك في أخذ قياسات دقيقة لضمان ملاءمة مثالية."
    },
    {
      icon: <Scissors className="h-8 w-8" />,
      title: settings.language === 'en' ? "Crafting" : "التنفيذ",
      desc: settings.language === 'en'
        ? "Our master artisans meticulously craft your gown by hand."
        : "يقوم حرفيونا المهرة بتنفيذ فستانك يدوياً بكل دقة."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[45vh] md:h-[65vh] flex items-center overflow-hidden">
          <Image
            src="/Alanod-bg.jpeg"
            alt="Customize background"
            fill
            className="object-cover object-center md:object-[center_35%]"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-light tracking-wide font-serif text-white">
                {t("customizeYourDress")}
              </h1>

              <p className="mt-6 text-base md:text-lg text-zinc-200/90 font-light leading-relaxed">
                {t("customizeYourDressDesc")}
              </p>

              <div className="mt-10">
                <Button
                  onClick={() => {
                    const el = document.getElementById('process-section')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-7 text-base md:text-lg font-medium transition-colors"
                >
                  {settings.language === 'en' ? "Begin" : "ابدئي"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process-section" className="py-20 md:py-32 bg-white relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute -left-24 top-48 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-24">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-purple-600 text-xs tracking-[0.3em] uppercase mb-4 block font-medium"
              >
                {settings.language === 'en' ? "Mastery in every stitch" : "إتقان في كل غرزة"}
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8 font-serif text-gray-900">
                {settings.language === 'en' ? "The Art of the Bespoke" : "فن التفصيل الخاص"}
              </h2>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                {settings.language === 'en' 
                  ? "Our couture journey is a collaborative masterpiece between our artisans and your imagination."
                  : "رحلة الكوتور لدينا هي عمل فني تعاوني بين حرفيينا وخيالكِ."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-purple-200 rotate-3 group-hover:rotate-0">
                      {step.icon}
                    </div>
                    <span className="absolute -top-4 -right-4 text-6xl font-serif text-gray-300 -z-10 group-hover:text-purple-300 transition-colors drop-shadow-md">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-light">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="px-8 py-12 md:px-14 md:py-16 text-center">
                <h2 className="text-3xl md:text-5xl text-gray-900 font-light font-serif leading-tight">
                  {settings.language === 'en'
                    ? "Start your custom gown consultation"
                    : "ابدئي استشارة فستانكِ المُخصص"}
                </h2>

                <p className="mt-5 text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                  {settings.language === 'en'
                    ? "Message us on WhatsApp and our atelier team will guide you through fabrics, measurements, and timelines."
                    : "راسِلينا على واتساب وسيقوم فريق الأتيليه بإرشادكِ لاختيار القماش والقياسات والمدة الزمنية."}
                </p>

                <div className="mt-10 flex justify-center">
                  <Button
                    onClick={() => window.open("https://wa.me/971502996885", "_blank")}
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-10 py-7 text-base md:text-lg font-medium transition-colors"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t("customizeYourDressButton")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
