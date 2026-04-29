import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact | KwikBuilt Homes',
  description: 'Get in touch with KwikBuilt Homes — Australian-engineered modular buildings.',
}

type ContactInfo = { phone: string; email: string; location: string }

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return {
      phone: (settings.phone as string) || '1300 KWIKBUILT',
      email: (settings.email as string) || 'info@kwikbuilthomes.com.au',
      location: (settings.location as string) || 'Port Macquarie, NSW, Australia',
    }
  } catch {
    return { phone: '1300 KWIKBUILT', email: 'info@kwikbuilthomes.com.au', location: 'Port Macquarie, NSW, Australia' }
  }
}

export default async function ContactPage() {
  const info = await getContactInfo()
  return (
    <div>
      <section className="bg-[#2D2D2D] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-accent font-medium">Get in touch with our team</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="w-12 h-1 bg-primary mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-6">Get In Touch</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">Whether you have a question about our products, need a quote, or want to discuss a project, we're here to help.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div><p className="text-sm font-medium text-foreground">Phone</p><p className="text-muted-foreground">{info.phone}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div><p className="text-sm font-medium text-foreground">Email</p><p className="text-muted-foreground">{info.email}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div><p className="text-sm font-medium text-foreground">Location</p><p className="text-muted-foreground">{info.location}</p></div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-12 h-1 bg-primary mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
