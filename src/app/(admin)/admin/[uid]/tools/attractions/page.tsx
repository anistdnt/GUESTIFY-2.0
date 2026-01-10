import LocalAttractionsComp from '@/components/Page/LocalAttractionsComp';
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['attraction'];

export default function Page() {
  return (
    <div>
      <LocalAttractionsComp/>
    </div>
  )
}