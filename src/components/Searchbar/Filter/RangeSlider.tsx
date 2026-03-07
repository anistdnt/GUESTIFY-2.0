'use client';

import React, { use, useMemo } from 'react';
import { Range } from 'react-range';

type RangeSliderProps = {
  values: number[];
  setValues: (values: number[]) => void;
  MAX?: number;
  MIN?: number;
  STEP?: number;
  unit?: string;
};

export const RangeSlider = ({ values, setValues, MAX=20, MIN=1, STEP=1, unit='km' } : RangeSliderProps) => {

  const scaleMarks = useMemo(() => {
    return Array.from({ length: (MAX - MIN) / STEP + 1 }, (_, i) => {
      const value = MIN + i * STEP;
      return (
        <div
          key={value}
          aria-hidden="true"
          className="absolute top-3 w-[2px] h-2 bg-gray-400"
          style={{ left: `${((value - MIN) * 100) / (MAX - MIN)}%`, transform: 'translateX(-1px)' }}
        />
      );
    });
  }, [MIN, MAX, STEP]);

  return (
    <div className="bg-transparent h-16 lg:h-14 px-4 w-full select-none text-gray-800 flex justify-between items-center gap-6">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
           <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-jakarta">Radius</span>
           <span className="text-xs font-bold text-primary-600 font-jakarta">
              {values[0]}{unit}
           </span>
        </div>
        <Range
          step={STEP}
          min={MIN}
          max={MAX}
          values={values}
          onChange={setValues}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="relative h-1.5 w-full rounded-full bg-gray-100"
            >
              <div 
                className="absolute h-full bg-primary-600 rounded-full"
                style={{
                  width: `${((values[0] - MIN) * 100) / (MAX - MIN)}%`
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props, index, isDragged }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                role="slider"
                tabIndex={0}
                aria-valuemin={MIN}
                aria-valuemax={MAX}
                aria-valuenow={values[index]}
                aria-valuetext={`${values[index]} kilometers`}
                className={`
                  relative flex items-center justify-center
                  h-5 w-5 rounded-full
                  bg-white border-2 border-primary-600
                  shadow-md shadow-primary-200/50
                  cursor-pointer
                  transition-all duration-300 outline-none
                  ${isDragged ? 'scale-125 shadow-lg' : 'hover:scale-110'}
                `}
              >
                {/* Visual pulse when dragged */}
                {isDragged && (
                  <span className="absolute inset-0 rounded-full bg-primary-600/20 animate-ping"></span>
                )}
              </div>
            );
          }}
        />
      </div>
      <div className="hidden sm:block text-[10px] font-bold text-gray-300 tracking-tight uppercase font-jakarta shrink-0 whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
         {MAX}{unit} max
      </div>
    </div>
  );
};
