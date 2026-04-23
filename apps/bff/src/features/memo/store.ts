import type { CreateMemoInput, Memo, UpdateMemoInput } from '@memo/shared'

export type StoredMemo = Memo & { ownerId: string }

const memos = new Map<string, StoredMemo>()

const toPublic = ({ ownerId: _ownerId, ...rest }: StoredMemo): Memo => rest

export const memoStore = {
  list(): StoredMemo[] {
    return [...memos.values()]
  },

  insert(input: CreateMemoInput, ownerId: string): Memo {
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

  patch(input: UpdateMemoInput, ownerId: string): Memo | null {
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

  remove(id: string, ownerId: string): boolean {
    const existing = memos.get(id)
    if (!existing || existing.ownerId !== ownerId) return false
    return memos.delete(id)
  },
}

export const stripOwner = toPublic
