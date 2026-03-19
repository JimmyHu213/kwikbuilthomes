# Kwik Built Homes

## What This Is

A B2B e-commerce catalog and quote platform for Kwik Built Homes, an Australian modular house distributor that sources and manufactures products in China. The site enables land developers and sub-distributors to browse modular homes, individual modules, and accessories — view detailed specs, photos, 3D renders, floor plans, and compliance docs — then request quotes for configured products.

## Core Value

Developers and sub-distributors can browse the full product catalog with rich detail and submit quote requests for the specific products and options they need.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] B2B product catalog with ~20 initial products (modular homes, kit homes, container homes, tiny homes, sheds, accessories)
- [ ] Rich product pages with floor plans, specs, photo galleries, 3D renders, compliance docs
- [ ] Selectable product options (finishes, layouts, add-ons) per base model
- [ ] Price range display ("from $X") with exact pricing via quote
- [ ] Quote request system tied to specific products and selected options
- [ ] Admin dashboard for managing quotes (receive, respond, track)
- [ ] Email notifications on new quote requests
- [ ] CMS for non-technical staff to manage products, photos, specs, and content
- [ ] About / company pages (brand story, team, why Kwik Built Homes)
- [ ] Project gallery showcasing completed builds and installations
- [ ] Blog / resources section (articles, guides, industry news)
- [ ] Contact page with office locations, phone numbers, contact forms

### Out of Scope

- Individual consumer sales — B2B only, no direct-to-homeowner purchasing
- Online payment / checkout — all transactions happen offline after quote approval
- 3D interactive configurator — planned for v2 (choose model + customize finishes + place on terrain + walkthrough)
- User accounts for buyers — v1 uses quote forms, no login required
- Mobile app — web-first

## Context

- **Corporate entity**: KwikBuilt Pty Ltd — Australian Pty Ltd registered with ASIC
- **Directors**: Ms Di Hu (Chairperson, 55% shareholder — supply chain), Mr Geoffrey Shannon (Managing Director, 30% — Australian market & operations)
- **Technology adviser**: Mr Jieming Hu (15% shareholder, non-director)
- **Primary customer**: The Dwelling Depot (D & W Shannon Pty Ltd + Di Hu & Jieming Hu Partnership) — authorized Australian national distributor
- **Product categories**: Modular homes, kit homes, container homes, tiny homes, sheds, and related dwelling products
- **Supply chain**: KwikBuilt sources and procures from Chinese suppliers, supplies to The Dwelling Depot and other distributors/developers
- Kwik Built Homes is a new brand with no existing web presence
- Target market: Australian land developers and sub-distributors building modular housing estates or resort complexes
- Buyers need to see compliance with Australian building standards (Corporations Act 2001)
- The long-term vision includes a full 3D configurator where buyers can customize homes, place them on different terrains (flat, sloped, coastal, bush, resort settings), walk through them, save/share/compare configurations, download renders, and convert directly to quotes. 3D models will need to be created from scratch.
- Existing codebase is a Next.js app configured for Cloudflare Workers deployment
- Reference: `./reference/KwikBuilt Pty Ltd — Corporate Structure.pdf`

## Constraints

- **Tech stack**: Next.js on Cloudflare Workers (already scaffolded)
- **CMS**: Needs a headless CMS for non-technical product/content management
- **Audience**: B2B — design and UX should feel professional, not consumer-retail
- **Products**: Starting with ~20 products, must scale to more
- **Compliance**: Product pages must surface Australian building standards and certifications

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| V1 = catalog + quotes, V2 = 3D configurator | Launch core value first, add flagship feature after foundation is solid | — Pending |
| B2B only, no consumer sales | Business model is distributor/developer focused | — Pending |
| Price ranges shown, exact pricing via quote | Standard B2B practice, allows for volume/custom pricing | — Pending |
| Next.js on Cloudflare Workers | Already scaffolded, edge performance for Australian market | — Pending |

---
*Last updated: 2026-03-19 after initialization*
