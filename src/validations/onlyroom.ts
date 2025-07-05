import * as Yup from "yup";

export const Only_RoomValidationSchema = {
  initials: {
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
