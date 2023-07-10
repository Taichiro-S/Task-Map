import { Layout, Spinner } from 'components'
import React, { useState } from 'react'
import { NextPage } from 'next'
import { useQueryAuth, useQueryUser, useMutateUser, useQueryAvatar } from 'hooks'
import Card from '@mui/material/Card'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import Button from '@mui/material/Button'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UpdatedUserData } from 'types/types'
import { userDataSchema, imageFileSchema, updatePasswordSchema } from 'schema'
import { errorToast, successToast } from 'utils/toast'
import Dialog from '@mui/material/Dialog'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Image from 'next/image'
import { MuiFileInput } from 'mui-file-input'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import UploadIcon from '@mui/icons-material/Upload'
import { MAX_FILE_SIZE, ALLOWED_MINE_TYPES } from 'constants/imageFile'
import uuid from 'uuid4'
import Avatar from '@mui/material/Avatar'
import { useRouter } from 'next/router'
const MuiFileInputStyled = styled(MuiFileInput)``
const CustomCard = styled(Card)`
  width: 330px;
  background-color: #fafafa;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 0.5rem;
`

const CustomTextField = styled(TextField)`
  width: 100%;
`

type UploadedFile = {
  file: File | null
}

type UpdatedPassword = {
  password: string
  newPassword: string
}

const MuiFileInputWithRef = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref}>
      <MuiFileInputStyled {...props} />
    </div>
  )
})
MuiFileInputWithRef.displayName = 'MuiFileInputWithRef'

function isValidImageFile(file: File | null): string {
  if (!file) return 'ファイルが選択されていません'
  if (!isValidMimeType(file, ALLOWED_MINE_TYPES))
    return 'ファイル形式は jpeg, png, svg にしてください'
  if (!isValidFileSize(file)) return 'ファイルサイズは100KB以下にしてください'

  return 'valid'
}

function isValidMimeType(file: File | null, mimeTypes: string[]): boolean {
  return file !== null && mimeTypes.includes(file.type)
}

function isValidFileSize(file: File | null): boolean {
  return file !== null && file.size <= MAX_FILE_SIZE
}

type UserInput = Omit<UpdatedUserData, 'auth_id' | 'user_id' | 'password' | 'avatar_url'>

const Account: NextPage = () => {
  const router = useRouter()
  const { data: authUser, error: authUserError, isLoading: authUserIsLoading } = useQueryAuth()
  const { data: user, error: userError, isLoading: userIsLoading } = useQueryUser()
  const [open, setOpen] = useState<boolean>(false)
  const [resetPasswordDisabled, setResetPasswordDisabled] = useState<boolean>(false)
  const [updatePasswordDisabled, setUpdatePasswordDisabled] = useState<boolean>(false)
  const [uploadImageDisabled, setUploadImageDisabled] = useState<boolean>(true)
  const [userUpdateDisabled, setUserUpdateDisabled] = useState<boolean>(false)
  const [fileUploadError, setFileUploadError] = useState<string | undefined>()
  const {
    updateUserMutation,
    deleteUserMutation,
    mailForResetPasswordMutation,
    updatePasswordMutation,
    uploadAvatarMutation,
  } = useMutateUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    mode: 'onSubmit',
    resolver: yupResolver(userDataSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<UpdatedPassword>({
    mode: 'onSubmit',
    resolver: yupResolver(updatePasswordSchema),
  })

  const onSubmitPassword = (data: UpdatedPassword) => {
    // console.log(data)
    setUpdatePasswordDisabled(true)
    updatePasswordMutation.mutate(data, {
      onSuccess: () => {
        successToast('パスワードを更新しました。')
        setUpdatePasswordDisabled(false)
        resetPassword()
      },
      onError: (error: Error) => {
        setUpdatePasswordDisabled(false)
        if (error.message === 'incorrect password') {
          errorToast('現在のパスワードが間違っています。')
        } else {
          errorToast('パスワードの更新に失敗しました。')
        }
      },
    })
  }

  const {
    control,
    handleSubmit: handleUploadImage,
    reset: resetImage,
  } = useForm<UploadedFile>({
    defaultValues: {
      file: null,
    },
  })

  const onUpload = (data: UploadedFile) => {
    setUploadImageDisabled(true)
    if (isValidImageFile(data.file) !== 'valid') {
      setFileUploadError(isValidImageFile(data.file))
      return
    }
    const filename = authUser!.id
    const uploadedFile = {
      avatar: data.file!,
      filename,
      userId: authUser!.id,
    }
    // console.log(data)
    uploadAvatarMutation.mutate(uploadedFile, {
      onSuccess: () => {
        successToast('画像をアップロードしました。')
        resetImage()
      },
      onError: (error: Error) => {
        errorToast('画像のアップロードに失敗しました。')
        resetImage()
      },
    })
  }

  const handleDeleteUser = async () => {
    deleteUserMutation.mutate(authUser!.id, {
      onSuccess: () => {
        setOpen(false)
        successToast('アカウントを削除しました。')
        return router.push('/')
      },
      onError: (error: Error) => {
        setOpen(false)
        errorToast('アカウントの削除に失敗しました。')
      },
    })
  }

  const handleResetPassword = async () => {
    mailForResetPasswordMutation.mutate(authUser!.email, {
      onSuccess: () => {
        successToast('パスワード再設定用のメールを送信しました。')
        setResetPasswordDisabled(false)
      },
      onError: (error: Error) => {
        errorToast('パスワード再設定用のメールの送信に失敗しました。')
        setResetPasswordDisabled(false)
      },
    })
  }

  const onSubmit = (userInput: UserInput) => {
    setUserUpdateDisabled(true)
    // console.log('submit', userInput)
    const updatedUserdata: UpdatedUserData = {
      auth_id: authUser!.id,
      user_id: user!.id,
      name: userInput.name,
      email: userInput.email,
    }

    updateUserMutation.mutate(updatedUserdata, {
      onSuccess: () => {
        successToast('ユーザー情報を更新しました。')
        setUserUpdateDisabled(false)
      },
      onError: (error: Error) => {
        errorToast('ユーザー情報の更新に失敗しました。')
        setUserUpdateDisabled(false)
      },
    })
  }
  const handleChangeFile = (file: File | null) => {
    // console.log(file)
    if (isValidImageFile(file) === 'valid') {
      setUploadImageDisabled(false)
      setFileUploadError(undefined)
    } else {
      setUploadImageDisabled(true)
      setFileUploadError(isValidImageFile(file) as string)
    }
  }

  if (authUserIsLoading || userIsLoading) {
    return (
      <Layout title="Account ">
        <Spinner />
      </Layout>
    )
  }
  if (authUserError || !authUser || userError || !user) {
    return (
      <Layout title="Account">
        <p>サーバとの接続でエラーが発生しました。</p>
      </Layout>
    )
  }
  console.log(user.avatar_url)
  return (
    <>
      <Layout title="Account">
        <h1 className="text-3xl font-semibold font-zenMaruGothic my-8 text-neutral-800">
          アカウント設定
        </h1>
        <div className="mx-2 my-4">
          <CustomCard>
            <h1 className="text-lg text-center font-semibold font-zenMaruGothic mb-4 text-neutral-800">
              アバター画像の変更
            </h1>
            <div className="mx-2 my-4 flex justify-center">
              <Avatar
                sx={{
                  width: '100px',
                  height: '100px',
                  background: 'transparent',
                  border: 4,
                  borderColor: 'grey.400',
                }}
              >
                <Image
                  src={user.avatar_url || '/static/default_avatar.png'}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </Avatar>
            </div>
            <div className="mx-2 my-4">
              <form onSubmit={handleUploadImage(onUpload)}>
                <div className="mr-2">
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <MuiFileInputWithRef
                        {...field}
                        variant="outlined"
                        ref={field.ref}
                        placeholder="not selected"
                        // hideSizeText={true}
                        // error={!!fileUploadError}
                        // helperText={}
                        onChange={(event: any) => {
                          field.onChange(event)
                          handleChangeFile(event)
                        }}
                      />
                    )}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">
                  SVG, PNG, JPG (MAX: 100KB)
                </p>
                <div className="mt-2 w-full">
                  <Button
                    type="submit"
                    variant="outlined"
                    style={{ width: '100%' }}
                    startIcon={<UploadIcon />}
                    disabled={uploadImageDisabled}
                  >
                    アップロード
                  </Button>
                  <div className="mt-4">
                    {fileUploadError && (
                      <Alert severity="error" variant="standard">
                        {fileUploadError}
                      </Alert>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </CustomCard>
        </div>
        <div className="mx-2 my-4">
          <CustomCard>
            <h1 className="text-lg text-center font-semibold font-zenMaruGothic mb-4 text-neutral-800">
              ユーザ情報の変更
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mx-2 my-4">
                <CustomTextField
                  id="name"
                  label="ユーザ名"
                  type="text"
                  defaultValue={user.name}
                  {...register('name')}
                  helperText={errors?.name?.message}
                  error={!!errors?.name}
                />
              </div>
              <div className="mx-2 my-4">
                <CustomTextField
                  id="email"
                  label="メールアドレス"
                  type="email"
                  defaultValue={authUser.email}
                  {...register('email')}
                  helperText={errors?.email?.message}
                  error={!!errors?.email}
                />
              </div>
              <div className="mx-2 my-4 flex justify-center">
                <Button
                  startIcon={<SaveAltIcon />}
                  variant="outlined"
                  type="submit"
                  color="primary"
                  style={{ width: '100%' }}
                  disabled={userUpdateDisabled}
                >
                  変更を保存する
                </Button>
              </div>
            </form>
          </CustomCard>
        </div>
        <div className="mx-2 my-4">
          <CustomCard>
            <h1 className="text-lg text-center font-semibold font-zenMaruGothic mb-4 text-neutral-800">
              パスワードの変更
            </h1>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="mx-2 my-4">
                <CustomTextField
                  id="password"
                  label="パスワード"
                  type="password"
                  {...registerPassword('password')}
                  helperText={errorsPassword?.password?.message}
                  error={!!errorsPassword?.password}
                />
              </div>
              <div className="mx-2 my-4">
                <CustomTextField
                  id="newPassword"
                  label="新パスワード"
                  type="password"
                  {...registerPassword('newPassword')}
                  helperText={errorsPassword?.newPassword?.message}
                  error={!!errorsPassword?.newPassword}
                />
              </div>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                startIcon={<SaveAltIcon />}
                style={{ width: '100%' }}
                disabled={updatePasswordDisabled}
              >
                パスワードを更新する
              </Button>
            </form>
          </CustomCard>
        </div>
        <div className="mx-2 my-4">
          <CustomCard>
            <h1 className="text-lg text-center font-semibold font-zenMaruGothic mb-4 text-neutral-800">
              パスワードリセット
            </h1>

            <Button
              variant="outlined"
              type="submit"
              color="primary"
              style={{ width: '100%' }}
              startIcon={<MailOutlineIcon />}
              onClick={() => {
                handleResetPassword()
                setResetPasswordDisabled(true)
              }}
              disabled={resetPasswordDisabled}
            >
              パスワードリセットのメールを送信
            </Button>
            <p className="text-xs text-center font-zenMaruGothic mt-4 text-neutral-600">
              登録されているメールアドレスにパスワードリセット用のメールが送信されます。
            </p>
          </CustomCard>
        </div>
        <div className="mx-2 my-4">
          <CustomCard>
            <Button
              startIcon={<ReportGmailerrorredIcon />}
              variant="outlined"
              onClick={() => setOpen(true)}
              color="error"
              style={{ width: '100%' }}
            >
              退会する
            </Button>
            <p className="text-xs text-center font-zenMaruGothic mt-4 text-neutral-600">
              退会すると登録したデータは全て削除されます。
            </p>
          </CustomCard>
        </div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Alert severity="error">
            <AlertTitle>退会処理を行います</AlertTitle>
            <strong>
              本当に退会してよろしいですか？
              <br />
              登録したデータはすべて削除され、復元することはできません。
            </strong>
            <div className="flex items-center justify-end mt-4">
              <div className="mr-4">
                <Button onClick={() => setOpen(false)} variant="outlined" size="small">
                  キャンセル
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleDeleteUser}
                  autoFocus
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  削除する
                </Button>
              </div>
            </div>
          </Alert>
        </Dialog>
      </Layout>
    </>
  )
}

export default Account
