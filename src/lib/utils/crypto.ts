import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey(): string {
  const key = process.env.SESSION_ENCRYPT_KEY;
  if (!key) {
    throw new Error('SESSION_ENCRYPT_KEY not set');
  }
  return key;
}

export function encrypt(text: string): string {
  const key = Buffer.from(getKey(), 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return iv + authTag + encrypted data
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

export function decrypt(encryptedData: string): string {
  const key = Buffer.from(getKey(), 'hex');
  
  const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
  const authTag = Buffer.from(encryptedData.slice(IV_LENGTH * 2, IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2), 'hex');
  const encrypted = encryptedData.slice(IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function isEncrypted(data: string): boolean {
  // Check if the data looks like our encrypted format (hex string of sufficient length)
  return /^[a-f0-9]{64,}$/i.test(data);
}
