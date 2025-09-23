import * as Yup from "yup";

export const Only_PGValidationSchema = {
  initials: {
    pg_name: "",
    street_name: "",
    house_no: "",
    state: "",
    pincode: "",
    district: "",
    pg_type: "",
    wifi_available: "",
    wifi_speed: "",
    additional_wifi_charges: 0,
    charge_duration: "quarterly",
    food_available: "",
    rules: "",
    pg_images: [] as { pg_image_url: string; pg_image_id: string }[],
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
    pg_images: Yup.array().of(
      Yup.object().shape({
        pg_image_url: Yup.string().required("PG Image URL is required"),
        pg_image_id: Yup.string().required("Public ID is required"),
      })
    ),
  }),
};
