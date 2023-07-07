import * as yup from 'yup'

export const userDataSchema = yup.object().shape({
  email: yup
    .string()
    .lowercase()
    .email('正しいメールアドレスを入力してください。')
    .required('メールアドレスは必須項目です。'),
  // password: yup
  //   .string()
  //   .min(8, '最低８文字含めてください。')
  //   .required('パスワードは必須項目です。'),
  name: yup.string().max(25, '最大25文字です。').required('ユーザ名は必須項目です。'),
  avatar_url: yup.string().url('正しいURLを入力してください。'),
})
