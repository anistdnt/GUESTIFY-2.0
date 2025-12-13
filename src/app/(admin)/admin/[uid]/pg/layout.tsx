import { metadataMap } from "@/metadata/metadata.config";

export const metadata = metadataMap['pg'];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
