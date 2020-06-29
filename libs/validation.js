module.exports.validSkillsForm = (age, concerts, cities, years) => {
  if (age === '') return 'Не указан возраст!'
  if (concerts === '') return 'Не указано количество концертов!'
  if (cities === '') return'Не указано количество городов!'
  if (years === '') return 'Не указано количество лет!'
}

module.exports.validPoductForm = (title, price, name, size) => {
  if (title === '') return 'Не указано название товара!'
  if (price === '') return 'Не указана цена товара!'
  if (name === '' || size === 0) return'Не добавлено фото товара!'
}