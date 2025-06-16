# Тестовое задание **React Developer (Next.js)**

## Демо-версия проекта доступна по ссылке:

[Посмотреть демо-версию](https://o-complex-pi.vercel.app)

---

## Подробности реализации

- В проекте использован **Next.js v15** совместно с **TypeScript**.
- Структура проекта построена с использованием подхода **Feature Slice Design (FSD)**.
- Для стилизации компонентов применяются **SCSS-модули**.
- Для адаптации под планшеты и мобильные устройства использован один **breakpoint** на ширине 992 пикселей с применением отзывчивой верстки.
- Во избежание переполнения текста компонентами предусмотрены защитные механизмы на уровне CSS.
- Все внешние изображения загружаются через специально настроенный API, выполняющий оптимизацию изображений и смену их размеров. Обработанные изображения кэшируются для последующего использования.
- Подгрузка товаров на страницу осуществляется порциями по 6 штук с использованием механизма бесконечной прокрутки (**Infinite Scroll**). Процесс подгрузки обозначен специальным индикатором («loder»).
- Блок с отзывами реализован с использованием серверного рендеринга: с внешнего источника случайным образом выбираются 2 отзыва для отображения на странице.
- Блок корзины рендерится на стороне клиента после восстановления состояния корзины из **localStorage**.
- Для плавной анимации перехода блоков используется библиотека **GSAP**.
- Валидация поля ввода телефона реализована с помощью компонента **`react-imask`**.
- Отправка формы блокируется, если телефон не введен полностью.
- Результат отправки выводится (успех / ошибка) модальным окном.
- После закрытия модального окна форма автоматически очищается.

### Отказоустойчивость и безопасность

- Обработка контента с защитой от **XSS-атак**. Серверный компонент очищает поступающие данные, обеспечивая формирование безопасной карточки отзыва.

<br>
<br>
<br>

# API Service: Универсальный сервис для обработки HTTP-запросов

## Назначение сервиса
Сервис предоставляет расширенную обработку HTTP-запросов с поддержкой:
- Очереди запросов с приоритизацией
- Автоматических повторов с экспоненциальной задержкой
- Таймаутов запросов
- Интеграции с Sentry (опционально)
- Детального логирования
- Строгой типизации TypeScript

## Установка и настройка

### 1. Копирование файлов
Добавьте в проект следующие файлы:

```
src/
├── features/
│ └── services/
│ └── api-service/
| | └── lib/
│ | ├── error-handler.ts
| │ ├── errors.ts
│ | ├── index.ts
│ | ├── logger.ts
│ | ├── request-executor.ts
│ | └── request-scheduler.ts
│ ├── core.ts
│ └── index.ts
├── shared/
│ └── config/
│ └── api.ts
└── app/
└── utils/
  └── api-handler.ts
```

### 2. Установка зависимостей
Установите необходимые зависимости:
```bush
npm install zod
```

### 3. Конфигурация
Обновите файл конфигурации `src/shared/config/api.ts` с вашими настройками API.
```typescript
// Базовые URL
export const API_URL = 'https://your-production-api.com';
export const LOCAL_URL = process.env.NODE_ENV === "production"
  ? 'https://your-production-domain.com/api'
  : 'http://localhost:3000/api';

// Настройки сервиса
export const API_TIMEOUT = 8000; // 8 секунд
export const MAX_RETRIES = 3;    // Максимум 3
```

## Использование сервиса

### В Redux слайсах
Импортируйте сервис и используйте метод `request()` вместо прямых вызовов fetch.
```typescript
import { apiService } from '@/features/services/api-service';
import { LOCAL_URL } from '@/shared/config';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      return await apiService.request(
        `${LOCAL_URL}/products?page=${page}&page_size=${pageSize}`
      );
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);
```

### В API роутах Next.js
Используйте утилиты обработки из `api-handler.ts` для единообразной обработки запросов.
```typescript
import { processGetApiRequest } from '@/app/utils';
import { apiService } from '@/features/services/api-service';
import { API_URL } from '@/shared/config';

async function fetchProducts(params) {
  return apiService.request(
    `${API_URL}/products?page=${params.page}&page_size=${params.page_size}`
  );
}

export async function GET(request) {
  return processGetApiRequest(request, fetchProducts);
}
```

### Специальные параметры
```typescript
// Высокий приоритет для критически важных запросов
apiService.request('/api/order', { method: 'POST' }, 10);

// Низкий приоритет для фоновых задач
apiService.request('/api/analytics', {}, -5);
```

## Настройка Sentry
Для активации мониторинга ошибок:
1. Установите пакет Sentry
```bash
npm install @sentry/nextjs
```
2. Добавьте DSN в .env.local
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```
3. Настройте конфигурационные файлы Sentry `sentry.client.config.js` и `sentry.server.config.js`:
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

4. Обновите next.config.js

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    silent: true,
    org: "your-org-id",
    project: "your-project-id",
  }
);
```

## Особенности работы
- Серверные ошибки (5xx) автоматически повторяются
- Клиентские ошибки (4xx) возвращаются сразу
- Логирование только в development-режиме
- Ограничение параллельных запросов

## Совместимость
- Next.js 15.3.3+
- Node.js 14.x+
- Современные браузеры