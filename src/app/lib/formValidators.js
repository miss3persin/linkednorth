const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i
const NAME_REGEX = /^[\p{L}][\p{L}\s'’\-.]{1,80}$/u
const NUMBER_REGEX = /^\d+(?:\.\d+)?$/

const trimValue = (value) => (typeof value === 'string' ? value.trim() : '')

export function validateTextField(value, options = {}) {
  const { label = 'Field', minLength = 1, maxLength = 200 } = options
  const trimmed = trimValue(value)
  if (!trimmed) return `${label} is required.`
  if (trimmed.length < minLength) return `${label} must be at least ${minLength} characters.`
  if (trimmed.length > maxLength) return `${label} can have at most ${maxLength} characters.`
  return ''
}

export function validateName(value, label = 'Name') {
  const trimmed = trimValue(value)
  if (!trimmed) return `${label} is required.`
  if (trimmed.length < 2) return `${label} should contain at least 2 characters.`
  if (trimmed.length > 60) return `${label} can have at most 60 characters.`
  if (!NAME_REGEX.test(trimmed)) return `${label} has invalid characters.`
  return ''
}

export function validateEmail(value) {
  const trimmed = trimValue(value)
  if (!trimmed) return 'Email is required.'
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(value) {
  const trimmed = typeof value === 'string' ? value : ''
  if (!trimmed) return 'Password is required.'
  if (trimmed.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(trimmed)) return 'Use at least one uppercase letter.'
  if (!/[0-9]/.test(trimmed)) return 'Include at least one number.'
  if (!/[!@#$%^&*()\-_+=\[\]{}|;:,.<>/?]/.test(trimmed)) return 'Include at least one symbol (e.g. !@#$%).'
  return ''
}

export function validateCode(value) {
  const trimmed = trimValue(value)
  if (!trimmed) return 'Code is required.'
  if (!/^[0-9]{6}$/.test(trimmed)) return 'Enter a 6-digit verification code.'
  return ''
}

export function validateUrlOrEmail(value) {
  const trimmed = trimValue(value)
  if (!trimmed) return 'Application link or email is required.'
  if (EMAIL_REGEX.test(trimmed)) return ''
  if (!URL_REGEX.test(trimmed)) return 'Enter a valid URL or email address.'
  return ''
}

export function validateSalaryValue(label, value) {
  if (!value) return ''
  const trimmed = trimValue(value)
  if (!NUMBER_REGEX.test(trimmed)) return `${label} must be a number.`
  if (Number(trimmed) <= 0) return `${label} must be greater than zero.`
  return ''
}

export function validateSalaryRange(minValue, maxValue) {
  if (!minValue || !maxValue) return ''
  const minNum = Number(minValue)
  const maxNum = Number(maxValue)
  if (Number.isNaN(minNum) || Number.isNaN(maxNum)) return 'Salary range must use valid numbers.'
  if (minNum > maxNum) return 'Max salary must be greater than or equal to min salary.'
  return ''
}

export function validateDescription(value, minLength = 40) {
  const trimmed = trimValue(value)
  if (!trimmed) return 'Description is required.'
  if (trimmed.length < minLength) return `Description should be at least ${minLength} characters.`
  return ''
}

export function validateList(value, { label = 'Field', minItems = 1 } = {}) {
  if (!Array.isArray(value) || value.length < minItems) {
    return `${label} needs at least ${minItems} item${minItems === 1 ? '' : 's'}.`
  }
  return ''
}
