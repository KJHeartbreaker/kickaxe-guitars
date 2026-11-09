/** `tel:` link for a phone number typed any way ("403-410-9199", "(403) 410 9199"). */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
