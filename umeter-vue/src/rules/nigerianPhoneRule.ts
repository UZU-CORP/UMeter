export default (value: string) => /(^\+234(8|7|9){1}[0-9]{9}$)|(^0(8|7|9){1}[0-9]{9}$)/.test(value) || 'Invalid phone number'
