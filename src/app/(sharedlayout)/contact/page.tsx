import ContactPage from '@/components/Page/User/ContactUsComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['contact'];

export default function Page() {
  return (
    <div>
      <ContactPage/>
    </div>
  )
}