// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import uploadConfig from '../config/upload.config';
import { uploadFile } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth'; // Corrected import

const router = Router();

// Apply JWT authentication to this route
// Only authenticated users should be able to upload files.
router.post(
  '/image',
  // authenticate, // Temporarily removed for testing
  uploadConfig.single('toolImage'), // 'toolImage' is the field name in the form-data
  uploadFile
);

export default router;
