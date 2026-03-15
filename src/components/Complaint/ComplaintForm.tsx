"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { api_caller } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import toast from "react-hot-toast";
import ImagePicker from "../Forms/imagePicker";
import Select from "react-select";
import { FloppyDisk, NotePencil, WarningCircle } from "@phosphor-icons/react";

interface ComplaintFormProps {
  rooms: { value: string; label: string }[];
  onSuccess: () => void;
  uid: string;
  editingComplaint?: any;
  onCancel?: () => void;
}

const complaintTypeOptions = [
  { label: "Maintenance", value: "maintenance" },
  { label: "Cleanliness", value: "cleanliness" },
  { label: "Security", value: "security" },
  { label: "Noise", value: "noise" },
  { label: "Others", value: "others" },
];

const priorityOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const ComplaintSchema = Yup.object().shape({
  room_id: Yup.string().required("Please select a room"),
  subject: Yup.string().required("Subject is required").min(5, "Subject too short"),
  description: Yup.string().required("Description is required").min(10, "Description too short"),
  complaint_type: Yup.string().required("Complaint type is required"),
  priority: Yup.string().required("Priority is required"),
});

export default function ComplaintForm({ rooms, onSuccess, uid, editingComplaint, onCancel }: ComplaintFormProps) {
  const formik = useFormik({
    initialValues: {
      room_id: editingComplaint?.room_id?._id || editingComplaint?.room_id || "",
      subject: editingComplaint?.subject || "",
      description: editingComplaint?.description || "",
      complaint_type: editingComplaint?.complaint_type || "maintenance",
      priority: editingComplaint?.priority || "high",
      image_url: editingComplaint?.image_url || "",
      image_id: editingComplaint?.image_public_id || "",
    },
    validationSchema: ComplaintSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          image_public_id: values.image_id, // Map image_id to image_public_id for API
        };
        
        const method = editingComplaint ? "PATCH" : "POST";
        const url = editingComplaint ? `${API.COMPLAINT.UPDATE}/${editingComplaint._id}` : API.COMPLAINT.CREATE;

        const res = await api_caller(method, url, payload);
        if (res.success) {
          toast.success(res?.message || `Complaint ${editingComplaint ? "updated" : "logged"} successfully!`);
          formik.resetForm();
          onSuccess();
        } else {
          toast.error(res?.message || "Action failed");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-normal font-display text-gray-900 tracking-tight">
          {editingComplaint ? "Update" : "Log a"} <span className="italic-serif text-primary-600">Complaint</span>
        </h3>
        <p className="text-xs text-gray-400 font-jakarta">{editingComplaint ? "Modify the details of your complaint." : "Report any issues with your room or facilities."}</p>
      </div>

      <div className="space-y-4">
        {/* Room Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Select Room</label>
          <Select
            options={rooms}
            name="room_id"
            value={rooms.find(opt => opt.value === formik.values.room_id)}
            onChange={(opt) => formik.setFieldValue("room_id", opt?.value)}
            placeholder="Choose your room..."
            className="font-jakarta text-sm"
            styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: "1rem",
                  padding: "4px",
                  borderColor: formik.touched.room_id && formik.errors.room_id ? "#fecaca" : "#f3f4f6",
                  boxShadow: state.isFocused ? "0 0 0 4px rgba(217, 144, 0, 0.05)" : "none",
                  "&:hover": { borderColor: "#e5e7eb" }
                })
            }}
          />
          {formik.touched.room_id && formik.errors.room_id && (
            <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.room_id as string}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="e.g., Leaking Pipe in Bathroom"
            className={`w-full px-5 py-3 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${
              formik.touched.subject && formik.errors.subject
                ? "border-red-200 focus:ring-red-50"
                : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
            }`}
            {...formik.getFieldProps("subject")}
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.subject as string}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe the issue in detail..."
            className={`w-full px-5 py-3 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${
              formik.touched.description && formik.errors.description
                ? "border-red-200 focus:ring-red-50"
                : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
            }`}
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.description as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complaint Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Type</label>
            <Select
              options={complaintTypeOptions}
              name="complaint_type"
              value={complaintTypeOptions.find(opt => opt.value === formik.values.complaint_type)}
              onChange={(opt) => formik.setFieldValue("complaint_type", opt?.value)}
              styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: "1rem",
                    padding: "4px",
                    borderColor: "#f3f4f6",
                    "&:hover": { borderColor: "#e5e7eb" }
                  })
              }}
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Priority</label>
            <Select
              options={priorityOptions}
              name="priority"
              value={priorityOptions.find(opt => opt.value === formik.values.priority)}
              onChange={(opt) => formik.setFieldValue("priority", opt?.value)}
              styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: "1rem",
                    padding: "4px",
                    borderColor: "#f3f4f6",
                    "&:hover": { borderColor: "#e5e7eb" }
                  })
              }}
            />
          </div>
        </div>

        {/* Image Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Attachment (Optional)</label>
          <ImagePicker
            imageKey="image_url"
            single={true}
            setFieldValue={formik.setFieldValue}
            values={formik.values}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FloppyDisk size={18} weight="bold" />
          <span>{formik.isSubmitting ? (editingComplaint ? "Updating..." : "Logging...") : (editingComplaint ? "Update Complaint" : "Submit Complaint")}</span>
        </button>

        {editingComplaint && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-gray-200 transition-all duration-300"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
