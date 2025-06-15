import { redirect } from 'next/navigation'
import { AdminViewServerProps } from 'payload'
import React, { Fragment } from 'react'
import AdminLoginViewClient from './client'
export const AdminLoginView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const {
    req: { user },
  } = initPageResult
  if (!!user) {
    redirect('/admin')
  }

  return <AdminLoginViewClient />
}
