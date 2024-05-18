// src/pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { setStatus } from './upload-status';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    setStatus('uploading', 0);
    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });

    form.on('progress', (bytesReceived: any, bytesExpected: any) => {
      const progress = Math.floor((bytesReceived / bytesExpected) * 100);
      setStatus('uploading', progress);
    });

    form.parse(req, (err: Error, fields: any, files: any) => {
      if (err) {
        console.error('Error parsing the files:', err);
        setStatus('error', 0);
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      try {
        const uploadedFiles = files.files;
        if (Array.isArray(uploadedFiles)) {
          uploadedFiles.forEach((file) => {
            const oldPath = file.filepath;
            const newPath = path.join(uploadDir, file.originalFilename || file.newFilename);
            fs.renameSync(oldPath, newPath);
          });
        } else {
          const oldPath = uploadedFiles.filepath;
          const newPath = path.join(uploadDir, uploadedFiles.originalFilename || uploadedFiles.newFilename);
          fs.renameSync(oldPath, newPath);
        }

        setStatus('completed', 100);
        res.status(200).json({ message: 'Files uploaded successfully' });
      } catch (fileError) {
        console.error('Error handling uploaded files:', fileError);
        setStatus('error', 0);
        res.status(500).json({ error: 'Error handling uploaded files' });
      }
    });
  } catch (generalError) {
    console.error('General error:', generalError);
    setStatus('error', 0);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
