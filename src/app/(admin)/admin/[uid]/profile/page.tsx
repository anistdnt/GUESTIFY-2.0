import AdminProfileComponent from '@/components/Page/AdminProfileComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['profile'];

export default function Page() {
  return (
    <div>
      <AdminProfileComponent/>
    </div>
  )
}