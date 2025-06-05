// backend/src/controllers/upload.controller.ts
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include 'file' property from Multer
interface RequestWithFile extends Request {
  file?: Express.Multer.File; // Multer adds this, make it optional as it might not always be present
}
import path from 'path';

export const uploadFile = (
  req: RequestWithFile,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Construct the URL or path to be stored in the database
  // For simplicity, we're returning a relative path from the 'uploads' directory.
  // In a real application, you might return a full URL if serving files statically,
  // or just the filename if you have a more complex serving setup.
  const relativeFilePath = path.join('tool-images', req.file.filename);

  // The imageUrl to be saved in the database would typically be something like:
  // `/uploads/tool-images/${req.file.filename}` if you serve the 'uploads' directory statically.
  // Or, if you serve 'tool-images' directly from 'uploads', it would be `/tool-images/${req.file.filename}`.
  // For now, we'll return the path relative to the 'uploads' directory.
  // The frontend or another service would prepend the base URL.

  return res.status(201).json({
    message: 'File uploaded successfully.',
    filePath: `/uploads/${relativeFilePath}`, // Path for client/DB
    filename: req.file.filename, // Actual filename on disk
  });
};
