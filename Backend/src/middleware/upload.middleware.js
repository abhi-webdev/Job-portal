import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
    
});


const fileFilter = (req, file, cb) => {

    console.log("===== MULTER RECEIVED FILE =====");
    console.log("fieldname:", file.fieldname);
    console.log("originalname:", file.originalname);
    console.log("mimetype:", file.mimetype);

    const extension =
        path.extname(file.originalname).toLowerCase();

    console.log("extension:", extension);

    if (extension === ".pdf") {

        console.log("PDF ACCEPTED ✅");

        cb(null, true);

    } else {

        console.log("PDF REJECTED ❌");

        cb(new Error("Only PDF files are allowed"), false);
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;