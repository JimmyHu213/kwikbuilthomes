'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import {
  computeConfigTotal,
  buildQuoteUrl,
  type OptionCardData,
  type OptionCategoryData,
} from '@/lib/configuration'

// --- Pure state helpers (exported for testing) ---

export function toggleSingle(
  selections: Record<string, string[]>,
  categoryId: string,
  optionId: string,
): Record<string, string[]> {
  const current = selections[categoryId]

  // Toggle off: same option already selected
  if (current && current[0] === optionId) {
    const { [categoryId]: _, ...rest } = selections
    return rest
  }

  // Select (or replace)
  return { ...selections, [categoryId]: [optionId] }
}

export function toggleMultiple(
  selections: Record<string, string[]>,
  categoryId: string,
  optionId: string,
): Record<string, string[]> {
  const current = selections[categoryId] ?? []

  if (current.includes(optionId)) {
    // Remove
    const filtered = current.filter((id) => id !== optionId)
    if (filtered.length === 0) {
      const { [categoryId]: _, ...rest } = selections
      return rest
    }
    return { ...selections, [categoryId]: filtered }
  }

  // Add
  return { ...selections, [categoryId]: [...current, optionId] }
}

export function hasSelections(selections: Record<string, string[]>): boolean {
  return Object.values(selections).some((ids) => ids.length > 0)
}

// --- Component ---

type ProductConfiguratorProps = {
  categories: OptionCategoryData[]
  basePrice: number | null
  productSlug: string
}

export function ProductConfigurator({
  categories,
  basePrice,
  productSlug,
}: ProductConfiguratorProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>({})

  // Derived state (computed during render, not in useEffect)
  const anySelected = hasSelections(selections)
  const modifierTotal = computeConfigTotal(selections, categories)

  // Check if any single-choice categories have no selection
  const singleChoiceCategories = categories.filter((c) => c.selectionType === 'single')
  const missingSingleChoices = singleChoiceCategories.some(
    (c) => !selections[c.id] || selections[c.id].length === 0,
  )

  function handleToggle(category: OptionCategoryData, optionId: string) {
    setSelections((prev) =>
      category.selectionType === 'single'
        ? toggleSingle(prev, category.id, optionId)
        : toggleMultiple(prev, category.id, optionId),
    )
  }

  function isSelected(categoryId: string, optionId: string): boolean {
    return selections[categoryId]?.includes(optionId) ?? false
  }

  function getSelectedOptionNames(categoryId: string): OptionCardData[] {
    const ids = selections[categoryId] ?? []
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return []
    return category.options.filter((opt) => ids.includes(opt.id))
  }

  return (
    <div className="space-y-8">
      {/* Category sections */}
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            {category.categoryName}
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({category.selectionType === 'single' ? 'choose one' : 'choose multiple'})
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.options.map((option) => {
              const selected = isSelected(category.id, option.id)

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleToggle(category, option.id)}
                  className={cn(
                    'relative flex flex-col rounded-lg border-2 overflow-hidden text-left transition-all min-h-[44px]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selected
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      'absolute top-2 right-2 z-10 flex items-center justify-center rounded-full transition-colors',
                      category.selectionType === 'single' ? 'h-5 w-5' : 'h-5 w-5',
                      selected
                        ? 'bg-primary text-primary-foreground'
                        : 'border-2 border-gray-300 bg-white',
                      category.selectionType === 'single' ? 'rounded-full' : 'rounded-sm',
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </div>

                  {/* Image area */}
                  {option.imageUrl ? (
                    <div className="relative aspect-[4/3] w-full bg-muted">
                      <Image
                        src={option.imageUrl}
                        alt={option.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">No image</span>
                    </div>
                  )}

                  {/* Card content */}
                  <div className="flex flex-col gap-1 p-3">
                    <span className="font-medium text-gray-900">{option.name}</span>

                    {option.description && (
                      <span className="text-sm text-gray-500 line-clamp-2">
                        {option.description}
                      </span>
                    )}

                    {/* Price badge */}
                    {option.priceModifier == null || option.priceModifier === 0 ? (
                      <span className="mt-1 inline-flex w-fit items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                        Included
                      </span>
                    ) : (
                      <span className="mt-1 text-sm font-medium text-gray-700">
                        +${option.priceModifier.toLocaleString()}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Configuration summary - only shown after first selection */}
      {anySelected && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Configuration</h3>

          <div className="space-y-3">
            {categories
              .filter((c) => selections[c.id] && selections[c.id].length > 0)
              .map((category) => {
                const selectedOptions = getSelectedOptionNames(category.id)
                return (
                  <div
                    key={category.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <span className="font-medium text-gray-600">{category.categoryName}</span>
                    <div className="text-right">
                      {selectedOptions.map((opt) => (
                        <div key={opt.id} className="text-gray-900">
                          {opt.name}
                          {opt.priceModifier != null && opt.priceModifier !== 0 && (
                            <span className="ml-2 text-gray-500">
                              +${opt.priceModifier.toLocaleString()}
                            </span>
                          )}
                          {(opt.priceModifier == null || opt.priceModifier === 0) && (
                            <span className="ml-2 text-green-600">Included</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Running total */}
          {basePrice != null && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-600">Estimated total</span>
                <span className="text-lg font-semibold text-gray-900">
                  from ${(basePrice + modifierTotal).toLocaleString()} + GST
                </span>
              </div>
            </div>
          )}

          {/* Gentle prompt for missing single-choice selections */}
          {missingSingleChoices && (
            <p className="mt-4 text-sm text-gray-500">
              You haven&apos;t selected options for all categories &mdash; that&apos;s OK, we can
              discuss during the quote process.
            </p>
          )}

          {/* Quote CTA */}
          <Link
            href={buildQuoteUrl(productSlug, selections)}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-4 w-full text-center',
            )}
          >
            Request a Quote
          </Link>
        </div>
      )}
    </div>
  )
}
