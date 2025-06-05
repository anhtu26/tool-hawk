// backend/src/utils/cache.ts
import cache from 'memory-cache';

const DEFAULT_TTL_SECONDS = 60 * 5; // Default cache time: 5 minutes

/**
 * Retrieves a value from the cache.
 * @param key The cache key.
 * @returns The cached value, or null if not found.
 */
export const getFromCache = <T>(key: string): T | null => {
  return cache.get(key) as T | null;
};

/**
 * Stores a value in the cache.
 * @param key The cache key.
 * @param value The value to store.
 * @param durationSeconds Optional. The time-to-live for this cache entry in seconds.
 *                        Defaults to DEFAULT_TTL_SECONDS.
 */
export const setToCache = <T>(
  key: string,
  value: T,
  durationSeconds: number = DEFAULT_TTL_SECONDS
): void => {
  cache.put(key, value, durationSeconds * 1000); // memory-cache expects duration in milliseconds
};

/**
 * Deletes a value from the cache.
 * @param key The cache key.
 */
export const deleteFromCache = (key: string): void => {
  cache.del(key);
};

/**
 * Clears the entire cache.
 */
export const clearCache = (): void => {
  cache.clear();
};
