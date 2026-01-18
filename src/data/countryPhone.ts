import { District, westBengalDistricts } from "@/data/westbengal_districts";

export const countryCodes = [
  { label: "India", value: "+91", flagUrl: "https://flagcdn.com/w20/in.png" },
  { label: "USA", value: "+1", flagUrl: "https://flagcdn.com/w20/us.png" },
  { label: "UK", value: "+44", flagUrl: "https://flagcdn.com/w20/gb.png" },
  {
    label: "Australia",
    value: "+61",
    flagUrl: "https://flagcdn.com/w20/au.png",
  },
  { label: "Japan", value: "+81", flagUrl: "https://flagcdn.com/w20/jp.png" },
  { label: "Canada", value: "+1", flagUrl: "https://flagcdn.com/w20/ca.png" },
  { label: "Germany", value: "+49", flagUrl: "https://flagcdn.com/w20/de.png" },
  { label: "France", value: "+33", flagUrl: "https://flagcdn.com/w20/fr.png" },
  { label: "Brazil", value: "+55", flagUrl: "https://flagcdn.com/w20/br.png" },
  { label: "China", value: "+86", flagUrl: "https://flagcdn.com/w20/cn.png" },
  {
    label: "South Korea",
    value: "+82",
    flagUrl: "https://flagcdn.com/w20/kr.png",
  },
  { label: "Russia", value: "+7", flagUrl: "https://flagcdn.com/w20/ru.png" },
  { label: "Italy", value: "+39", flagUrl: "https://flagcdn.com/w20/it.png" },
  { label: "Spain", value: "+34", flagUrl: "https://flagcdn.com/w20/es.png" },
  { label: "Mexico", value: "+52", flagUrl: "https://flagcdn.com/w20/mx.png" },
  {
    label: "South Africa",
    value: "+27",
    flagUrl: "https://flagcdn.com/w20/za.png",
  },
  {
    label: "Singapore",
    value: "+65",
    flagUrl: "https://flagcdn.com/w20/sg.png",
  },
  {
    label: "New Zealand",
    value: "+64",
    flagUrl: "https://flagcdn.com/w20/nz.png",
  },
  {
    label: "Thailand",
    value: "+66",
    flagUrl: "https://flagcdn.com/w20/th.png",
  },
  { label: "UAE", value: "+971", flagUrl: "https://flagcdn.com/w20/ae.png" },
];

export const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const districtOptions = westBengalDistricts?.map((d: District)=>({
  label: d?.label || "",
  value: d?.value || ""
}));

export const stateOptions = [
  { label: "West Bengal", value: "West Bengal" },
  { label: "Assam", value: "Assam" },
  { label: "Bihar", value: "Bihar" },
  { label: "Odisha", value: "Odisha" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Kerala", value: "Kerala" },
  { label: "Telangana", value: "Telangana" },
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Punjab", value: "Punjab" },
  { label: "Haryana", value: "Haryana" },
  { label: "Delhi", value: "Delhi" },
];

export const PGType = [
  {
    label: "Boys",
    value: "boys",
  },
  {
    label: "Girls",
    value: "girls",
  },
];

export const depositOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half-Yearly", value: "halfyearly" },
  { label: "Yearly", value: "yearly" },
];

export const roomTypeOptions = [
  { label: "Single (1 Bed)", value: "single" },
  { label: "Double (2 Bed)", value: "double" },
  { label: "Triple (3 Bed)", value: "triple" },
];

export const roomAmenitiesOptions = [
  {
    label: "Basic Amenities",
    options: [
      { value: "wifi", label: "Wi-Fi" },
      { value: "air_conditioning", label: "Air Conditioning" },
      { value: "heater", label: "Heater" },
      { value: "power_backup", label: "Power Backup" },
      { value: "fan", label: "Ceiling Fan" },
    ],
  },
  {
    label: "Furnishings",
    options: [
      { value: "bed", label: "Bed" },
      { value: "mattress", label: "Mattress" },
      { value: "wardrobe", label: "Wardrobe" },
      { value: "study_table", label: "Study Table" },
      { value: "chair", label: "Chair" },
      { value: "sofa", label: "Sofa" },
      { value: "tv", label: "Television" },
    ],
  },
  {
    label: "Kitchen & Food",
    options: [
      { value: "kitchen", label: "Kitchen Access" },
      { value: "induction", label: "Induction Stove" },
      { value: "fridge", label: "Refrigerator" },
      { value: "microwave", label: "Microwave" },
      { value: "cooking_utensils", label: "Cooking Utensils" },
      { value: "meals_included", label: "Meals Included" },
      { value: "water_purifier", label: "Water Purifier" },
    ],
  },
  {
    label: "Bathroom",
    options: [
      { value: "attached_bathroom", label: "Attached Bathroom" },
      { value: "geyser", label: "Geyser" },
      { value: "western_toilet", label: "Western Toilet" },
      { value: "indian_toilet", label: "Indian Toilet" },
      { value: "shower", label: "Shower" },
    ],
  },
  {
    label: "Safety & Security",
    options: [
      { value: "cctv", label: "CCTV" },
      { value: "security_guard", label: "Security Guard" },
      { value: "fire_extinguisher", label: "Fire Extinguisher" },
      { value: "first_aid", label: "First Aid Kit" },
      { value: "lockable_storage", label: "Lockable Storage" },
    ],
  },
  {
    label: "Recreation",
    options: [
      { value: "balcony", label: "Balcony" },
      { value: "terrace", label: "Terrace Access" },
      { value: "garden", label: "Garden Access" },
      { value: "gym", label: "Gym Access" },
      { value: "common_room", label: "Common Room" },
    ],
  },
  {
    label: "Parking & Transport",
    options: [
      { value: "bike_parking", label: "Bike Parking" },
      { value: "car_parking", label: "Car Parking" },
      { value: "public_transport_nearby", label: "Public Transport Nearby" },
    ],
  },
  {
    label: "Other",
    options: [
      { value: "laundry", label: "Laundry Service" },
      { value: "housekeeping", label: "Housekeeping" },
      { value: "elevator", label: "Elevator" },
      { value: "intercom", label: "Intercom" },
      { value: "pets_allowed", label: "Pets Allowed" },
    ],
  },
];


// Function to extract Label by value
export function getAmenityLabel(value: string): string | null {
  for (const category of roomAmenitiesOptions) {
    const option = category.options.find(opt => opt.value === value);
    if (option) {
      return option.label;
    }
  }
  return null;
}