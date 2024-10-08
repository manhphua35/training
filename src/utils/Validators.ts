
import { AppError } from './AppError';
import { MAX_IMAGE_SIZE, MAX_IMAGE_COUNT, VALID_IMAGE_FORMATS } from '../config/constant';

export const validateImages = (files: Express.Multer.File[]) => {
  if (files.some(file => file.size > MAX_IMAGE_SIZE)) {
    throw new AppError(400, 'Size ảnh tối đa 5MB');
  }

  if (files.length > MAX_IMAGE_COUNT) {
    throw new AppError(400, 'Không được quá 10 ảnh');  
  }

  if (files.some(file => !VALID_IMAGE_FORMATS.includes(file.mimetype))) {
    throw new AppError(400, 'Định dạng file không đúng'); 
  }
};
