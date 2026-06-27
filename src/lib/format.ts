import { format, formatDistanceToNowStrict, isPast, parseISO } from 'date-fns'

function toDate(value: string | Date) {
  return typeof value === 'string' ? parseISO(value) : value
}

/** "31 August 2025" */
export function formatDate(value: string | Date, pattern = 'd MMMM yyyy') {
  return format(toDate(value), pattern)
}

/** "31 August 2025, 13:38" */
export function formatDateTime(value: string | Date) {
  return formatDate(value, 'd MMMM yyyy, HH:mm')
}

/** "Due in 3 days" / "Overdue by 2 days", relative to now. */
export function dueLabel(dueAt: string) {
  const date = parseISO(dueAt)
  const distance = formatDistanceToNowStrict(date)
  return isPast(date) ? `Overdue by ${distance}` : `Due in ${distance}`
}
