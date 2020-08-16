export default (value: string) => {
  if ((value || '').length == 0) {
    return 'Email required!'
  } else if (!/^[a-zA-Z0-9]{3,}@[a-zA-Z0-9]{3,}\.[a-zA-Z0-9]{2,}$/.test(value || '')) {
    return 'invalid email'
  } else {
    return true
  }
}
