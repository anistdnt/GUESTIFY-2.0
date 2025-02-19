import { EnvelopeSimple, Phone, X } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ModalType = {
    setshowModal: (show: boolean) => void;
};

function OwnerInfoModal({ setshowModal }: ModalType) {
  return (
    <div 
      className='fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10'
      onClick={() => setshowModal(false)}
    >
      <div 
        className='relative flex flex-col gap-5 bg-white p-6 mx-2 rounded-md shadow-lg max-w-[500px]' 
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-row justify-between items-center'>
            <h3 className='text-xl'>Owner Information</h3>
            <button onClick={()=>{
                setshowModal(false);
            }}><X size={20} /></button>
        </div>
        <hr/>
        <div className='flex flex-col sm:flex-row justify-start items-center gap-10'>
            <Image src={'/assets/profile.png'} alt='owner' width={100} height={100} className='rounded-full border' objectFit='cover'/>
            <div className='flex flex-col gap-2 text-wrap'>
                <p className='text-3xl mb-2'><span className='text-sm'>Mr. </span>Happy Singh</p>
                <p className='text-sm flex flex-row gap-2 justify-start items-center text-gray-700'><EnvelopeSimple size={20} color="#e2553c" weight='bold'/><span><Link href='mailto:happy@gmail.com' className='hover:underline'>happy@gmail.com</Link></span></p>
                <p className='text-sm flex flex-row gap-2 justify-start items-center text-gray-700'><Phone size={20} color="#0f763b" weight='bold' /><span><Link href='tel:6321452879' className='hover:underline'>6321452879</Link></span></p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerInfoModal;
