export const formatDateTime = (payload: string) => {
  const dateTime = new Date(payload)
  const year = dateTime.getFullYear()
  const month = String(dateTime.getMonth() + 1).length === 1 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1
  const date = String(dateTime.getDate()).length === 1 ? `0${dateTime.getDate()}` : dateTime.getDate()
  const hour = String(dateTime.getHours()).length === 1 ? `0${dateTime.getHours()}` : dateTime.getHours()
  const minute = String(dateTime.getMinutes()).length === 1 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes()
  return `${year}/${month}/${date} ${hour}:${minute}`
}
