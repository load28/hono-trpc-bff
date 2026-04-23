import type { CreateMemoInput, Memo, UpdateMemoInput } from '@memo/shared'

type StoredMemo = Memo & { ownerId: string }

const memos = new Map<string, StoredMemo>()

function toPublic({ ownerId: _ownerId, ...rest }: StoredMemo): Memo {
  return rest
}

function listOwned(ownerId: string): StoredMemo[] {
  return [...memos.values()]
    .filter((m) => m.ownerId === ownerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function isoDate(iso: string): string {
  return iso.slice(0, 10)
}

function dayLabel(ymd: string): string {
  const today = isoDate(new Date().toISOString())
  const yesterday = isoDate(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  if (ymd === today) return '오늘'
  if (ymd === yesterday) return '어제'
  return ymd
}

export type DashboardResult = {
  stats: { total: number; today: number; thisWeek: number }
  recentMemos: Memo[]
}

export type TimelineResult = {
  totalCount: number
  groups: Array<{
    date: string
    dayLabel: string
    memos: Memo[]
  }>
}

export type DetailResult = {
  memo: Memo
  neighbors: {
    prev: { id: string; title: string } | null
    next: { id: string; title: string } | null
  }
  related: Array<{ id: string; title: string; createdAt: string }>
}

export const memoStore = {
  getDashboard(ownerId: string): DashboardResult {
    const owned = listOwned(ownerId)
    const todayYmd = isoDate(new Date().toISOString())
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    let today = 0
    let thisWeek = 0
    for (const m of owned) {
      if (isoDate(m.createdAt) === todayYmd) today++
      if (new Date(m.createdAt).getTime() >= weekAgo) thisWeek++
    }
    return {
      stats: { total: owned.length, today, thisWeek },
      recentMemos: owned.slice(0, 5).map(toPublic),
    }
  },

  getTimeline(ownerId: string): TimelineResult {
    const owned = listOwned(ownerId)
    const groupMap = new Map<string, Memo[]>()
    for (const m of owned) {
      const d = isoDate(m.createdAt)
      const arr = groupMap.get(d) ?? []
      arr.push(toPublic(m))
      groupMap.set(d, arr)
    }
    const groups = [...groupMap.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, memos]) => ({
        date,
        dayLabel: dayLabel(date),
        memos,
      }))
    return { totalCount: owned.length, groups }
  },

  getDetail(id: string, ownerId: string): DetailResult | null {
    const owned = listOwned(ownerId)
    const index = owned.findIndex((m) => m.id === id)
    if (index === -1) return null
    const stored = owned[index]
    if (!stored) return null

    // owned is sorted DESC by createdAt → newer memos come first (lower index)
    const newerThan = owned[index - 1] ?? null // newer = next chronologically
    const olderThan = owned[index + 1] ?? null // older = previous chronologically

    const currentDay = isoDate(stored.createdAt)
    const related = owned
      .filter((m) => m.id !== id && isoDate(m.createdAt) === currentDay)
      .slice(0, 3)
      .map(({ id, title, createdAt }) => ({ id, title, createdAt }))

    return {
      memo: toPublic(stored),
      neighbors: {
        prev: olderThan ? { id: olderThan.id, title: olderThan.title } : null,
        next: newerThan ? { id: newerThan.id, title: newerThan.title } : null,
      },
      related,
    }
  },

  create(input: CreateMemoInput, ownerId: string): Memo {
    const now = new Date().toISOString()
    const memo: StoredMemo = {
      id: crypto.randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: now,
      updatedAt: now,
      ownerId,
    }
    memos.set(memo.id, memo)
    return toPublic(memo)
  },

  update(input: UpdateMemoInput, ownerId: string): Memo | null {
    const existing = memos.get(input.id)
    if (!existing || existing.ownerId !== ownerId) return null
    const updated: StoredMemo = {
      ...existing,
      title: input.title ?? existing.title,
      body: input.body ?? existing.body,
      updatedAt: new Date().toISOString(),
    }
    memos.set(input.id, updated)
    return toPublic(updated)
  },

  delete(id: string, ownerId: string): boolean {
    const existing = memos.get(id)
    if (!existing || existing.ownerId !== ownerId) return false
    return memos.delete(id)
  },
}
