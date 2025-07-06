export function base64ToFile(base64String: string, fileName: string) {
  const arr = base64String.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid base64 string");

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]); // decode Base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}