import { QueryClient } from '@tanstack/react-query';

export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
};
