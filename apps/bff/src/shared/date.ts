const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const isoDate = (iso: string): string => iso.slice(0, 10)

export const todayYmd = (): string => isoDate(new Date().toISOString())

export const yesterdayYmd = (): string => isoDate(new Date(Date.now() - ONE_DAY_MS).toISOString())

export const isToday = (iso: string): boolean => isoDate(iso) === todayYmd()

export const isWithinLastDays = (iso: string, days: number): boolean =>
  new Date(iso).getTime() >= Date.now() - days * ONE_DAY_MS

export const dayLabel = (ymd: string): string => {
  if (ymd === todayYmd()) return '오늘'
  if (ymd === yesterdayYmd()) return '어제'
  return ymd
}
