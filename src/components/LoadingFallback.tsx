import { Skeleton } from '@/components/ui/skeleton'

export function LoadingFallback() {
  return (
    <div
      className="flex h-screen w-full bg-background"
      role="status"
      aria-label="Cargando aplicación"
    >
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-72 shrink-0 flex-col gap-4 border-r border-border/50 p-4">
        <div className="flex items-center gap-2 px-2">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-3/4 rounded-md" />
        </div>
        <div className="mt-auto space-y-2">
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Content area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-12 w-12" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-sm font-medium text-foreground">Cargando aplicación...</p>
              <p className="text-xs text-muted-foreground">Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
