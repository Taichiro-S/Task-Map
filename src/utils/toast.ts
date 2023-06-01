import { toast, Slide } from 'react-toastify'

export const authToastSettings = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 3000,
  hideProgressBar: true,
  transition: Slide,
  isLoading: false,
}

export const successToast = (message: string, settings: any = authToastSettings) => {
  toast.success(message, settings)
}
export const errorToast = (message: string, settings: any = authToastSettings) => {
  toast.error(message, settings)
}
export const loadingToast = (message: string, toastId: string, settings: any = authToastSettings) => {
  toast.loading(message, { ...settings, isLoading: true, toastId: toastId })
}
export const updateWithSuccessToast = (message: string, toastId: string, settings: any = authToastSettings) => {
  toast.update(toastId, { ...settings, render: message, isLoading: false, type: toast.TYPE.SUCCESS })
}
export const updateWithErrorToast = (message: string, toastId: string, settings: any = authToastSettings) => {
  toast.update(toastId, { ...settings, render: message, isLoading: false, type: toast.TYPE.ERROR })
}
