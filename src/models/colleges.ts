import mongoose, { Schema } from "mongoose";

const CollegeSchema = new Schema(
  {
    college_name: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 5,
    },
    district: {
      type: String,
      required: true,
      minlength: 5,
    },
    pincode: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => /^\d{6}$/.test(value.toString()),
        message: "Pincode must be exactly 6 digits",
      },
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const College =
  mongoose.models.College || mongoose.model("College", CollegeSchema);
