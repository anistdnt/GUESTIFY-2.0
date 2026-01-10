import * as Yup from "yup";

export const sampleAgreementPayload = {
  owner_name: "Suresh Kumar",
  owner_guardian_name: "Late Ramesh Kumar",
  owner_address: "12B Lake Road, Kalighat, Kolkata, West Bengal 700026",

  tenant_name: "Arijit Das",
  tenant_guardian_name: "Subrata Das",
  tenant_address: "Village Purbapara, Nadia, West Bengal 741101",

  pg_name: "GreenNest PG",
  pg_full_address: "Flat 3C, Block A, Salt Lake Sector V, Kolkata, West Bengal 700091",

  agreement_city: "Kolkata",
  agreement_state: "West Bengal",
  agreement_date: "2025-01-10",

  room_details: "Single sharing furnished room with attached bathroom and balcony",
  common_areas: "Kitchen, dining area, washing machine area",

  start_date: "2025-02-01",
  end_date: "2026-01-31",
  duration: "11 months",

  lock_in_period: "3 months",
  notice_period: "30 days",
  visitor_hours: "10:00 AM to 8:00 PM",

  rent: 8500,
  rent_words: "Eight Thousand Five Hundred Only",
  rent_due_day: 5,

  deposit: 17000,
  deposit_words: "Seventeen Thousand Only",
  deposit_refund_days: 15,

  late_fee: "₹100 per day after due date",

  utilities_included: "Electricity, Water, Wi-Fi",
  utilities_excluded: "Food and personal laundry",
};


export const AgreementSchema = {
  initialValues: {
    owner_name: "",
    owner_guardian_name: "",
    owner_address: "",

    tenant_name: "",
    tenant_guardian_name: "",
    tenant_address: "",

    pg_name: "",
    pg_full_address: "",

    agreement_city: "",
    agreement_state: "",
    agreement_date: "",

    room_details: "",
    common_areas: "",

    start_date: "",
    end_date: "",
    duration: "",

    lock_in_period: "",
    notice_period: "",
    visitor_hours: "",

    rent: 0,
    rent_words: "",
    rent_due_day: 0,

    deposit: 0,
    deposit_words: "",
    deposit_refund_days: 0,

    late_fee: "",

    utilities_included: "",
    utilities_excluded: "",
  },

  validationSchema: Yup.object({
    /* ================= OWNER ================= */
    owner_name: Yup.string()
      .min(3, "Owner name must be at least 3 characters")
      .required("Owner name is required"),

    owner_guardian_name: Yup.string()
      .min(3, "Guardian name must be at least 3 characters")
      .optional(),

    owner_address: Yup.string()
      .min(10, "Owner address is too short")
      .required("Owner address is required"),

    /* ================= TENANT ================= */
    tenant_name: Yup.string()
      .min(3, "Tenant name must be at least 3 characters")
      .required("Tenant name is required"),

    tenant_guardian_name: Yup.string().optional(),

    tenant_address: Yup.string()
      .min(10, "Tenant address is too short")
      .required("Tenant address is required"),

    /* ================= PG ================= */
    pg_name: Yup.string().required("PG name is required"),

    pg_full_address: Yup.string()
      .min(10, "PG address is too short")
      .required("PG address is required"),

    /* ================= AGREEMENT ================= */
    agreement_city: Yup.string().required("Agreement city is required"),

    agreement_state: Yup.string().required("Agreement state is required"),

    agreement_date: Yup.date()
      .typeError("Invalid agreement date")
      .required("Agreement date is required"),

    /* ================= ROOM ================= */
    room_details: Yup.string()
      .min(5, "Room details are too short")
      .required("Room details are required"),

    common_areas: Yup.string().optional(),

    /* ================= STAY ================= */
    start_date: Yup.date()
      .typeError("Invalid start date")
      .required("Start date is required"),

    end_date: Yup.date()
      .typeError("Invalid end date")
      .min(Yup.ref("start_date"), "End date must be after start date")
      .required("End date is required"),

    duration: Yup.string().required("Duration is required"),

    lock_in_period: Yup.string().required("Lock-in period is required"),

    notice_period: Yup.string().required("Notice period is required"),

    visitor_hours: Yup.string().optional(),

    /* ================= FINANCIAL ================= */
    rent: Yup.number()
      .typeError("Rent must be a number")
      .positive("Rent must be positive")
      .min(500, "Rent seems too low")
      .required("Monthly rent is required"),

    rent_words: Yup.string().required("Rent in words is required"),

    rent_due_day: Yup.number()
      .typeError("Rent due day must be a number")
      .min(1, "Invalid day")
      .max(31, "Invalid day")
      .required("Rent due day is required"),

    deposit: Yup.number()
      .typeError("Deposit must be a number")
      .positive("Deposit must be positive")
      .required("Security deposit is required"),

    deposit_words: Yup.string().required("Deposit in words is required"),

    deposit_refund_days: Yup.number()
      .typeError("Refund days must be a number")
      .min(0, "Invalid refund days")
      .required("Deposit refund period is required"),

    late_fee: Yup.string().optional(),

    /* ================= UTILITIES ================= */
    utilities_included: Yup.string().optional(),
    utilities_excluded: Yup.string().optional(),
  }),
};
