import * as yup from 'yup'

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .lowercase()
    .email('正しいメールアドレスを入力してください。')
    .required('メールアドレスは必須項目です。'),
  password: yup
    .string()
    // .matches(/(?=.*[a-z])/, '小文字を含めてください。')
    // .matches(/(?=.*[A-Z])/, '大文字を含めてください。')
    // .matches(/(?=.*[0-9])/, '数字を含めてください。')
    .min(8, '最低８文字含めてください。')
    .required('パスワードは必須項目です。'),
  repassword: yup
    .string()
    .oneOf([yup.ref('password')], 'パスワードが一致しません。')
    .required('パスワードを再入力してください。'),
})
