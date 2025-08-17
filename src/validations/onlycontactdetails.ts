import * as Yup from "yup";

export const OnlyContact_ValidationSchema = {
  initials: {
    contact_details: {
      country_code: "",
      phone_number: "",
      is_phone_verified: false,
      alt_country_code: "",
      alt_phone_number: "",
      whatsapp_code: "",
      whatsapp_number: "",
      same_as_phone: false,
      preferred_contact: "phone",
      email: "",
      is_email_verified: false,
    },
  },
  validation: Yup.object({
    
    contact_details: Yup.object({
      country_code: Yup.string()
        .nullable()
        .matches(/^\+?[0-9]{1,4}$/, "Invalid country code"),

      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),

      alt_country_code: Yup.string()
        .nullable()
        .matches(/^\+?[0-9]{1,4}$/, "Invalid alternate country code"),

      alt_phone_number: Yup.string()
        .nullable()
        .matches(
          /^[0-9]{10}$/,
          "Alternate phone number must be exactly 10 digits"
        ),

      whatsapp_code: Yup.string()
        .nullable()
        .matches(/^\+?[0-9]{1,4}$/, "Invalid WhatsApp country code"),

      whatsapp_number: Yup.string()
        .nullable()
        .matches(/^[0-9]{10}$/, "WhatsApp number must be exactly 10 digits"),

      same_as_phone: Yup.boolean(),

      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

      preferred_contact: Yup.string()
        .oneOf(["phone", "whatsapp", "email"], "Invalid contact method")
        .required("Preferred contact method is required"),
    }),
  }),
};
