import PaymentLogList from '@/components/Page/PaymentComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['payments'];

export default function Page() {
  return (
    <div>
        <PaymentLogList/>
    </div>
  )
}