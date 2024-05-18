import { uploadFile } from "@/lib/process";

export const handleFileUpload = async (file: File) => {
    // Trigger the Server Action here (assuming you have a server action defined)
    uploadFile(file); // Replace with your actual server action call

};
