// src/lib/imageUtils.js

/**
 * Utility functions for handling image URLs
 */

// Base URL untuk images
const getBaseUrl = () => {
  // Coba ambil dari environment variables (Vite)
  if (import.meta.env.VITE_API_IMAGE_URL) {
    return import.meta.env.VITE_API_IMAGE_URL;
  }
  
  // Fallback ke localhost
  return 'http://localhost:4000';
};

/**
 * Generate full image URL from relative path
 * @param {string} imagePath - Relative path dari image (e.g., '/uploads/ship/image.jpg')
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/300x200?text=No+Image";
  }
  
  // Jika sudah full URL, return langsung
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = getBaseUrl();
  
  // Jika path dimulai dengan /uploads, gabungkan dengan base URL
  if (imagePath.startsWith('/uploads')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Default fallback
  return "https://via.placeholder.com/300x200?text=No+Image";
};

/**
 * Generate multiple image URLs from array of paths
 * @param {string[]} imagePaths - Array of relative image paths
 * @returns {string[]} Array of full image URLs
 */
export const getMultipleImageUrls = (imagePaths) => {
  if (!Array.isArray(imagePaths)) {
    return [];
  }
  
  return imagePaths.map(path => getImageUrl(path));
};

/**
 * Check if image exists and handle error
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} Whether image exists
 */
export const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    if (error) return false;
  }
};

/**
 * Get optimized image URL with size parameters (jika API mendukung)
 * @param {string} imagePath - Relative image path
 * @param {object} options - Optimization options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.quality - Image quality (low, medium, high)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imagePath, options = {}) => {
  const { width, height, quality = 'medium' } = options;
  
  let url = getImageUrl(imagePath);
  
  // Jika API mendukung image optimization via query params
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return url;
};

/**
 * Extract filename from image path
 * @param {string} imagePath - Full image path or URL
 * @returns {string} Filename
 */
export const getFilenameFromPath = (imagePath) => {
  if (!imagePath) return '';
  
  return imagePath.split('/').pop() || '';
};

/**
 * Validate image file (untuk upload)
 * @param {File} file - Image file to validate
 * @param {object} options - Validation options
 * @param {number} options.maxSize - Max file size in MB
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {object} Validation result { isValid: boolean, error: string }
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  } = options;
  
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File too large. Max size: ${maxSize}MB` 
    };
  }
  
  return { isValid: true, error: null };
};

export default {
  getImageUrl,
  getMultipleImageUrls,
  checkImageExists,
  getOptimizedImageUrl,
  getFilenameFromPath,
  validateImageFile
};