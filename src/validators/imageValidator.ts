import { ResError } from '../utils/ResError';
import { MAX_IMAGE_SIZE, MAX_IMAGE_COUNT, VALID_IMAGE_FORMATS } from '../config/constant';

export const validateImages = (files: Express.Multer.File[]) => {
  if (files.some(file => file.size > MAX_IMAGE_SIZE)) {
    throw new ResError(400, 'One or more files exceed the 5MB size limit');
  }

  if (files.length > MAX_IMAGE_COUNT) {
    throw new ResError(400, 'You can upload a maximum of 10 images');
  }

  if (files.some(file => !VALID_IMAGE_FORMATS.includes(file.mimetype))) {
    throw new ResError(400, 'Only PNG and JPG formats are allowed');
  }
};
