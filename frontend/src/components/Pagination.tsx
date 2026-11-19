import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from '@/components/icons'
import { cn } from '@/lib/utils'

type PaginationButtonProps = ComponentProps<typeof Button> & {
  isActive?: boolean
}

export function PaginationButton({ isActive, className, ...props }: PaginationButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        isActive && 'border-brand-base bg-brand-base text-white hover:bg-brand-base',
        className
      )}
      {...props}
    />
  )
}

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages < 1) return null

  return (
    <nav aria-label="Paginação" className={cn('flex items-center gap-2', className)}>
      <PaginationButton
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </PaginationButton>

      {getPageItems(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} aria-hidden className="w-8 text-center text-sm text-gray-500">
            …
          </span>
        ) : (
          <PaginationButton
            key={item}
            isActive={item === page}
            aria-label={`Página ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PaginationButton>
        )
      )}

      <PaginationButton
        aria-label="Próxima página"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </PaginationButton>
    </nav>
  )
}

function getPageItems(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const start = Math.max(2, Math.min(page - 1, totalPages - 4))
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5))
  const items: (number | 'gap')[] = [1]

  if (start > 2) items.push('gap')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < totalPages - 1) items.push('gap')
  items.push(totalPages)

  return items
}
