import { fetchReviews } from '@/shared/api';
import { PAGE_SIZE } from '@/shared/config';
import { getRandomReviews } from '@/shared/lib';
import { makeStore } from '@/shared/store';
import { fetchProducts } from '@/shared/store/slices';
import { Header, ReviewSection, ProductsSection } from '@/widgets';

export default async function Home() {
  const store = makeStore();
  const allReviews = await fetchReviews();
  const randomReviews = getRandomReviews(allReviews, 2);
  await store.dispatch(fetchProducts({ page: 1, pageSize: PAGE_SIZE }));
  
  return (
    <>
      <Header />
      <main>
        <ReviewSection serverReviews={randomReviews} />
        <ProductsSection preloadedState={store.getState()} />
      </main>
    </>
  )
}