'use client'

import { usePlannerStore } from '@/lib/planner/store'
import { buildBom } from '@/lib/planner/bom'

export function LayoutSummary() {
  const modules = usePlannerStore((s) => s.modules)
  const bom = buildBom(Array.from(modules.values()))

  return (
    <div className="flex items-center gap-6 px-4 py-2 border-t border-border bg-card text-sm">
      <span className="text-muted-foreground">
        Modules: <span className="font-medium text-foreground">{bom.totalModules}</span>
      </span>
      <span className="text-muted-foreground">
        Area: <span className="font-medium text-foreground">{bom.totalFloorArea} m²</span>
      </span>
      {bom.estimatedPriceFrom != null && (
        <span className="text-muted-foreground">
          Est: <span className="font-medium text-primary">from ${bom.estimatedPriceFrom.toLocaleString()} + GST</span>
        </span>
      )}
    </div>
  )
}
