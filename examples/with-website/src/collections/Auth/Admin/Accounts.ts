import { withAccountCollection } from 'payload-auth-plugin/collection'
export const AdminAccounts = withAccountCollection(
  {
    slug: 'accounts',
  },
  'users',
)
