export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 
export const MAX_IMAGE_COUNT = 10;
export const VALID_IMAGE_FORMATS = ['image/png', 'image/jpeg'];
export const MAX_RETRY = 10;
export const RETRY_DELAY = 60000;
export const SQLPORT = 3306;
export const CONNECTIONLIMIT = 10;

export const SALT_ROUNDS = 10;

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };

export const STATUS_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
};



export const MESSAGES = {
    SUCCESS: {
      PRODUCT_CREATED: 'Product created successfully',
      CATEGORY_FETCHED: 'Categories fetched successfully',
      IMAGES_UPLOADED: 'Images uploaded successfully',
      PRODUCT_UPDATED: 'Product updated successfully',
      PRODUCT_DELETED: 'Product deleted successfully',
    },
  
    USER_ERROR: {
      NO_IMAGE_UPLOADED: 'No image files uploaded',
      INVALID_FIELDS: 'Missing or invalid fields',
      PRODUCT_EXISTS: 'Product with this serial number already exists',
      SUBCATEGORY_NOT_FOUND: 'SubCategory not found',
      IMAGE_SIZE_EXCEEDED: 'One or more files exceed the 5MB size limit',
      MAX_IMAGE_COUNT_EXCEEDED: 'You can upload a maximum of 10 images',
      INVALID_IMAGE_FORMAT: 'Only PNG and JPG formats are allowed',
      INVALID_INPUT_DATA: 'Invalid input data',
    },
  
    DB_ERROR: {
      FETCH_CATEGORIES_FAILED: 'Failed to fetch categories',
      PRODUCT_CREATION_FAILED: 'Error during product creation, please try again later',
      PRODUCT_UPDATE_FAILED: 'Error during product update',
      PRODUCT_DELETION_FAILED: 'Error during product deletion',
      IMAGE_UPLOAD_FAILED: 'Failed to upload images',
    },
  
    GENERAL_ERROR: {
      INTERNAL_SERVER_ERROR: 'Internal server error, please try again later',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'You do not have permission to perform this action',
      RESOURCE_NOT_FOUND: 'Requested resource not found',
    },
  };