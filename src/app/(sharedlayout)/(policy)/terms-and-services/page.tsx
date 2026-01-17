import TermsComp from '@/components/Page/User/Policies/TOS';
import { metadataMap } from "@/metadata/metadata.config";
import React from 'react';

export const metadata = metadataMap["terms_and_services"];

export default function TermsPage() {
  return (
    <div>
      <TermsComp/>
    </div>
  )
}