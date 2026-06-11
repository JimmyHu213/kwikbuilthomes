import { describe, it, expect } from 'vitest'
import { Users } from '../Users'
import type { Field, SelectField } from 'payload'

type AccessFn = (...args: unknown[]) => unknown

const admin = { id: 1, role: 'admin' }
const editor = { id: 2, role: 'editor' }

function getRoleField(): SelectField {
  const field = Users.fields.find(
    (f): f is SelectField => 'name' in f && f.name === 'role',
  )
  if (!field) throw new Error('role field not found')
  return field
}

describe('Users collection', () => {
  it('has correct slug and auth enabled', () => {
    expect(Users.slug).toBe('users')
    expect(Users.auth).toBe(true)
  })

  it('has correct admin config', () => {
    expect(Users.admin?.useAsTitle).toBe('email')
    expect(Users.admin?.group).toBe('Admin')
  })

  it('defines collection-level access (not Payload defaults)', () => {
    const access = Users.access!
    expect(access.create).toBeDefined()
    expect(access.read).toBeDefined()
    expect(access.update).toBeDefined()
    expect(access.delete).toBeDefined()
  })

  describe('create access', () => {
    const create = () => Users.access!.create as unknown as AccessFn

    it('allows admins', () => {
      expect(create()({ req: { user: admin } })).toBe(true)
    })

    it('denies non-admin (editor)', () => {
      expect(create()({ req: { user: editor } })).toBe(false)
    })

    it('denies anonymous', () => {
      expect(create()({ req: { user: null } })).toBe(false)
    })
  })

  describe('delete access', () => {
    const del = () => Users.access!.delete as unknown as AccessFn

    it('allows admins', () => {
      expect(del()({ req: { user: admin } })).toBe(true)
    })

    it('denies non-admin (editor)', () => {
      expect(del()({ req: { user: editor } })).toBe(false)
    })

    it('denies anonymous', () => {
      expect(del()({ req: { user: null } })).toBe(false)
    })
  })

  describe('read access', () => {
    const read = () => Users.access!.read as unknown as AccessFn

    it('allows admins to read all users (returns true)', () => {
      expect(read()({ req: { user: admin } })).toBe(true)
    })

    it('constrains non-admins to their own record', () => {
      expect(read()({ req: { user: editor } })).toEqual({ id: { equals: editor.id } })
    })

    it('denies anonymous', () => {
      expect(read()({ req: { user: null } })).toBe(false)
    })
  })

  describe('update access', () => {
    const update = () => Users.access!.update as unknown as AccessFn

    it('allows admins to update any user (returns true)', () => {
      expect(update()({ req: { user: admin } })).toBe(true)
    })

    it('constrains non-admins to updating their own record', () => {
      expect(update()({ req: { user: editor } })).toEqual({ id: { equals: editor.id } })
    })

    it('denies anonymous', () => {
      expect(update()({ req: { user: null } })).toBe(false)
    })
  })

  describe('role field-level access (privilege escalation guard)', () => {
    it('has field-level access defined on role', () => {
      const role = getRoleField()
      expect(role.access).toBeDefined()
      expect(role.access?.create).toBeDefined()
      expect(role.access?.update).toBeDefined()
    })

    it('allows admins to set role on create', () => {
      const role = getRoleField()
      const fn = role.access!.create as unknown as AccessFn
      expect(fn({ req: { user: admin } })).toBe(true)
    })

    it('blocks non-admins from setting role on create', () => {
      const role = getRoleField()
      const fn = role.access!.create as unknown as AccessFn
      expect(fn({ req: { user: editor } })).toBe(false)
    })

    it('allows admins to change role on update', () => {
      const role = getRoleField()
      const fn = role.access!.update as unknown as AccessFn
      expect(fn({ req: { user: admin } })).toBe(true)
    })

    it('blocks non-admins from changing role on update (no self-escalation)', () => {
      const role = getRoleField()
      const fn = role.access!.update as unknown as AccessFn
      expect(fn({ req: { user: editor } })).toBe(false)
    })
  })

  it('has role select with expected options and default', () => {
    const role = getRoleField()
    expect(role.type).toBe('select')
    const values = role.options.map((o) => (typeof o === 'string' ? o : o.value))
    expect(values).toEqual(expect.arrayContaining(['admin', 'editor']))
    expect(role.defaultValue).toBe('editor')
  })

  it('has a name field', () => {
    const name = Users.fields.find(
      (f): f is Field & { name: string } => 'name' in f && f.name === 'name',
    )
    expect(name).toMatchObject({ type: 'text' })
  })
})
