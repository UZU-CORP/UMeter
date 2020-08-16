export default (min = -Infinity, max = Infinity) => {
  const rule = (value: string) => {
    value = (value || '').toString()
    if (value.length < min) {
      return `This field should be at least ${min} characters long.`
    } else if (value.length > max) {
      return `This field should be at most ${max} characters long.`
    } else return true
  }
  return rule
}
