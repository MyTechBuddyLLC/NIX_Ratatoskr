import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { AES } from '@stablelib/aes';
import { GCM } from '@stablelib/gcm';
import { deriveKey } from '@stablelib/pbkdf2';
import { SHA256 } from '@stablelib/sha256';
import { randomBytes } from '@stablelib/random';
import { fromString, toString } from 'uint8arrays';
import JSZip from 'jszip';

export type EncryptionAlgorithm = 'CHACHA20' | 'AES-256-GCM';

export const ALGO_HEADERS: Record<EncryptionAlgorithm, string> = {
  'CHACHA20': 'RATA-CHACHA:',
  'AES-256-GCM': 'RATA-AES-GCM:'
};

export async function createEncryptedPackage(
  sqliteBinary: Uint8Array,
  password: string,
  algorithm: EncryptionAlgorithm
): Promise<Uint8Array> {
  // 1. ZIP the binary
  const zip = new JSZip();
  zip.file("config.db", sqliteBinary);
  const zipBlob = await zip.generateAsync({ type: "uint8array" });

  // 2. Derive key
  const salt = randomBytes(16);
  const key = await deriveKey(SHA256, fromString(password, 'utf8'), salt, 100000, 32);

  let encryptedData: Uint8Array;
  const nonce = randomBytes(12); // Both ChaCha and GCM typically use 12-byte nonce here

  if (algorithm === 'CHACHA20') {
    const cipher = new ChaCha20Poly1305(key);
    encryptedData = cipher.seal(nonce, zipBlob);
  } else {
    const cipher = new GCM(new AES(key));
    encryptedData = cipher.seal(nonce, zipBlob);
  }

  // 3. Construct package: HEADER + SALT + NONCE + ENCRYPTED_DATA
  const headerStr = ALGO_HEADERS[algorithm];
  const header = fromString(headerStr, 'utf8');
  const result = new Uint8Array(header.length + salt.length + nonce.length + encryptedData.length);

  result.set(header, 0);
  result.set(salt, header.length);
  result.set(nonce, header.length + salt.length);
  result.set(encryptedData, header.length + salt.length + nonce.length);

  return result;
}

export async function decryptPackage(
  packageData: Uint8Array,
  password: string
): Promise<Uint8Array> {
  // 1. Identify algorithm by header
  // Try to read header (up to 32 bytes should be enough)
  const potentialHeaderData = packageData.slice(0, 32);
  const dataString = toString(potentialHeaderData, 'utf8');

  let algorithm: EncryptionAlgorithm | null = null;
  let headerLength = 0;

  for (const [algo, header] of Object.entries(ALGO_HEADERS)) {
    if (dataString.startsWith(header)) {
      algorithm = algo as EncryptionAlgorithm;
      headerLength = header.length;
      break;
    }
  }

  if (!algorithm) {
    throw new Error("Unknown encryption format or invalid file.");
  }

  // 2. Extract components
  const salt = packageData.slice(headerLength, headerLength + 16);
  const nonce = packageData.slice(headerLength + 16, headerLength + 16 + 12);
  const encryptedData = packageData.slice(headerLength + 16 + 12);

  // 3. Derive key
  const key = await deriveKey(SHA256, fromString(password, 'utf8'), salt, 100000, 32);

  // 4. Decrypt
  let decryptedZip: Uint8Array | null;
  if (algorithm === 'CHACHA20') {
    const cipher = new ChaCha20Poly1305(key);
    decryptedZip = cipher.open(nonce, encryptedData);
  } else {
    const cipher = new GCM(new AES(key));
    decryptedZip = cipher.open(nonce, encryptedData);
  }

  if (!decryptedZip) {
    throw new Error("Failed to decrypt. Check your password.");
  }

  // 5. Unzip
  const zip = await JSZip.loadAsync(decryptedZip);
  const sqliteFile = zip.file("config.db");
  if (!sqliteFile) {
    throw new Error("Invalid package content: config.db not found.");
  }

  return await sqliteFile.async("uint8array");
}
