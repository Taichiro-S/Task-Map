import * as yup from 'yup'

export const workspaceSchema = yup.object().shape({
  title: yup.string().max(25, '最大25文字です。').required('ワークスペース名は必須項目です。'),
  description: yup.string().max(100, '最大100文字です。'),
  public: yup.boolean(),
})
