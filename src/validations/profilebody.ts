import * as Yup from "yup";

export const ProfileValidationSchema = {
  initials: {},
  validation: Yup.object().shape({
    first_name: Yup.string().required("First name is required"),

    last_name: Yup.string().required("Last name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    gender: Yup.string()
      .oneOf(
        ["male", "female", "others"],
        "Gender must be male, female, or others"
      )
      .required("Gender is required"),

    district: Yup.string().required("District is required"),

    mother_tongue: Yup.string()
      .oneOf(
        ["hindi", "bengali", "english"],
        "Mother tongue must be Hindi, Bengali, or English"
      )
      .required("Mother tongue is required"),

    address: Yup.string().required("Address is required"),

    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),
  }),
};
