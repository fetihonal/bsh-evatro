
export const getFormattedPrice = (price) => {
  var currency_symbol = ' TL'
  let formattedOutput = new Intl.NumberFormat('tr-TR', {
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (price) {
    if (typeof price == 'string') {
      return formattedOutput.format(price.replace('TL', '')) + currency_symbol
    } else if (typeof price == 'number') {
      return (
        formattedOutput.format(Math.floor(price).toString().replace('TL', '')) +
        currency_symbol
      )
    }
  } else {
    return '0 TL'
  }
}

export const getFormattedDate = (dateString) => {
  const date = Date.parse(dateString)

  let options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  if (date) {
    let formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(date)
    return formattedDate
  } else {
    return ''
  }
}



export const getFormattedPhoneNumber = (value, previousValue) => {
  if (!value) return value
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`
  }
}

export const getUnformattedPhoneNumber = (value) => {
  if (value === null || value === undefined) {
    return value
  } else {
    return value.replace(/\D/g, '')
  }
}
