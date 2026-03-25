import { nanoid } from 'nanoid'
import type { SceneTemplate } from './types'

export function cloneTemplate(
  template: SceneTemplate,
  position: [number, number, number],
): SceneTemplate {
  const idMap = new Map<string, string>()
  for (const oldId of Object.keys(template.nodes)) {
    const node = template.nodes[oldId] as { type?: string }
    const prefix = node.type ?? 'node'
    idMap.set(oldId, `${prefix}_${nanoid(8)}`)
  }

  const nodes: Record<string, unknown> = {}
  for (const [oldId, node] of Object.entries(template.nodes)) {
    const newId = idMap.get(oldId)!
    const cloned = JSON.parse(JSON.stringify(node)) as Record<string, unknown>
    cloned.id = newId
    if (typeof cloned.parentId === 'string' && idMap.has(cloned.parentId)) {
      cloned.parentId = idMap.get(cloned.parentId)!
    }
    if (Array.isArray(cloned.children)) {
      cloned.children = (cloned.children as string[]).map((childId) => idMap.get(childId) ?? childId)
    }
    nodes[newId] = cloned
  }

  const rootNodeIds = template.rootNodeIds.map((id) => idMap.get(id)!).filter(Boolean)
  for (const rootId of rootNodeIds) {
    const rootNode = nodes[rootId] as Record<string, unknown>
    rootNode.position = position
  }

  return { nodes, rootNodeIds }
}
