import { PAGE_SIZE } from '@/shared/config';
import { getRandomReviews } from '@/shared/lib';
import { makeStore } from '@/shared/store';
import { fetchReviews } from '@/shared/api';
import { fetchProducts } from '@/shared/store/slices';
import { Header, ReviewSection, ProductsSection, CartSection } from '@/widgets';
import { StoreProvider } from '@/shared/store';

export const dynamic = 'auto';
export default async function Home() {
  const store = makeStore();
  const allReviews = await fetchReviews();
  const randomReviews = getRandomReviews(allReviews, 2);
  await store.dispatch(fetchProducts({ page: 1, pageSize: PAGE_SIZE }));
  
  const preloadedState = store.getState();

  return (
    <>
    <Header />
    <main>
      <ReviewSection serverReviews={randomReviews} />
      <StoreProvider preloadedState={preloadedState}>
        <CartSection />
        <ProductsSection />
      </StoreProvider>
    </main>
    </>
  );
}

// import { fetchReviews } from '@/shared/api';
// import { PAGE_SIZE } from '@/shared/config';
// import { getRandomReviews } from '@/shared/lib';
// import { makeStore } from '@/shared/store';
// import { fetchProducts } from '@/shared/store/slices';
// import { Header, ReviewSection, ProductsSection, CartSection } from '@/widgets';

// export const dynamic = 'auto';
// export default async function Home() {
//   const store = makeStore();
//   const allReviews = await fetchReviews();
//   const randomReviews = getRandomReviews(allReviews, 2);
//   await store.dispatch(fetchProducts({ page: 1, pageSize: PAGE_SIZE }));
  
//   return (
//     <>
//       <Header />
//       <main>
//         <ReviewSection serverReviews={randomReviews} />
//         <CartSection preloadedState={store.getState()} />
//         <ProductsSection preloadedState={store.getState()} />
//       </main>
//     </>
//   )
// }