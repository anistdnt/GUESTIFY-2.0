"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api_caller } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import ComplaintForm from "@/components/Complaint/ComplaintForm";
import ComplaintList from "@/components/Complaint/ComplaintList";
import toast from "react-hot-toast";
import Select from "react-select";

const priorityFilterOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export default function ComplaintBoxPage() {
  const { uid } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState<{ value: string; label: string }[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);
  const [selectedPriorities, setSelectedPriorities] = useState<any[]>([]);

  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      let url = API.COMPLAINT.LIST;
      if (selectedPriorities.length > 0) {
        const priorities = selectedPriorities.map(p => p.value).join(",");
        url += `?priority=${priorities}`;
      }
      const res = await api_caller<any>("GET", url);
      if (res.success) {
        setComplaints(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch complaints");
      }
    } catch (error) {
      toast.error("Error fetching complaints");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      // Fetch user bookings to get available rooms for complaints
      const res = await api_caller<any>("GET", `${API.BOOKING.ROOMLIST}?show=100&filter=accepted`);
      if (res.success) {
        const bookings = res.data?.bookings || [];
        // Extract unique rooms from accepted bookings
        const availableRooms = bookings
          .map((b: any) => ({
            value: b.room_details.id,
            label: `${b.pg_name} - ${b.room_details.type} Bed`,
          }));
        setRooms(availableRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchRooms();
  }, [selectedPriorities]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      const res = await api_caller("DELETE", `${API.COMPLAINT.DELETE}/${id}`);
      if (res.success) {
        toast.success("Complaint deleted");
        fetchComplaints();
      } else {
        toast.error(res.message || "Delete failed");
      }
    }
  };

  const handleEdit = (complaint: any) => {
    setEditingComplaint(complaint);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
          <ComplaintForm
            rooms={rooms}
            onSuccess={() => {
              fetchComplaints();
              setEditingComplaint(null);
            }}
            uid={uid as string}
            editingComplaint={editingComplaint}
            onCancel={() => setEditingComplaint(null)}
          />
        </div>

        {/* Right Side: List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 gap-4">
             <div className="space-y-1">
                <h2 className="text-2xl font-normal text-gray-900 font-display tracking-tight">
                    Your <span className="italic-serif text-primary-600">Complaints</span>
                </h2>
                <p className="text-xs text-gray-400 font-jakarta">Track and manage your reported issues.</p>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="min-w-[200px] flex-1 md:flex-none">
                  <Select
                    isMulti
                    options={priorityFilterOptions}
                    value={selectedPriorities}
                    onChange={(selected) => setSelectedPriorities(selected as any[])}
                    placeholder="Filter by Priority"
                    className="text-xs font-jakarta"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "1rem",
                        borderColor: "#f3f4f6",
                        "&:hover": { borderColor: "#e5e7eb" }
                      })
                    }}
                  />
                </div>
                <button 
                  onClick={fetchComplaints}
                  className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-gray-50 transition-all font-jakarta whitespace-nowrap"
                >
                  Refresh
                </button>
             </div>
          </div>
          
          <ComplaintList
            complaints={complaints}
            loading={loadingComplaints}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}
