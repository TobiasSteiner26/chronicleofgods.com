// The town map: each pin is a plain link to its town's card (so the page works without script);
// with script, a pin opens a dialog with the land around the town and its card, and Previous / Next
// (or the arrow keys) step through the towns in the order they appear on the page.
const dialog = document.querySelector('.town-card')
const pins = [...document.querySelectorAll('.town-pin')]

if (dialog && pins.length && typeof dialog.showModal === 'function') {
  const nameEl = dialog.querySelector('#town-card-name')
  const kindEl = dialog.querySelector('.town-card-kind')
  const landEl = dialog.querySelector('.town-card-land')
  const cardEl = dialog.querySelector('.town-card-img')
  const sheetEl = dialog.querySelector('.town-card-sheet')
  const captionEl = dialog.querySelector('.town-card-caption')
  let current = -1

  const setImage = (img, src, size, alt) => {
    const [w, h] = (size || '').split('x').map(Number)
    img.width = w || 0
    img.height = h || 0
    img.alt = alt
    img.src = src
  }

  const show = (i) => {
    current = (i + pins.length) % pins.length
    const pin = pins[current]
    const name = pin.querySelector('.pin-name').textContent
    nameEl.textContent = name
    kindEl.textContent = pin.dataset.kind || ''
    captionEl.textContent = pin.dataset.caption || ''
    setImage(landEl, pin.dataset.land, pin.dataset.landSize, `The land around ${name}, close up.`)
    setImage(cardEl, pin.getAttribute('href'), pin.dataset.cardSize, pin.dataset.alt || '')
    sheetEl.scrollTop = 0
    for (const p of pins) p.removeAttribute('aria-current')
    pin.setAttribute('aria-current', 'true')
  }

  for (const [i, pin] of pins.entries()) {
    pin.setAttribute('aria-haspopup', 'dialog')
    pin.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return  // let "open in new tab" through
      e.preventDefault()
      show(i)
      dialog.showModal()
    })
  }

  for (const b of dialog.querySelectorAll('[data-step]')) {
    b.addEventListener('click', () => show(current + Number(b.dataset.step)))
  }

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1) }
  })

  // A click on the backdrop (outside the dialog box) closes it.
  dialog.addEventListener('click', (e) => {
    const r = dialog.getBoundingClientRect()
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    if (!inside) dialog.close()
  })

  // Return focus to the pin of the town last shown.
  dialog.addEventListener('close', () => { if (current >= 0) pins[current].focus() })
}
