import * as Yup from "yup";

export const PGValidationSchema = {
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
    rooms: [
      {
        room_type: "",
        room_rent: "",
        ac_available: "",
        deposit_duration: "",
        room_image_url: null,
        attached_bathroom: "",
      },
    ],
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
    rooms: Yup.array().of(
      Yup.object().shape({
        room_type: Yup.string()
          .required("Please enter the room type"),
        room_rent: Yup.string()
          .required("Please enter the room rent"),
        deposit_duration: Yup.string()
          .required("Please specify the deposit duration"),
        ac_available: Yup.string()
          .required("Please specify if AC is available in the room"),
        attached_bathroom: Yup.string()
          .required("Please specify if the room has an attached bathroom"),
        room_image_url: Yup.mixed()
          .nullable().required("Room Image is required"),
      })
    ),
  }),
};
