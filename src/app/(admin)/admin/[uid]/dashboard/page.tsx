import Dashboard from '@/components/Page/DashboardComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['dashboard'];

export default function Page() {
  return (
    <div>
      <Dashboard/>
    </div>
  )
}