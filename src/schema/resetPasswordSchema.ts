import * as yup from 'yup'

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    // .matches(/(?=.*[a-z])/, '小文字を含めてください。')
    // .matches(/(?=.*[A-Z])/, '大文字を含めてください。')
    // .matches(/(?=.*[0-9])/, '数字を含めてください。')
    .min(8, '最低８文字含めてください。')
    .required('パスワードは必須項目です。'),
})
