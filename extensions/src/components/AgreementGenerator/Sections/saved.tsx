import { Sections } from '@/types/AgreementGenerator';
import React, { Dispatch, SetStateAction } from 'react'
import NoDataFound from '../../Page/NoDataFound';

type Props = {
    setSection: Dispatch<SetStateAction<Sections>>;
}

export default function SavedAssets({ setSection }: Props) {
  return (
    <div className='h-[80vh]'>
        <NoDataFound text='No saved assets found' redirectBtn={{text: "Generate One", fn: ()=>setSection("home")}}/>
    </div>
  )
}