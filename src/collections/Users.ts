import type { Access, CollectionConfig, FieldAccess } from 'payload'

// A user is an admin when their `role` is 'admin'. The `role` field is a
// single-value `select`, so `role` is a string — but we defensively handle the
// array case too in case the field is ever changed to `hasMany`.
function userIsAdmin(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  const role = (user as { role?: unknown }).role
  if (Array.isArray(role)) return role.includes('admin')
  return role === 'admin'
}

// Collection-level access: only admins may perform the action.
const isAdmin: Access = ({ req: { user } }) => userIsAdmin(user)

// Field-level access: only admins may set/change the value.
const isAdminFieldAccess: FieldAccess = ({ req: { user } }) => userIsAdmin(user)

// Admins can read/update any user; non-admins are constrained to their own
// document via a query constraint (needed for the admin account page and for
// Payload to load the logged-in user). Anonymous requests are denied.
const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (userIsAdmin(user)) return true
  return { id: { equals: user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  access: {
    // Creating new users (managing OTHER users) is admin-only. Payload's
    // first-user bootstrap bypasses access control, so initial setup is fine.
    create: isAdmin,
    // Deleting users is admin-only.
    delete: isAdmin,
    // Admins can read all users; non-admins can only read their own record.
    read: adminOrSelf,
    // Admins can update any user; non-admins can only update their own record
    // (and cannot change their `role` — enforced by field-level access below).
    update: adminOrSelf,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor'],
      defaultValue: 'editor',
      // Only admins may set or change a role. This prevents a non-admin from
      // escalating their own privileges while updating their own profile.
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
    },
  ],
}
