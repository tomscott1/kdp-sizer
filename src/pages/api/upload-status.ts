// src/pages/api/uploadStatus.ts

import { NextApiRequest, NextApiResponse } from 'next';

let uploadStatus = {
  status: 'idle',
  progress: 0,
};

export const setStatus = (status: string, progress: number) => {
  uploadStatus = { status, progress };
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(uploadStatus);
};

export default handler;
