import * as Yup from "yup";

export const PGValidationSchema = {
  initials: {
    pg_name: "",
    street_name: "",
    house_no: "",
    state: "",
    pincode:"",
    district:"",
    deposit_duration: "",
    country: "",
    wifi: "",
    ac: "",
    food: "",
    rules: "",
    pg_image: null,
    rooms: [
      {
        room_type: "",
        room_rent: "",
        room_count: "",
        wifi: "",
        ac: "",
        food: "",
        image: null,
        preview: "",
      },
    ],
  },
  validation: Yup.object({
    pg_name: Yup.string().required("Required"),
    street_name: Yup.string().required("Required"),
    house_no: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    rent: Yup.number().required("Required"),
    deposit_duration: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    wifi: Yup.string().required("Required"),
    ac: Yup.string().required("Required"),
    food: Yup.string().required("Required"),
    rules: Yup.string().required("Required"),
  }),
};
