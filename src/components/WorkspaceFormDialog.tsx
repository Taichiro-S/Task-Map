import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import useStore from 'stores/workspaceStore'
import { NewWorkspace } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { workspaceSchema } from 'schema/workspaceSchema'
import { useForm } from 'react-hook-form'
import React, { FC, memo, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useMutateWorkspace } from 'hooks'
import router from 'next/router'

const FormDialog: FC<{ user: User | null | undefined }> = (props) => {
  const { user } = props
  const [open, setOpen] = useState(false)
  const { createWorkspaceMutation } = useMutateWorkspace()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewWorkspace>({
    mode: 'onChange',
    resolver: yupResolver(workspaceSchema),
  })

  const onSubmit = async (data: NewWorkspace) => {
    console.log('new workspace', data)
    if (!user || user === null) {
      router.push('/login')
      return
    }
    createWorkspaceMutation.mutate({ newWorkspace: data, user_id: user.id })
  }

  useEffect(() => {
    if (!user || user === null) {
      router.push('/login')
    }
  }, [user])

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        ワークスペースを追加
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>新規ワークスペース</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="ワークスペース名"
              type="text"
              fullWidth
              variant="outlined"
              {...register('title')}
              helperText={errors?.title?.message}
              error={!!errors?.title}
            />
            <TextField
              id="description"
              margin="dense"
              label="説明"
              multiline
              rows={3}
              fullWidth
              {...register('description')}
              helperText={errors?.description?.message}
              error={!!errors?.description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">作成</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default memo(FormDialog)
