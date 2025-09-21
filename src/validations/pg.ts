import * as Yup from "yup";

export const PGValidationSchema = {
  initials: {
    pg_name: "",
    street_name: "",
    house_no: "",
    state: "West Bengal",
    pincode: "",
    district: "kolkata",
    pg_type: "",
    wifi_available: "no",
    wifi_speed: "",
    additional_wifi_charges: 0,
    charge_duration: "quarterly",
    food_available: "",
    rules: "",
    pg_image_url: null,
    // pg_images: [] as { pg_image_url: string; public_id: string }[],
    rooms: [
      {
        room_type: "single",
        room_rent: "",
        ac_available: "no",
        deposit_duration: "monthly",
        aminities: [],
        room_image_url: null,
        attached_bathroom: "yes",
      },
    ],

    contact_details: {
      country_code: "+91",
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
    pg_name: Yup.string().required("Please enter the PG name"),
    street_name: Yup.string().required("Please enter the street name"),
    house_no: Yup.string().required("Please enter the house number"),
    state: Yup.string().required("Please select the state"),
    pincode: Yup.string().required("Please enter the pincode"),
    district: Yup.string().required("Please enter the district"),
    pg_type: Yup.string().required("Please select the PG type"),
    wifi_available: Yup.string().required(
      "Please specify if Wi-Fi is available"
    ),
    wifi_speed: Yup.string().when("wifi_available", (wifi_available, schema) =>
      (wifi_available as unknown) === "yes"
        ? schema
            .matches(/^\d+$/, "Wi-Fi speed must be a number")
            .required("Please enter the Wi-Fi speed")
        : schema.notRequired()
    ),

    additional_wifi_charges: Yup.string().when(
      "wifi_available",
      (wifi_available, schema) =>
        (wifi_available as unknown) === "yes"
          ? schema
              .matches(/^\d+$/, "Wi-Fi charges must be a number")
              .required("Please enter additional Wi-Fi charges")
          : schema.notRequired()
    ),
    food_available: Yup.string().required(
      "Please specify if food is available"
    ),
    rules: Yup.string().required("Please enter the PG rules"),
    pg_image_url: Yup.mixed().nullable().required("PG Image is required"),
    // pg_images: Yup.array().of(
    //   Yup.object().shape({
    //     pg_image_url: Yup.string().required("PG Image URL is required"),
    //     public_id: Yup.string().required("Public ID is required"),
    //   })
    // ),
    rooms: Yup.array().of(
      Yup.object().shape({
        room_type: Yup.string().required("Please enter the room type"),
        room_rent: Yup.string().required("Please enter the room rent"),
        deposit_duration: Yup.string().required(
          "Please specify the deposit duration"
        ),
        ac_available: Yup.string().required(
          "Please specify if AC is available in the room"
        ),
        attached_bathroom: Yup.string().required(
          "Please specify if the room has an attached bathroom"
        ),
        room_image_url: Yup.mixed()
          .nullable()
          .required("Room Image is required"),
      })
    ),
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
