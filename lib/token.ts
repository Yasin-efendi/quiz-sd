import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET!

export interface TokenPayload {
  meeting_slug: string
  student_name: string
  answers: number[]
  score: number
  total_questions: number
  attempt_id: string
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload
  } catch {
    return null
  }
}