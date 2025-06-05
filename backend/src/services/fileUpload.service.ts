import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Define allowed file types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface FileUploadResult {
  success: boolean;
  fileName?: string;
  filePath?: string;
  error?: string;
}

/**
 * Save file to disk
 * @param file Express file upload object
 * @param entityType Type of entity (tool, purchase_order, etc.)
 * @param entityId ID of the entity
 * @returns FileUploadResult
 */
export const saveFile = async (
  file: Express.Multer.File,
  entityType: string,
  entityId: string
): Promise<FileUploadResult> => {
  try {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Create entity directory if it doesn't exist
    const entityDir = path.join(UPLOAD_DIR, entityType, entityId);
    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(entityDir, uniqueFileName);
    const relativeFilePath = path.relative(UPLOAD_DIR, filePath);

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    return {
      success: true,
      fileName: uniqueFileName,
      filePath: relativeFilePath,
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Failed to upload file',
    };
  }
};

/**
 * Delete file from disk
 * @param filePath Path to file relative to upload directory
 * @returns boolean indicating success
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
};

/**
 * Get file path for serving
 * @param filePath Path to file relative to upload directory
 * @returns Full path to file
 */
export const getFilePath = (filePath: string): string => {
  return path.join(UPLOAD_DIR, filePath);
};
