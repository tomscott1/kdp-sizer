'use server';

import { writeFile } from "fs/promises";


const writeFileToServer = async (files) => {
    if (files && files.length > 0) {
    //   const formData = new FormData();
      files.forEach((file: any) => {
        // formData.append('files', file);
        const filePath = `/public/uploads/${file.name}`;
        writeFile(filePath, file)
        .then(() => {
        console.log(`File ${file.name} saved successfully`);
        })
        .catch((error: Error) => {
        console.error(`Error saving file ${file.name}:`, error);
        });
      });
    };  
  }

export default handleProcess;