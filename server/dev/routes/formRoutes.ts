import express from "express";
import multer from "multer";


import citiesStatesCont from "../controllers/citiesStatesCont";
import uploadCont from "../controllers/uploadCont";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/fetch/fetchCity
router.get("/fetchStates", citiesStatesCont.fetchStates);
router.get("/fetchCity", citiesStatesCont.fetchCity);
router.post("/single-upload", upload.single("image"), uploadCont.uploadImage);
router.get("/upload", uploadCont.getUploadedImage);


export const fetch = router;
