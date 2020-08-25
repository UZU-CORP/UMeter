export default (value: string) => (value || '').length > 0 || value || 'This field is required'
