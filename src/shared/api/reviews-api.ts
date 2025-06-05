import { Review } from '../types'

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:3000/api'}/reviews`, {
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return []
  }
}
