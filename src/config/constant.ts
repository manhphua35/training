/// Set maximum image upload size to 5MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

/// Limit maximum number of images to 10
export const MAX_IMAGE_COUNT = 10;

/// Restrict valid image formats to PNG and JPEG
export const VALID_IMAGE_FORMATS = ['image/png', 'image/jpeg'];

/// Set maximum retry attempts to 10
export const MAX_RETRY = 10;

/// Set retry delay to 60 seconds
export const RETRY_DELAY = 60000;

/// Define SQL port as 3306
export const SQLPORT = 3306;

/// Limit concurrent database connections to 10
export const CONNECTIONLIMIT = 10;

/// Set bcrypt salt rounds to 10
export const SALT_ROUNDS = 10;

/// Define HTTP status codes for API responses
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
