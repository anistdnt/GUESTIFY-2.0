export function transformSelection(
  editor: any,
  transformer: (text: string) => string
) {
  const { from, to } = editor.state.selection;
  if (from === to) return;

  const text = editor.state.doc.textBetween(from, to);

  editor.chain().focus().insertContentAt({ from, to }, transformer(text)).run();
}

export const FONT_SIZES = [
  { label: "S", size: "14px" },
  { label: "M", size: "16px" },
  { label: "L", size: "18px" },
  { label: "XL", size: "20px" },
];


// utils/numberToWords.ts
const ones = [
  "", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty",
  "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertBelowThousand(num: number): string {
  let str = "";

  if (num >= 100) {
    str += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }

  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num > 0) {
    str += ones[num] + " ";
  }

  return str.trim();
}

export function numberToWords(num: number): string {
  if (!num) return "";

  let result = "";

  if (num >= 100000) {
    result += convertBelowThousand(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  if (num >= 1000) {
    result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  if (num > 0) {
    result += convertBelowThousand(num);
  }

  return result.trim();
}
