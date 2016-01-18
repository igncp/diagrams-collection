export default (text, description) => {
  const descriptionText = (description ? `<br>${description}` : '')

  return `<strong>${text}</strong>${descriptionText}`
}
