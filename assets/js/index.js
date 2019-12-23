document.querySelector('#form').addEventListener('input', onFilterForm)
document.querySelector('.reset-btn').addEventListener('click', onResetFilter)
renderItems()

function onFilterForm(event) {
  event.preventDefault()
  let input = document.querySelector('#form-input').value
  getItems().then(res => {
    let items = res.bonuses.filter(item => item.title.toLowerCase().includes(input.toLowerCase()))

    let cards = document.querySelector('#cards')
    cards.innerHTML = ''   
    items.forEach((item, index) => {

      let description = createDescription(item)
      let promo = createPromo(item)
      let bonus = createBonus(item)

      let elem = document.createElement('div')
      elem.setAttribute('class', 'card')
      elem.setAttribute('id', `id_${index}`)
      elem.appendChild(description)
      elem.appendChild(promo)
      elem.appendChild(bonus)

      return cards.appendChild(elem)
    })
  }).then(() => {
    document.querySelectorAll('.card-button-form').forEach(card => card.addEventListener('submit', () => getBonus(event, card)))
    document.querySelectorAll('.clipboard').forEach(item =>  item.addEventListener('click', () => copyToClipboard(item)))
  })
}

function getItems() {
  return fetch('/assets/json/data.json').then(res => res.json()).then(resp => {
    return resp
  })
}

function renderItems() {
  getItems().then(resp => {
    console.log('resp', resp)
    renderHeader(resp.header)
    let cards = document.querySelector('#cards')  
      
    resp.bonuses.forEach((item, index) => {

      let description = createDescription(item)
      let promo = createPromo(item)
      let bonus = createBonus(item)

      let elem = document.createElement('div')
      elem.setAttribute('class', 'card')
      elem.setAttribute('id', `id_${index}`)
      elem.appendChild(description)
      elem.appendChild(promo)
      elem.appendChild(bonus)

      return cards.appendChild(elem)
    })
  }).then(() => {
    document.querySelectorAll('.card-button-form').forEach(card => card.addEventListener('submit', () => getBonus(event, card)))
    document.querySelectorAll('.clipboard').forEach(item =>  item.addEventListener('click', () => copyToClipboard(item)))
  })
}

function createDescription(item) {
  let div = document.createElement('div')
  div.setAttribute('class', 'card-description')

  let pDesc = document.createElement('p')
  pDesc.setAttribute('class', 'description')
  pDesc.innerHTML = item.title

  let pTitle = document.createElement('p')
  pTitle.setAttribute('class', 'title-description')
  pTitle.innerHTML = item.description

  div.appendChild(pDesc)
  div.appendChild(pTitle)

  return div
}

function createPromo(item) {
  let mainDiv = document.createElement('div')
  mainDiv.setAttribute('class', 'card-promo')

  let p = document.createElement('p')
  p.innerHTML = 'Промокод'

  let div = document.createElement('div')
  div.setAttribute('class', 'promo-field')

  let input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('class', 'clipboard')
  input.setAttribute('value', item.promocode)

  let img = document.createElement('img')
  img.setAttribute('src', '/assets/img/copy.svg')

  div.appendChild(input)
  div.appendChild(img)

  mainDiv.appendChild(p)
  mainDiv.appendChild(div)

  return mainDiv
}

function createBonus(item) {
  let mainDiv = document.createElement('div')
  mainDiv.setAttribute('class', 'card-button')

  let form = document.createElement('form')
  form.setAttribute('class', 'card-button-form')

  let input = document.createElement('input')
  input.setAttribute('type', 'submit')
  input.setAttribute('class', 'card-button-form-btn')
  input.setAttribute('value', 'Получить бонус')

  let hidden = document.createElement('input')
  hidden.setAttribute('type', 'hidden')
  hidden.setAttribute('class', 'hidden')
  hidden.setAttribute('value', item.link)

  form.appendChild(input)
  form.appendChild(hidden)
  mainDiv.appendChild(form)

  return mainDiv
}

function getBonus(event, card) {
  event.preventDefault()
  let hidden = card.querySelector('.hidden').value
  window.open(hidden, '_blank')
}

function onResetFilter() {
  document.querySelector('.form-input').innerHTML = ''
  renderItems()
}

function copyToClipboard(item) {
  item.select()
  document.execCommand('copy')
  alert('Промокод был успешно скопирован')
}

function renderHeader(data) {
  document.querySelector('.balance').innerHTML = `${data.balance} ₽`
  document.querySelector('.pay').innerHTML = `${data.next_payout} ₽`
}