const convertNameToSearchTerm = input => {
  // Step 1: Remove diacritics (accent marks)
  const removeDiacritics = str => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  // Step 2: Convert to lowercase, remove whitespace and special characters
  const converted = removeDiacritics(input)
    .toLowerCase()
    .replace(/\s+/g, "") // Remove whitespace
    .replace(/[^a-z0-9]/g, "") // Keep only alphanumeric characters

  return converted
}

module.exports = {
  convertNameToSearchTerm,
}
