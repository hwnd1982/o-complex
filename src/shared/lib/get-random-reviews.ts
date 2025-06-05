import { Review } from '@/shared/types'

export const getRandomReviews = (reviews: Review[], count: number): Review[] => {
  if (!reviews || reviews.length === 0) return []
  if (reviews.length <= count) return [...reviews]
  
  const reviewsCopy = [...reviews]
  
  for (let i = reviewsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reviewsCopy[i], reviewsCopy[j]] = [reviewsCopy[j], reviewsCopy[i]]
  }
  
  return reviewsCopy.slice(0, count)
}