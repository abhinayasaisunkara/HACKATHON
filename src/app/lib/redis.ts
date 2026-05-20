// Mock Redis for testing (no actual Redis server needed)
export const redis = {
  ping: async () => 'PONG',
  publish: async (channel: string, message: string) => { console.log('Alert:', message); return 1; },
  lpush: async (key: string, value: string) => 1,
  ltrim: async (key: string, start: number, stop: number) => 'OK',
  get: async (key: string) => null,
  setex: async (key: string, ttl: number, value: string) => 'OK',
  multi: () => ({
    zremrangebyscore: () => ({ exec: async () => [null] }),
    zadd: () => ({ exec: async () => [null] }),
    zcard: () => ({ exec: async () => [null, 0] }),
    pexpire: () => ({ exec: async () => [null] }),
    exec: async () => [null]
  })
}

export async function checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000) {
  return { success: true, remaining: maxRequests - 1, resetTime: Date.now() + windowMs }
}

export async function publishAlert(alert: any) {
  console.log('Alert published:', alert)
}

export async function addRecentAlert(alert: any) {
  console.log('Alert added:', alert)
}