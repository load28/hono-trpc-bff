import type { Memo } from '@memo/shared'
import { dayLabel, isoDate, isToday, isWithinLastDays } from '../../shared/date'
import { memoStore, type StoredMemo, stripOwner } from './store'

const RECENT_LIMIT = 5
const RELATED_LIMIT = 3
const WEEK_DAYS = 7

export type DashboardResult = {
  stats: { total: number; today: number; thisWeek: number }
  recentMemos: Memo[]
}

export type TimelineGroup = {
  date: string
  dayLabel: string
  memos: Memo[]
}

export type TimelineResult = {
  totalCount: number
  groups: TimelineGroup[]
}

export type DetailResult = {
  memo: Memo
  neighbors: {
    prev: { id: string; title: string } | null
    next: { id: string; title: string } | null
  }
  related: Array<{ id: string; title: string; createdAt: string }>
}

const byCreatedAtDesc = (a: StoredMemo, b: StoredMemo): number =>
  b.createdAt.localeCompare(a.createdAt)

const listOwnedSorted = (ownerId: string): StoredMemo[] =>
  memoStore
    .list()
    .filter((memo) => memo.ownerId === ownerId)
    .sort(byCreatedAtDesc)

const groupByDay = (memos: StoredMemo[]): TimelineGroup[] => {
  const grouped = memos.reduce<Map<string, Memo[]>>((acc, memo) => {
    const key = isoDate(memo.createdAt)
    const bucket = acc.get(key) ?? []
    bucket.push(stripOwner(memo))
    acc.set(key, bucket)
    return acc
  }, new Map())

  return [...grouped.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, dayLabel: dayLabel(date), memos: items }))
}

const toNeighbor = (memo: StoredMemo | undefined): { id: string; title: string } | null =>
  memo ? { id: memo.id, title: memo.title } : null

const toRelatedSummary = ({ id, title, createdAt }: StoredMemo) => ({ id, title, createdAt })

export const getDashboard = (ownerId: string): DashboardResult => {
  const owned = listOwnedSorted(ownerId)
  return {
    stats: {
      total: owned.length,
      today: owned.filter((memo) => isToday(memo.createdAt)).length,
      thisWeek: owned.filter((memo) => isWithinLastDays(memo.createdAt, WEEK_DAYS)).length,
    },
    recentMemos: owned.slice(0, RECENT_LIMIT).map(stripOwner),
  }
}

export const getTimeline = (ownerId: string): TimelineResult => {
  const owned = listOwnedSorted(ownerId)
  return {
    totalCount: owned.length,
    groups: groupByDay(owned),
  }
}

export const getDetail = (id: string, ownerId: string): DetailResult | null => {
  const owned = listOwnedSorted(ownerId)
  const index = owned.findIndex((memo) => memo.id === id)
  if (index === -1) return null
  const stored = owned[index]
  if (!stored) return null

  const newer = owned[index - 1]
  const older = owned[index + 1]
  const currentDay = isoDate(stored.createdAt)

  return {
    memo: stripOwner(stored),
    neighbors: {
      prev: toNeighbor(older),
      next: toNeighbor(newer),
    },
    related: owned
      .filter((memo) => memo.id !== id && isoDate(memo.createdAt) === currentDay)
      .slice(0, RELATED_LIMIT)
      .map(toRelatedSummary),
  }
}
