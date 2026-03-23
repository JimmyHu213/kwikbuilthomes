import Link from 'next/link'

export function Footer() {
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
              Australian-engineered modular homes
            </p>
            <p className="text-sm text-[#F5F3F0]/70 leading-relaxed">
              Factory-built, site-ready, and NCC-compliant modular buildings for
              developers, builders, and sub-distributors across Australia.
            </p>
          </div>

          {/* Products column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories/modular-homes"
                  className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                >
                  Modular Homes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/kit-homes"
                  className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                >
                  Kit Homes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/container-homes"
                  className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                >
                  Container Homes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/tiny-homes"
                  className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                >
                  Tiny Homes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/sheds"
                  className="text-sm text-[#F5F3F0]/70 hover:text-primary transition-colors"
                >
                  Sheds
                </Link>
              </li>
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
                1300 KWIKBUILT
              </li>
              <li>
                <span className="block text-[#A89068] text-xs uppercase tracking-wider mb-0.5">
                  Email
                </span>
                info@kwikbuilthomes.com.au
              </li>
              <li>
                <span className="block text-[#A89068] text-xs uppercase tracking-wider mb-0.5">
                  Location
                </span>
                Port Macquarie, NSW, Australia
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#A89068]/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs text-[#F5F3F0]/50 text-center">
            &copy; 2026 KwikBuilt Pty Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
