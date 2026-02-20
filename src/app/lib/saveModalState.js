export function buildSaveModalState(resData = {}, options = {}) {
  const {
    successTitle = 'Job Saved!',
    successMessage = 'This job has been saved to your profile library. You can find it in your Library.',
    alreadySavedTitle = 'Already Saved',
    alreadySavedMessage = 'This job is already in your library.',
    alreadyAppliedTitle = 'Already Applied',
    alreadyAppliedMessage = 'This job already lives in your Applied Jobs category on the Library page.',
  } = options

  const messageText = typeof resData?.message === 'string' ? resData.message.toLowerCase() : ''
  const alreadySaved = Boolean(
    resData?.alreadySaved ||
      messageText.includes('already saved') ||
      messageText.includes('already in your library')
  )
  const status = (typeof resData?.status === 'string' ? resData.status.toLowerCase().trim() : '')
  const isApplied = alreadySaved && status === 'applied'

  if (isApplied) {
    return {
      type: 'already_applied',
      title: alreadyAppliedTitle,
      message: alreadyAppliedMessage,
    }
  }

  if (alreadySaved) {
    return {
      type: 'already_saved',
      title: alreadySavedTitle,
      message: alreadySavedMessage,
    }
  }

  return {
    type: 'success',
    title: successTitle,
    message: successMessage,
  }
}
