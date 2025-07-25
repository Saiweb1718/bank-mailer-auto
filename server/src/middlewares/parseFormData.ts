import multer from "multer";

export const parseData = () => {
    const upload = multer();
    return upload.none();
}