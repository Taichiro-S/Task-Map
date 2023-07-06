const MAX_FILE_SIZE = 102400 //100KB

enum FileTypes {
  Image = 'image',
}

type Extensions = { [key in FileTypes]: string[] }

const validFileExtensions: Extensions = {
  [FileTypes.Image]: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
}

interface File {
  name: string
  size: number
}

export function isValidFileType(fileName: string | undefined, fileType: FileTypes): boolean {
  return (
    fileName !== undefined &&
    validFileExtensions[fileType].indexOf(fileName.split('.').pop() as string) > -1
  )
}
