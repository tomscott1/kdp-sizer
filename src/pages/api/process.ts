// src/pages/api/process.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }
    const file = files.file as formidable.File;
    const data = fs.readFileSync(file.filepath);
    // Here you can process the file or send it to your Python backend
    res.status(200).json({ message: 'File received successfully' });
  });
};

export default handler;
