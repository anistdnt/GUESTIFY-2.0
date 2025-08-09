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

export const RangeSlider = ({ values, setValues, MAX=10, MIN=1, STEP=1, unit='km' } : RangeSliderProps) => {

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
    <div className="bg-slate-100 h-12 px-4 w-full rounded-md select-none text-gray-800 flex justify-between items-center gap-3">
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={values}
        onChange={setValues}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="relative h-1.5 w-2/3 rounded bg-gray-400"
          >
            {scaleMarks}
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
              title={`${values[index]} km`}
              className={`
                relative flex items-center justify-center
                h-6 w-6 rounded-full
                bg-buttons
                cursor-pointer
                transition-colors
                ${isDragged ? 'bg-buttons' : 'hover:bg-buttonsHover'}
              `}
            >
              {/* Tooltip - visible when dragging */}
              <div
                className={`
                  absolute -top-10 px-2 py-1 rounded
                  bg-black bg-opacity-75 text-xs font-semibold
                  whitespace-nowrap text-white
                  pointer-events-none
                  transition-opacity duration-300
                  ${isDragged ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {values[index]} {unit}
              </div>
            </div>
          );
        }}
      />
      <div className="text-sm select-none font-semibold text-gray-500">
        {values?.length > 1 ?
          `Selected range: ${values[0]} ${unit} - ${values[1]} ${unit}` :
          `Selected value: ${values[0]} ${unit}`}
      </div>
    </div>
  );
};
