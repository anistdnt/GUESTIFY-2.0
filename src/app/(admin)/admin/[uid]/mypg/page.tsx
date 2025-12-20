import PGComponent from '@/components/Page/PGComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['mypg'];

export default function Page() {
  return (
    <div>
      <PGComponent/>
    </div>
  )
}