import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[]; // default ['image/jpeg', 'image/png', 'image/webp']
  compress?: boolean; // default true
  quality?: number; // default 0.8
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File, options: UploadOptions = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    } = options;

    if (file.size > maxSize) {
      throw new Error(`El archivo es demasiado grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
    }
  };

  const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = useCallback(async (
    file: File,
    path: string,
    options: UploadOptions = {}
  ): Promise<string> => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(null);

      const {
        compress = true,
        quality = 0.8,
        ...validationOptions
      } = options;

      // Validate file
      validateFile(file, validationOptions);

      // Compress if needed
      const fileToUpload = compress ? await compressImage(file, quality) : file;

      // Create storage reference
      const storageRef = ref(storage, path);

      // Upload file
      const uploadResult: UploadResult = await uploadBytes(storageRef, fileToUpload);

      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return downloadURL;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (
    files: File[],
    basePath: string,
    options: UploadOptions = {}
  ): Promise<string[]> => {
    try {
      setUploading(true);
      setError(null);

      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`;
        const fullPath = `${basePath}/${fileName}`;
        return uploadFile(file, fullPath, options);
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir archivos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [uploadFile]);

  const deleteFile = useCallback(async (url: string): Promise<void> => {
    try {
      setError(null);
      
      // Extract path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];
      const path = `images/${fileName}`;
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    uploading,
    uploadProgress,
    error,
    getFileSize,
  };
};
