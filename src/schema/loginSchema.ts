import * as yup from 'yup'

export const loginSchema = yup.object().shape({
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
  remember: yup.string(),
  /**
   * よくある他のバリデーションチェック例
   */
  // メールアドレス確認用の入力をチェックする用
  //checkEmail: yup
  // .string()
  // .lowercase()
  // .email('正しいメールアドレスを入力してください。')
  // .test('emails-match', '入力されたメールアドレスが一致しません。', function (value) {
  //   return value === this.parent.email;
  // })
  // .required('メールアドレス確認は必須項目です。'),

  // かな入力をチェックする用
  // nameKana: yup
  // .string()
  // .max(25, '最大25文字です。')
  // .test('katakana-checker', 'カタカナで入力して下さい。', function (value: any) {
  //   return !!value.match(/^[ァ-ヶー　]*$/);
  // })
  // .required('氏名（カナ）は必須項目です。'),
})
