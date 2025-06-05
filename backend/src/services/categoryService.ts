/**
 * Re-export of modularized Category Services
 * 
 * This file is kept for backward compatibility while the code is being refactored
 * Refer to the 'category' directory for the actual implementations
 */

export * from './category';
export { CategoryService as default } from './category';

// For consumer code that expects an instance rather than the class
const categoryServiceInstance = new (require('./category').CategoryService)();
export { categoryServiceInstance as CategoryService };
