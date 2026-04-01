import { useState } from 'react'
import { BarChart3, ArrowRight } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SetupViewProps {
  workspaceId: string
}

const NAME_MIN = 3
const NAME_MAX = 50
const DESC_MIN = 10
const DESC_MAX = 300

function CharCount({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  return (
    <span
      className={cn(
        'text-xs tabular-nums transition-colors duration-200',
        ratio === 0 && 'text-muted-foreground/50',
        ratio > 0 && ratio < 0.8 && 'text-muted-foreground',
        ratio >= 0.8 && ratio < 1 && 'text-chart-4',
        ratio >= 1 && 'text-destructive'
      )}
    >
      {current}/{max}
    </span>
  )
}

export function SetupView({ workspaceId }: SetupViewProps) {
  const { setupWorkspace, removeWorkspace } = useWorkspaceStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [touched, setTouched] = useState({ name: false, description: false })

  const nameError = touched.name
    ? !name.trim()
      ? 'El nombre es obligatorio.'
      : name.trim().length < NAME_MIN
        ? `El nombre debe tener al menos ${NAME_MIN} caracteres.`
        : name.trim().length > NAME_MAX
          ? `El nombre debe tener máximo ${NAME_MAX} caracteres.`
          : null
    : null

  const descError = touched.description
    ? !description.trim()
      ? 'La descripción es obligatoria.'
      : description.trim().length < DESC_MIN
        ? `La descripción debe tener al menos ${DESC_MIN} caracteres.`
        : description.trim().length > DESC_MAX
          ? `La descripción debe tener máximo ${DESC_MAX} caracteres.`
          : null
    : null

  const isValid =
    name.trim().length >= NAME_MIN &&
    name.trim().length <= NAME_MAX &&
    description.trim().length >= DESC_MIN &&
    description.trim().length <= DESC_MAX

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, description: true })
    if (!isValid) return
    setupWorkspace(workspaceId, name.trim(), description.trim())
  }

  const handleCancel = () => {
    removeWorkspace(workspaceId)
  }

  return (
    <div className="relative flex min-h-full items-center justify-center !p-6 overflow-hidden ">
      {/* Ambient background — matches welcome/prompt screens */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-chart-2/[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 w-full sm:max-w-md animate-scale-in flex flex-col gap-8">
        {/* Step indicator pill */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-4 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm !px-6 py-2 text-xs text-muted-foreground shadow-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">1</span>
              Configurar
            </span>
            <Separator orientation="vertical" className="h-3" />
            <span className="inline-flex items-center gap-1.5 opacity-40">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">2</span>
              Subir datos
            </span>
            <Separator orientation="vertical" className="h-3" />
            <span className="inline-flex items-center gap-1.5 opacity-40">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">3</span>
              Dashboard
            </span>
          </div>
        </div>

        <Card className="border-border/60 shadow-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Nuevo Workspace</CardTitle>
                <CardDescription>
                  Nombre y contexto para tu análisis de datos.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form id="setup-form" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 !p-4">
                {/* Name field */}
                <div className="flex flex-col gap-2" data-invalid={!!nameError || undefined}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ws-name">Nombre del workspace</Label>
                    <CharCount current={name.trim().length} max={NAME_MAX} />
                  </div>
                  <Input
                    id="ws-name"
                    placeholder="Ej: Ventas Q1 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? 'ws-name-error' : undefined}
                    autoComplete="off"
                    className='!px-2'
                  />
                  {nameError && (
                    <p id="ws-name-error" className="text-destructive text-sm" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Description field */}
                <div className="flex flex-col gap-2" data-invalid={!!descError || undefined}>
                  <Label htmlFor="ws-desc">Descripción</Label>
                  <div
                    className={cn(
                      'rounded-md border shadow-xs transition-[color,box-shadow] overflow-hidden',
                      'has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]',
                      descError
                        ? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
                        : 'border-input'
                    )}
                  >
                    <textarea
                      id="ws-desc"
                      placeholder="Describe brevemente los datos que vas a analizar y tu objetivo..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
                      onBlur={() => setTouched((t) => ({ ...t, description: true }))}
                      aria-invalid={!!descError}
                      aria-describedby={cn(
                        descError && 'ws-desc-error',
                        'ws-desc-hint'
                      ) || undefined}
                      rows={5}
                      className="!px-2 flex w-full resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                    />
                    <div className="flex items-center justify-end border-t border-input bg-muted/30 px-3 py-1.5">
                      <CharCount current={description.trim().length} max={DESC_MAX} />
                    </div>
                  </div>
                  <p id="ws-desc-hint" className="text-muted-foreground text-sm">
                    Incluye el tipo de datos, tu objetivo y qué métricas te interesan.
                  </p>
                  {descError && (
                    <p id="ws-desc-error" className="text-destructive text-sm" role="alert">
                      {descError}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-between gap-3 !p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className='!p-2'
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="setup-form"
              disabled={!isValid}
              className="group !p-2"
            >
              Crear Workspace
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
