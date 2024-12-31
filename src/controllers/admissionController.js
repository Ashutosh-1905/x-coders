import createHttpError from "http-errors";
import { cloudinary } from "../config/cloudinary.js";
import Admission from "../models/admissionModel.js";

const createAdmission = async (req, res, next) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      academics,
      DOB,
      email,
      contact,
      marks,
      temporaryAddress,
      permanentAddress,
      sourceOfAdmission,
      refrence,
    } = req.body;

    if (
      !name ||
      !fatherName ||
      !motherName ||
      !academics ||
      !DOB ||
      !email ||
      !contact ||
      !marks ||
      !temporaryAddress ||
      !permanentAddress
    ) {
      return next(createHttpError(400, "All required fields must be filled."));
    }

    const existingAdmission = await Admission.findOne({ email });
    if (existingAdmission) {
      return next(createHttpError(400, "This student is already registered."));
    }

    // File uploaded to Cloudinary
    const uploadPhoto = req.file?.path;
    if (!uploadPhoto) {
      return next(createHttpError(400, "Upload photo is required."));
    }

    // Generate admission ID
    const admissionCount = await Admission.countDocuments();
    const admissionId = `XCA${String(admissionCount + 1).padStart(3, "0")}`;

    // Create Admission
    const admission = await Admission.create({
      admissionId,
      name,
      fatherName,
      motherName,
      academics,
      DOB,
      email,
      contact,
      marks,
      temporaryAddress,
      permanentAddress,
      sourceOfAdmission,
      refrence,
      uploadPhoto,
    });

    return res.status(201).json({
      message: "Admission created successfully.",
      success: true,
      admission,
    });
  } catch (error) {
    return next(createHttpError(500, "Server Error while creating admission."));
  }
};

export { createAdmission };
