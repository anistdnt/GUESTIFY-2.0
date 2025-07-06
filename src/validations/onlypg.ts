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
    food_available: "",
    rules: "",
    pg_image_url: null,
  },
  validation: Yup.object({
    pg_name: Yup.string()
      .required("Please enter the PG name"),
    street_name: Yup.string()
      .required("Please enter the street name"),
    house_no: Yup.string()
      .required("Please enter the house number"),
    state: Yup.string()
      .required("Please select the state"),
    pincode: Yup.string()
      .required("Please enter the pincode"),
    district: Yup.string()
      .required("Please enter the district"),
    pg_type: Yup.string()
      .required("Please select the PG type"),
    wifi_available: Yup.string()
      .required("Please specify if Wi-Fi is available"),
    food_available: Yup.string()
      .required("Please specify if food is available"),
    rules: Yup.string()
      .required("Please enter the PG rules"),
    pg_image_url: Yup.mixed()
      .nullable().required("PG Image is required"),
  }),
};
