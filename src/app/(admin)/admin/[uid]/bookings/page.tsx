import BookingList from '@/components/Page/BookingComp'
import { metadataMap } from '@/metadata/metadata.config'
import React from 'react'

export const metadata = metadataMap['bookings'];

export default function Page() {
  return (
    <div>
      <BookingList/>
    </div>
  )
}