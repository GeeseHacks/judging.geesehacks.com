import { z } from 'zod';

// Define login key validation schema
const loginKeySchema = z.string().min(3, { message: 'Login key must be at least 6 characters long' }).max(20, { message: 'Login key must not exceed 20 characters' });

// Function to validate login key
export function validateLoginKey(loginKey: string): string {
  try {
    loginKeySchema.parse(loginKey);
    return ""; // Return empty string if valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(e => e.message).join(', ');
    } else {
      console.error('An unknown error occurred during login key validation');
      return 'An unknown error occurred during login key validation';
    }
  }
}
