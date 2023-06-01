import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'

import useFlowStore from 'stores/workspaceStore'
import { NewWorkspace, WorkspaceData } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { workspaceSchema } from 'schema/workspaceSchema'
import { useForm } from 'react-hook-form'
import React, { FC, memo, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useMutateWorkspace } from 'hooks'
import router from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { successToast, errorToast } from 'utils/toast'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

type Props = {
  workspaceData?: WorkspaceData
  isDelete: boolean
  // user?: User | null
}

const FormDialog: FC<Props> = ({ workspaceData, isDelete }) => {
  const queryClient = useQueryClient()
  const user: User | undefined = queryClient.getQueryData(['sessionUser'])
  const [open, setOpen] = useState(false)
  const { createWorkspaceMutation, updateWorkspaceMutation, deleteWorkspaceMutation } = useMutateWorkspace()
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    reset({
      title: workspaceData ? workspaceData.title : '',
      description: workspaceData ? workspaceData.description : '',
      public: workspaceData ? workspaceData.public : false,
    })
  }

  let useFormSettings = {}

  if (isDelete) {
    useFormSettings = {
      mode: 'onSubmit',
    }
  } else {
    useFormSettings = {
      mode: 'onSubmit',
      resolver: yupResolver(workspaceSchema),
      defaultValues: {
        title: workspaceData ? workspaceData.title : '',
        description: workspaceData ? workspaceData.description : '',
        public: workspaceData ? workspaceData.public : false,
      },
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    reset,
    watch,
  } = useForm<NewWorkspace>(useFormSettings)
  const publicValue = watch('public')
  useEffect(() => {
    register('public')
  }, [register])

  const onSubmit = async (data: NewWorkspace) => {
    if (!user) {
      errorToast('ユーザがログアウトしました')
      router.push('/login')
      return
    }
    console.log(data)
    if (!workspaceData) {
      createWorkspaceMutation.mutate(
        { newWorkspace: data, user_id: user.id },
        {
          onSuccess: () => {
            successToast('ワークスペースを作成しました')
            handleClose()
          },
          onError: () => {
            errorToast('ワークスペースの作成に失敗しました')
            handleClose()
          },
        },
      )
    } else {
      if (isDelete) {
        deleteWorkspaceMutation.mutate(
          { id: workspaceData.id },
          {
            onSuccess: () => {
              successToast('ワークスペースを削除しました')
              handleClose()
            },
            onError: () => {
              errorToast('ワークスペースの削除に失敗しました')
              handleClose()
            },
          },
        )
      } else {
        updateWorkspaceMutation.mutate(
          { updatedWorkspace: data, id: workspaceData.id },
          {
            onSuccess: () => {
              successToast('ワークスペースを更新しました')
              handleClose()
            },
            onError: () => {
              errorToast('ワークスペースの更新に失敗しました')
              handleClose()
            },
          },
        )
      }
    }
  }

  return (
    <div>
      {!workspaceData && (
        <Button variant="outlined" onClick={handleClickOpen}>
          ワークスペースを追加
        </Button>
      )}
      {workspaceData && isDelete && (
        <IconButton aria-label="delete" onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      )}
      {workspaceData && !isDelete && (
        <IconButton aria-label="edit" onClick={handleClickOpen}>
          <EditIcon color="primary" />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {!workspaceData && '新規ワークスペース'}
            {workspaceData && isDelete && 'ワークスペースを削除'}
            {workspaceData && !isDelete && 'ワークスペースを編集'}
          </DialogTitle>
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
              helperText={touchedFields.title && errors?.title?.message}
              error={!!errors?.title}
              disabled={isDelete}
            />
            <TextField
              id="description"
              margin="dense"
              label="説明"
              multiline
              rows={3}
              fullWidth
              {...register('description')}
              helperText={touchedFields.title && errors?.description?.message}
              error={!!errors?.description}
              disabled={isDelete}
            />
            <div className="ml-4">
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('public')}
                    checked={publicValue}
                    onChange={(e) => setValue('public', e.target.checked)}
                    disabled={isDelete}
                  />
                }
                label="公開する"
              />
            </div>
            {isDelete && (
              <Alert severity="error">
                本当に削除してよろしいですか？
                <br />
                この操作は取り消せません
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">
              {!workspaceData && '作成'}
              {workspaceData && isDelete && '削除'}
              {workspaceData && !isDelete && '更新'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default memo(FormDialog)
