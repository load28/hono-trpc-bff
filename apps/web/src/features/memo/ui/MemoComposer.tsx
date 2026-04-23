import { Button, Stack, Textarea, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useCreateMemo } from '../mutations'

export function MemoComposer() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const createMemo = useCreateMemo()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || createMemo.isPending) return
    await createMemo.mutateAsync({ title, body })
    setTitle('')
    setBody('')
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="sm">
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          placeholder="제목"
        />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
          placeholder="본문"
          rows={3}
        />
        <Button type="submit" loading={createMemo.isPending} w="fit-content">
          추가
        </Button>
      </Stack>
    </form>
  )
}
