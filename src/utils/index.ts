export const encodePhoneNumber = (phone: string) => {
  return `${phone.slice(0, 3)}****${phone.slice(7)}`
}
