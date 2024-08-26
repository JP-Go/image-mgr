export const oneMBInBytes = 1024 * 1024;
const FIVE_MB_IN_BYTES = 5 * oneMBInBytes;
export const jwtSecret = process.env.JWT_SECRET || 'secret';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
export const maxFileSize = +process.env.MAX_FILE_SIZE_BYTES || FIVE_MB_IN_BYTES;
