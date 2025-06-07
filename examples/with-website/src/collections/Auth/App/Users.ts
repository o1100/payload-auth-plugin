import { deleteLinkedAccounts } from 'payload-auth-plugin/collection/hooks'
import { AppUsersAccounts } from './Accounts'
import { withUsersCollection } from 'payload-auth-plugin/collection'
export const AppUsers = withUsersCollection({
  slug: 'appUsers',
  admin: {
    defaultColumns: ['fullName', 'email'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
  timestamps: true,
  hooks: {
    afterDelete: [deleteLinkedAccounts(AppUsersAccounts.slug)],
  },
})
