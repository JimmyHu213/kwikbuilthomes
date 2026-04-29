'use client'

import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/lib/planner/store'
import { buildBom } from '@/lib/planner/bom'
import { captureCanvasScreenshot } from '@/lib/planner/screenshot'

export function QuoteFromLayout() {
  const router = useRouter()
  const modules = usePlannerStore((s) => s.modules)
  const hasModules = modules.size > 0

  async function handleRequestQuote() {
    const modulesArray = Array.from(modules.values())
    if (modulesArray.length === 0) return

    const bom = buildBom(modulesArray)
    const screenshot = await captureCanvasScreenshot()

    sessionStorage.setItem('plannerBom', JSON.stringify(bom))
    if (screenshot) {
      sessionStorage.setItem('plannerScreenshot', screenshot)
    }

    router.push('/designer')
  }

  return (
    <button
      type="button"
      onClick={handleRequestQuote}
      disabled={!hasModules}
      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Request Quote
    </button>
  )
}
