'use client';

import { useFavorites as useContextFavorites } from '@/context/favorites-context';

export function useFavorites() {
  return useContextFavorites();
}