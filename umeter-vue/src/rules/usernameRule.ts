export default (value: string) => /^\s*[a-z,A-Z]{1}\w{4,}\s*$/.test(value) || 'Invalid username'
