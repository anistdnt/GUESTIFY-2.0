import About from '@/components/Page/User/AboutComp';
import { metadataMap } from '@/metadata/metadata.config';
import React from 'react';

export const metadata = metadataMap['about'];

export default function Page() {
  return (
    <div>
      <About/>
    </div>
  )
}