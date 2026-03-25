'use client'

import { MousePointer2, Move, RotateCw, Trash2, Undo2, Redo2, Eye } from 'lucide-react'
import { usePlannerStore } from '@/lib/planner/store'
import type { PlannerTool } from '@/lib/planner/types'

const tools: { id: PlannerTool; label: string; icon: typeof MousePointer2 }[] = [
  { id: 'select', label: 'Select', icon: MousePointer2 },
  { id: 'move', label: 'Move', icon: Move },
  { id: 'rotate', label: 'Rotate', icon: RotateCw },
  { id: 'delete', label: 'Delete', icon: Trash2 },
]

type ModuleToolbarProps = {
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function ModuleToolbar({ onUndo, onRedo, canUndo, canRedo }: ModuleToolbarProps) {
  const { tool, setTool, cameraMode, toggleCameraMode } = usePlannerStore()

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card">
      {tools.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTool(id)}
          title={label}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
            tool === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
      <div className="flex-1" />
      <button
        type="button"
        onClick={toggleCameraMode}
        title={`Switch to ${cameraMode === 'orthographic' ? 'perspective' : 'top-down'} view`}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Eye className="h-3.5 w-3.5" />
        {cameraMode === 'orthographic' ? '3D View' : 'Top Down'}
      </button>
      <div className="w-px h-5 bg-border mx-1" />
      <button type="button" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <Redo2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
