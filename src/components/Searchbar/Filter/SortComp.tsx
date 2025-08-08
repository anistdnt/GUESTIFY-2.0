'use client';

import { sortType } from '@/types/generic';
import React from 'react';
import Select from 'react-select';

const options: sortType[] = [
  { value: 'avgRating', label: 'Average Rating' },
  { value: 'minRent', label: 'Starting Rent' },
];

export const SortComp = ({selectedOption, setSelectedOption}) => {

  return (
    <div className="flex items-center space-x-4 h-12 ps-3 rounded-md">
      <span className="text-gray-500 font-semibold">Sort By</span>
      <div className="w-48">
        <Select
          options={options}
          value={selectedOption}
          onChange={(option) => setSelectedOption(option)}
          placeholder="Select..."
          classNames={{
            control: () => 'border border-gray-300 rounded shadow-sm',
            placeholder: () => 'text-gray-400',
            singleValue: () => 'text-gray-700',
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 6,
            colors: {
              ...theme.colors,
              primary25: '#F9A40B33', 
              primary: '#F9A40B', 
            },
          })}
        />
      </div>
    </div>
  );
};

export default SortComp;
