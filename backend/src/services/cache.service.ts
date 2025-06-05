/**
 * Simple in-memory cache service
 * For production, consider using Redis or another dedicated caching solution
 */
export class CacheService {
  private static cache: Map<string, { data: any; expiry: number }> = new Map();
  
  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds (default: 5 minutes)
   */
  static set(key: string, value: any, ttlSeconds: number = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiry });
  }
  
  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  static get(key: string): any {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist or has expired
    if (!item || item.expiry < Date.now()) {
      if (item) {
        // Clean up expired item
        this.cache.delete(key);
      }
      return null;
    }
    
    return item.data;
  }
  
  /**
   * Remove a value from the cache
   * @param key Cache key
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  static clear(): void {
    this.cache.clear();
  }
  
  /**
   * Remove all expired items from the cache
   */
  static cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Get or set cache value with a factory function
   * @param key Cache key
   * @param factory Function to generate value if not in cache
   * @param ttlSeconds Time to live in seconds
   * @returns Cached or newly generated value
   */
  static async getOrSet(
    key: string, 
    factory: () => Promise<any>, 
    ttlSeconds: number = 300
  ): Promise<any> {
    const cachedValue = this.get(key);
    
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    const freshValue = await factory();
    this.set(key, freshValue, ttlSeconds);
    return freshValue;
  }
}
