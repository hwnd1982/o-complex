import { LOCAL_URL } from '../config'
import { Review } from '../types'

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${LOCAL_URL}/reviews`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
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
