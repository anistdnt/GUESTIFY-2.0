import AdminComplaintComp from "@/components/Page/AdminComplaintComp";
import React from "react";

export default async function AdminComplaintsPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <AdminComplaintComp uid={uid} />
    </div>
  );
}
