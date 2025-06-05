import { Container, SafeHtml } from '@/shared/ui'
import { Review } from '@/shared/types'
import classes from "./styles.module.scss";

interface ReviewListProps {
  serverReviews: Review[]
}

export function ReviewSection({ serverReviews }: ReviewListProps) {
  return (
    <section className={classes.section}>
      <Container className={classes.container}>
        {serverReviews.length > 0 ? (
          <div className={classes.grid}>
            {serverReviews.map(review => (
              <div 
                key={review.id} 
                className={classes.item}
              >
                <p className={classes.header}>
                  <span>Отзыв: {review.id}</span>
                  <span>Полученный с api</span>
                  <span>HTML</span>
                </p>
                <SafeHtml html={review.text} />
              </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">Нет доступных отзывов</p>
        )}
      </Container>
    </section>
  )
}