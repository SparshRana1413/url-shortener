// src/services/user.service.ts
import db from '../config/db.js';
import bcrypt from 'bcrypt';// or argon2/whatever library you use

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export async function RegisterUser({ username, email, password }: CreateUserInput) {
  
  // hashing the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 2. Direct INSERT — don't SELECT first! 
  // Let Postgres's UNIQUE constraints throw an error if username/email exists.
  try {
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    );

    return result.rows[0];
  } catch (error: any) {
    // Check for PostgreSQL Unique Violation code (23505)
    if (error.code === '23505') {
      if (error.detail?.includes('username')) {
        throw new Error('USERNAME_TAKEN');
      }
      if (error.detail?.includes('email')) {
        throw new Error('EMAIL_TAKEN');
      }
    }
    throw error; // Re-throw any unexpected DB errors
  }
}