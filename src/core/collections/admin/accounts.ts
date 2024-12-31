import { CollectionConfig } from 'payload'

export function buildAccountsCollection(
  account: {
    slug: string
    hidden: boolean
  },
  usersCollectionSlug: string,
) {
  const accountsCollection: CollectionConfig = {
    slug: account.slug,
    admin: {
      useAsTitle: 'id',
      hidden: account.hidden,
    },
    access: {
      read: () => true,
      create: () => false,
      update: () => false,
      delete: () => false,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'picture',
        type: 'text',
      },
      {
        name: 'user',
        type: 'relationship',
        relationTo: usersCollectionSlug,
        hasMany: false,
        required: true,
        label: 'User',
      },
      {
        name: 'issuerName',
        type: 'text',
        required: true,
        label: 'Issuer Name',
      },
      {
        name: 'scope',
        type: 'text',
        required: true,
      },
      {
        name: 'sub',
        type: 'text',
        required: true,
      },
    ],
  }
  return accountsCollection
}
