import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  limits: { fileSize: 1024 * 1024 },
  storage: storage,
  fileFilter(req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

export default upload;
