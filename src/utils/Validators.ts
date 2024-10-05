
import { AppError } from './AppError';
import { MAX_IMAGE_SIZE, MAX_IMAGE_COUNT, VALID_IMAGE_FORMATS, MESSAGES } from '../config/constant';

export const validateImages = (files: Express.Multer.File[]) => {
  if (files.some(file => file.size > MAX_IMAGE_SIZE)) {
    throw new AppError(400, MESSAGES.USER_ERROR.IMAGE_SIZE_EXCEEDED);
  }

  if (files.length > MAX_IMAGE_COUNT) {
    throw new AppError(400, MESSAGES.USER_ERROR.MAX_IMAGE_COUNT_EXCEEDED);  
  }

  if (files.some(file => !VALID_IMAGE_FORMATS.includes(file.mimetype))) {
    throw new AppError(400, MESSAGES.USER_ERROR.INVALID_IMAGE_FORMAT); 
  }
};
