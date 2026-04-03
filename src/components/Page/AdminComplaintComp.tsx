"use client";

import { useEffect, useState } from "react";
import { api_caller } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import toast from "react-hot-toast";
import Select from "react-select";
import AdminComplaintCard from "@/components/Complaint/AdminComplaintCard";
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, triggerRefetch } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import { Funnel, ArrowsClockwise } from "@phosphor-icons/react";

const priorityFilterOptions = [
  { label: "High Priority", value: "high" },
  { label: "Medium Priority", value: "medium" },
  { label: "Low Priority", value: "low" },
];

const statusFilterOptions = [
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminComplaintComp({ uid }: { uid: string }) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriorities, setSelectedPriorities] = useState<any[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<any[]>([]);
  const dispatch = useDispatch();
  const isRefetch = useSelector((state: RootState) => state.modal_slice.isRefetch);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      
      if (selectedPriorities.length > 0) {
        queryParams.push(`priority=${selectedPriorities.map(p => p.value).join(",")}`);
      }
      if (selectedStatuses.length > 0) {
        queryParams.push(`status=${selectedStatuses.map(s => s.value).join(",")}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const res = await api_caller<any>("GET", `${API.COMPLAINT.LIST}${queryString}`);
      
      if (res.success) {
        setComplaints(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch complaints");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedPriorities, selectedStatuses]);

  useEffect(() => {
    if (isRefetch) {
      fetchComplaints();
      dispatch(triggerRefetch(false));
    }
  }, [isRefetch]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    dispatch(setModalVisibility({
      open: true,
      type: "complaint_resolution",
      modalData: { id, status: newStatus }
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api_caller<any>("DELETE", `${API.COMPLAINT.DELETE}/${id}`);
      if (res.success) {
        toast.success("Complaint deleted successfully");
        setComplaints(prev => prev.filter(c => c._id !== id));
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting complaint");
    }
  };

  const handleView = (complaint: any) => {
    dispatch(setModalVisibility({ 
      open: true, 
      type: "viewcomplaint", 
      modalData: complaint 
    }));
  };

  return (
    <div className="space-y-10 animate-slideFadeIn">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-[1rem] border border-gray-100 shadow-sm gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-normal text-gray-900 font-display tracking-tight">
            User <span className="italic-serif text-primary-600">Complaints</span>
          </h2>
          <p className="text-sm text-gray-400 font-jakarta max-w-xs">Review and resolve issues reported by your residents.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Priority Filter */}
          <div className="min-w-[180px] flex-1 lg:flex-none">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <Funnel size={12} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</span>
            </div>
            <Select
              isMulti
              options={priorityFilterOptions}
              value={selectedPriorities}
              onChange={(s) => setSelectedPriorities(s as any[])}
              placeholder="All Priorities"
              className="text-xs font-jakarta"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "1rem",
                  borderColor: "#f3f4f6",
                  padding: "2px",
                  "&:hover": { borderColor: "#d97706" }
                })
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[180px] flex-1 lg:flex-none">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <Funnel size={12} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
            </div>
            <Select
              isMulti
              options={statusFilterOptions}
              value={selectedStatuses}
              onChange={(s) => setSelectedStatuses(s as any[])}
              placeholder="All Statuses"
              className="text-xs font-jakarta"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "1rem",
                  borderColor: "#f3f4f6",
                  padding: "2px",
                  "&:hover": { borderColor: "#d97706" }
                })
              }}
            />
          </div>

          <button 
            onClick={fetchComplaints}
            className="self-end lg:mb-[1px] p-3.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all flex items-center justify-center group"
            title="Refresh List"
          >
            <ArrowsClockwise size={20} weight="bold" className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
          <div className="w-14 h-14 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-jakarta text-xs animate-pulse tracking-[0.2em] uppercase font-bold">Synchronizing records...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
           <NoDataFound 
            text="No complaints found matching your criteria." 
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {complaints.map((complaint) => (
            <AdminComplaintCard
              key={complaint._id}
              complaint={complaint}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
