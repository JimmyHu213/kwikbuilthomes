import { describe, it, expect } from 'vitest'
import { cloneTemplate } from '../planner/template'
import type { SceneTemplate } from '../planner/types'

const sampleTemplate: SceneTemplate = {
  nodes: {
    'building_abc': { id: 'building_abc', type: 'building', parentId: null },
    'level_def': { id: 'level_def', type: 'level', parentId: 'building_abc' },
    'wall_ghi': { id: 'wall_ghi', type: 'wall', parentId: 'level_def' },
  },
  rootNodeIds: ['building_abc'],
}

describe('cloneTemplate', () => {
  it('generates new IDs for all nodes', () => {
    const result = cloneTemplate(sampleTemplate, [0, 0, 0])
    const originalIds = Object.keys(sampleTemplate.nodes)
    const clonedIds = Object.keys(result.nodes)
    for (const id of clonedIds) {
      expect(originalIds).not.toContain(id)
    }
  })

  it('preserves parent-child relationships with remapped IDs', () => {
    const result = cloneTemplate(sampleTemplate, [0, 0, 0])
    const nodes = Object.values(result.nodes) as Array<{ id: string; parentId: string | null; type: string }>
    const levelNode = nodes.find((n) => n.type === 'level')!
    const buildingNode = nodes.find((n) => n.type === 'building')!
    expect(levelNode.parentId).toBe(buildingNode.id)
  })

  it('updates rootNodeIds with remapped IDs', () => {
    const result = cloneTemplate(sampleTemplate, [0, 0, 0])
    expect(result.rootNodeIds).toHaveLength(1)
    expect(Object.keys(result.nodes)).toContain(result.rootNodeIds[0])
  })

  it('preserves node count', () => {
    const result = cloneTemplate(sampleTemplate, [0, 0, 0])
    expect(Object.keys(result.nodes)).toHaveLength(3)
  })

  it('sets position on root node', () => {
    const result = cloneTemplate(sampleTemplate, [5, 0, 10])
    const rootNode = result.nodes[result.rootNodeIds[0]] as Record<string, unknown>
    expect(rootNode.position).toEqual([5, 0, 10])
  })
})
