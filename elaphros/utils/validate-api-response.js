module.exports = function validateApiResponse(response) {
  if (!response || typeof response !== 'object' || 'errors' in response) {
    return false
  }
  return true
}
