/**
 * Checks if chart data is a placeholder/metadata structure from the backend.
 */
export function isPlaceholderData(chartData: Record<string, unknown>[]): boolean {
  if (!chartData || chartData.length === 0) return true
  return chartData.length > 0 && 'note' in chartData[0] && chartData[0].note === 'Data structure placeholder'
}
