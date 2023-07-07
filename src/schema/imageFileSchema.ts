import * as yup from 'yup'

const MAX_FILE_SIZE = 102400 //100KB

enum FileTypes {
  Image = 'image',
}

type Extensions = { [key in FileTypes]: string[] }

const validFileExtensions: Extensions = {
  [FileTypes.Image]: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
}

interface File {
  name: string
  size: number
}

function isValidFileType(fileName: string | undefined, fileType: FileTypes): boolean {
  return (
    fileName !== undefined &&
    validFileExtensions[fileType].indexOf(fileName.split('.').pop() as string) > -1
  )
}

export const imageFileSchema = yup.object().shape({
  image: yup
    .mixed<File>()
    .required('Required')
    .test('is-valid-type', 'Not a valid image type', (value: File | undefined) =>
      isValidFileType(value && value.name && value.name.toLowerCase(), FileTypes.Image),
    )
    .test(
      'is-valid-size',
      'Max allowed size is 100KB',
      (value: File | undefined) => value !== undefined && value.size <= MAX_FILE_SIZE,
    ),
})
