import Link from 'next/link'
import { getCachedSiteSettings } from '@/lib/cached-data'

const defaults = {
  phone: '1300 KWIKBUILT',
  email: 'info@kwikbuilthomes.com.au',
  location: 'Port Macquarie, NSW, Australia',
  companyName: 'KwikBuilt Pty Ltd',
  tagline: 'Australian-engineered modular homes',
}

export async function Footer() {
  const raw = await getCachedSiteSettings()
  const settings = {
    phone: raw?.phone ?? defaults.phone,
    email: raw?.email ?? defaults.email,
    location: raw?.location ?? defaults.location,
    companyName: raw?.companyName ?? defaults.companyName,
    tagline: raw?.tagline ?? defaults.tagline,
  }

  return (
    <footer className="bg-[#2D2D2D] text-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div>
            <div className="flex items-baseline gap-0.5 tracking-tight mb-4">
              <span className="text-xl font-bold text-white">KWIK</span>
              <span className="text-xl font-bold text-primary">BUILT</span>
              <span className="ml-1.5 text-sm font-medium text-[#A89068]">HOMES</span>
            </div>
            <p className="text-sm font-medium text-[#A89068] mb-3">
              {settings.tagline}
            </p>
            <p className="text-sm text-[#F5F3F0]/70 leading-relaxed">
              Factory-built, site-ready, and NCC-compliant modular buildings for
              developers, builders, and sub-distributors across Australia.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/products', label: 'Products' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/designer', label: 'Designer' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/quote', label: 'Request a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#F5F3F0]/70">
              <li>
                <span className="block text-[#A89068] text-xs uppercase tracking-wider mb-0.5">
                  Phone
                </span>
                {settings.phone}
              </li>
              <li>
                <span className="block text-[#A89068] text-xs uppercase tracking-wider mb-0.5">
                  Email
                </span>
                {settings.email}
              </li>
              <li>
                <span className="block text-[#A89068] text-xs uppercase tracking-wider mb-0.5">
                  Location
                </span>
                {settings.location}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#A89068]/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs text-[#F5F3F0]/50 text-center">
            &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
