/**
 * Environment variables configuration
 * Validates and exports typed environment variables
 */

export const env = {
  agentId: import.meta.env.VITE_AGENT_ID as string,
  agentAliasId: import.meta.env.VITE_AGENT_ALIAS_ID as string,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1',
} as const

/**
 * Validates required environment variables
 * @throws Error if required variables are missing
 */
export function validateEnv(): void {
  const missing: string[] = []

  if (!env.agentId) missing.push('VITE_AGENT_ID')
  if (!env.agentAliasId) missing.push('VITE_AGENT_ALIAS_ID')

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file.'
    )
  }
}
