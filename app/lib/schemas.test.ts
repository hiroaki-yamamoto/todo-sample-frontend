import { describe, it, expect } from 'bun:test';
import { TodoSchema, AuthSchema } from './schemas';

describe('Schemas', () => {
  describe('TodoSchema', () => {
    it('validates correct todo text', () => {
      const result = TodoSchema.safeParse({ text: 'Buy milk' });
      expect(result.success).toBe(true);
    });

    it('invalidates empty text', () => {
      const result = TodoSchema.safeParse({ text: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Todo text is required");
      }
    });

    it('invalidates whitespace only text', () => {
      const result = TodoSchema.safeParse({ text: '  ' });
      expect(result.success).toBe(false);
    });

    it('invalidates missing text property', () => {
      const result = TodoSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('AuthSchema', () => {
    it('validates correct login credentials', () => {
      const result = AuthSchema.safeParse({ name: 'testuser', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('invalidates empty name', () => {
      const result = AuthSchema.safeParse({ name: '', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required");
      }
    });

    it('invalidates whitespace only name', () => {
      const result = AuthSchema.safeParse({ name: '  ', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('invalidates empty password', () => {
      const result = AuthSchema.safeParse({ name: 'testuser', password: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });
});
