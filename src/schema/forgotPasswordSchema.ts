import * as yup from 'yup'

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .lowercase()
    .email('正しいメールアドレスを入力してください。')
    .required('メールアドレスは必須項目です。'),
})
