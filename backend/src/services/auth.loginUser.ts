import db from '../config/db.js';
import bcrypt from 'bcrypt';

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginInput) {

    const result = await db.query(
    `SELECT id, username, email, password_hash, created_at 
     FROM users 
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at
  };
}