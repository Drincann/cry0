import crypto from 'crypto'

export interface Aes256GcmEncrypted {
  salt: string
  iv: string
  tag: string
  ciphertext: string
}

export async function aesEncrypt(
  content: string, passphrase: string,
): Promise<Aes256GcmEncrypted> {

  const iv = crypto.randomBytes(12)
  const salt = crypto.randomBytes(16)
  const key = await deriveKeyFromPassword(passphrase, salt)

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: authTag.toString('hex'),
    ciphertext: encrypted.toString('hex'),
  }
}

export async function aesDecrypt(
  encrypted: { salt: string; iv: string; tag: string, ciphertext: string },
  passphrase: string,
): Promise<string> {
  const iv = Buffer.from(encrypted.iv, 'hex')
  const salt = Buffer.from(encrypted.salt, 'hex')
  const key = await deriveKeyFromPassword(passphrase, salt)

  const ciphertext = Buffer.from(encrypted.ciphertext, 'hex')
  const authTag = Buffer.from(encrypted.tag, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return decrypted.toString('utf8')
}

export async function deriveKeyFromPassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const iterations = 100_000
    const keyLength = 32
    const digest = 'sha256'
    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(derivedKey)
    })
  })
}