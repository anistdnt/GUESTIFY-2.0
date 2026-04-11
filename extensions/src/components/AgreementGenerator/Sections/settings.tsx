"use client";
import React, { Dispatch, SetStateAction } from "react";
import { SlidersHorizontalIcon, RulerIcon, InfoIcon, CornersOutIcon, PaletteIcon } from "@phosphor-icons/react";
import { PageSettings } from "@/types/AgreementGenerator";

type Props = {
  pageSettings: PageSettings;
  setPageSettings: Dispatch<SetStateAction<PageSettings>>;
};

export default function SettingsSection({ pageSettings, setPageSettings }: Props) {
  const handleMarginChange = (side: keyof PageSettings, value: number) => {
    setPageSettings((prev) => ({
      ...prev,
      [side]: value,
    }));
  };

  const MARGIN_CONFIG = [
    { key: 'top' as const, label: 'Top Margin', icon: CornersOutIcon },
    { key: 'bottom' as const, label: 'Bottom Margin', icon: CornersOutIcon },
    { key: 'left' as const, label: 'Left Margin', icon: CornersOutIcon },
    { key: 'right' as const, label: 'Right Margin', icon: CornersOutIcon },
  ];

  return (
    <div className="space-y-10 text-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* HEADER */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-500 mb-2">Page Geometry</h4>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
          Document Setup
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Configure physical page margins and aesthetics
        </p>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* AESTHETICS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <PaletteIcon size={18} weight="bold" className="text-violet-500" />
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Document Aesthetics</label>
        </div>

        <div className="grid gap-6">
          {/* Border Toggle */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-violet-200 transition-all group">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-violet-50 transition-colors">
                      <CornersOutIcon size={16} weight="bold" className="text-slate-400 group-hover:text-violet-500" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enable Document Border</span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">Visually frame the agreement</span>
                  </div>
              </div>
              
              <button 
                  onClick={() => setPageSettings(prev => ({ ...prev, showBorder: !prev.showBorder }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${pageSettings.showBorder ? 'bg-violet-600' : 'bg-slate-200'}`}
              >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pageSettings.showBorder ? 'left-7' : 'left-1'}`} />
              </button>
          </div>

          {pageSettings.showBorder && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
               {/* Border Thickness */}
               <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Border Weight</span>
                    <span className="text-xs font-bold text-violet-600 px-2 py-1 bg-violet-50 rounded-lg">{pageSettings.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={pageSettings.borderWidth}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, borderWidth: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
               </div>

               {/* Border Style */}
               <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Frame Style</span>
                  </div>
                  <select 
                    value={pageSettings.borderStyle}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, borderStyle: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="solid">Solid Line</option>
                    <option value="double">Double Frame</option>
                    <option value="dashed">Dashed Outline</option>
                    <option value="dotted">Dotted Edge</option>
                  </select>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* MARGIN CONTROLS */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 px-1">
          <RulerIcon size={18} weight="bold" className="text-violet-500" />
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Print Margins (mm)</label>
        </div>

        <div className="grid gap-6">
          {MARGIN_CONFIG.map((config) => (
            <div key={config.key} className="space-y-4 p-5 bg-white border border-slate-200 rounded-2xl transition-all hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5 group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-violet-50 transition-colors">
                    <config.icon size={16} weight="bold" className="text-slate-400 group-hover:text-violet-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        value={pageSettings[config.key]}
                        onChange={(e) => handleMarginChange(config.key as keyof PageSettings, parseInt(e.target.value) || 0)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-violet-600 text-center focus:outline-none focus:border-violet-300"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">mm</span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={pageSettings[config.key]}
                onChange={(e) => handleMarginChange(config.key as keyof PageSettings, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* INFO BOX */}
      <div className="flex items-start gap-4 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
        <InfoIcon size={20} weight="fill" className="text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest leading-relaxed">Print Optimization</p>
          <p className="text-[10px] font-medium text-amber-700/70 uppercase tracking-widest leading-relaxed">
            Standard legal margins are typically 25.4mm (1 inch). High-margin layouts offer a more premium, curated aesthetic.
          </p>
        </div>
      </div>
    </div>
  );
}
