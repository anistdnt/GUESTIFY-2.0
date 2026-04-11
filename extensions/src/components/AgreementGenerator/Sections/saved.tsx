import { SavedAgreement, Sections } from '@/types/AgreementGenerator';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import NoDataFound from '../../Page/NoDataFound';
import { FileTextIcon, CalendarIcon, UserIcon, ArrowRightIcon } from '@phosphor-icons/react';

type Props = {
    setSection: Dispatch<SetStateAction<Sections>>;
    loadAgreement: (agreement: SavedAgreement) => void;
}

export default function SavedAssets({ setSection, loadAgreement }: Props) {
  const [savedAgreements, setSavedAgreements] = useState<SavedAgreement[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated fetching logic
  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Data
      const mockData: SavedAgreement[] = [
        {
          _id: "1",
          title: "Standard Residential Lease",
          description: "Lease for Apartment 4B - John Doe",
          content: "<h1>Standard Lease</h1><p>This agreement is made between...</p>",
          metadata: {
            formData: { tenant_name: "John Doe", owner_name: "Admin" },
            settings: { top: 25, bottom: 25, left: 25, right: 25, showBorder: true, borderWidth: 1, borderStyle: "solid" },
            generatedAt: new Date().toISOString()
          },
          version: 1,
          status: "COMPLETED",
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          title: "Commercial Office Rental",
          description: "Office Space #201 - Tech Solutions Inc",
          content: "<h1>Commercial Rental</h1><p>Business lease terms...</p>",
          metadata: {
            formData: { tenant_name: "Tech Solutions Inc", owner_name: "Admin" },
            settings: { top: 25, bottom: 25, left: 25, right: 25, showBorder: true, borderWidth: 1, borderStyle: "solid" },
            generatedAt: new Date().toISOString()
          },
          version: 1,
          status: "COMPLETED",
          createdAt: new Date().toISOString()
        }
      ];

      setSavedAgreements(mockData);
      setLoading(false);
    };

    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  if (savedAgreements.length === 0) {
    return (
      <div className='h-[80vh]'>
          <NoDataFound text='No saved assets found' redirectBtn={{text: "Generate One", fn: ()=>setSection("home")}}/>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Saved Vault</h3>
        <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">{savedAgreements.length} Assets</span>
      </div>

      <div className="grid gap-4">
        {savedAgreements.map((agreement) => (
          <div 
            key={agreement._id}
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5 transition-all duration-300 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-100/50 transition-colors" />

            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-violet-100 transition-all">
                <FileTextIcon size={24} weight="duotone" className="text-slate-400 group-hover:text-violet-500" />
              </div>

              <div className="flex-1 min-w-0 pr-12">
                <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{agreement.title}</h4>
                <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{agreement.description || "No description provided"}</p>
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5">
                    <UserIcon size={12} weight="bold" />
                    <span>{agreement.metadata.formData?.tenant_name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon size={12} weight="bold" />
                    <span>{new Date(agreement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => loadAgreement(agreement)}
                className="absolute top-1/2 -translate-y-1/2 right-0 p-3 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-900/20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300"
              >
                <ArrowRightIcon size={18} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}