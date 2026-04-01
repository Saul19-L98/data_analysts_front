import { useTheme } from 'next-themes'

/**
 * Returns theme-aware chart styling values.
 * Fixes the hardcoded dark-mode-only colors that made charts unreadable in light mode.
 */
export function useChartTheme() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return {
    gridStroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    tickFill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    tooltipStyle: {
      backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
      borderRadius: '8px',
      color: isDark ? '#fff' : '#000',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
    },
    tooltipItemStyle: { color: isDark ? '#fff' : '#000' },
    tooltipLabelStyle: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' },
    legendColor: isDark ? '#fff' : '#000',
  }
}
