import { decode } from 'base64-arraybuffer';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';

// Supabase configuration - replace with your actual values
const SUPABASE_URL = "https://inouwxpbbzhdxtebzmpd.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub3V3eHBiYnpoZHh0ZWJ6bXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDc0OTksImV4cCI6MjA1MzMyMzQ5OX0.dVYqMebsnqyTDoUom6EbJfLDUxwlSXpEU6ARMi4ZTeY"
const STORAGE_BUCKET = 'resolutionproofs'; // Your bucket name

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Converts image URI to base64
 * @param {string} uri - Image URI
 * @returns {Promise<string>} - Base64 encoded image
 */
const uriToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Uploads an image to Supabase Storage
 * @param {Object} imageData - The image data object from ImagePicker
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImage = async (imageData) => {
  try {
    if (!imageData || !imageData.uri) {
      throw new Error('No image provided');
    }
    
    // Generate a unique file name
    const fileExt = imageData.uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Convert image to base64
    const base64 = await uriToBase64(imageData.uri);
    const arrayBuffer = decode(base64);
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
};