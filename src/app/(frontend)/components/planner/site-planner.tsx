'use client'

import dynamic from 'next/dynamic'
import { ProductSidebar } from './product-sidebar'
import { ModuleToolbar } from './module-toolbar'
import { LayoutSummary } from './layout-summary'
import type { ProductForPlanner } from '@/lib/planner/types'

const PlannerCanvas = dynamic(
  () => import('./planner-canvas').then((mod) => ({ default: mod.PlannerCanvas })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center bg-muted/20"><p className="text-sm text-muted-foreground">Loading 3D canvas...</p></div> },
)

type SitePlannerProps = {
  products: ProductForPlanner[]
  preselectedSlug?: string
}

export function SitePlanner({ products, preselectedSlug }: SitePlannerProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-1 overflow-hidden">
        <ProductSidebar products={products} preselectedSlug={preselectedSlug} />
        <div className="flex flex-col flex-1">
          <ModuleToolbar />
          <PlannerCanvas products={products} />
        </div>
      </div>
      <LayoutSummary />
    </div>
  )
}
