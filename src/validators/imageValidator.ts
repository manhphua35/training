import { ResError } from '../utils/ResError';

export const validateImages = (files: Express.Multer.File[] | undefined) => {
  if (!files || files.length === 0) {
    throw new ResError(400, 'No image files uploaded');
  }
  if (files.some(file => file.size > 5 * 1024 * 1024)) {
    throw new ResError(400, 'One or more files exceed the 5MB size limit');
  }

  if (files.length > 10) {
    throw new ResError(400, 'You can upload a maximum of 10 images');
  }
};


