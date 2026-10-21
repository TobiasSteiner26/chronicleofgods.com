// The enlarged view: a picture on the page (the globes, a plate, a looping video, the town map, a town's land
// or card) opens full size over the dark on a click, Enter or Space. A plate keeps its printed ink edge and
// the town map keeps its pins, which open their towns as on the page. Esc, the ✕ or a click elsewhere closes it.
// Without script the pictures simply stay as they are.
const box = document.querySelector('.lightbox')

if (box && typeof box.showModal === 'function') {
  const stage = box.querySelector('.lightbox-stage')
  const captionEl = box.querySelector('.lightbox-caption')
  const pins = [...document.querySelectorAll('.map-frame .town-pin')]
  let trigger = null

  // The widest file a srcset offers: the enlarged view is capped there, never stretched past it.
  const widest = (img) => Math.max(0, ...(img.srcset || '').split(',').map((s) => parseInt(s.trim().split(/\s+/)[1]) || 0))

  const sizeOf = (el) => el.tagName === 'VIDEO'
    ? [el.videoWidth || el.width, el.videoHeight || el.height]
    : [el.naturalWidth || el.width, el.naturalHeight || el.height]

  const open = (el) => {
    const [w, h] = sizeOf(el)
    if (!w || !h) return
    const unit = el.closest('.pic') || el
    const clone = unit.cloneNode(true)
    const media = unit === el ? clone : clone.querySelector(':scope > img, :scope > video')
    for (const a of ['tabindex', 'role', 'aria-haspopup', 'class', 'loading']) media.removeAttribute(a)

    if (media.tagName === 'IMG') {
      // A srcset picks its own file for the bigger box; a lone image (the globes) keeps the file the page chose.
      if (media.srcset) media.sizes = '100vw'
      else media.src = el.currentSrc || el.src
    } else {
      media.currentTime = el.currentTime
    }
    // The globes fade into the leather through a mask; the enlarged copy keeps it.
    const cs = getComputedStyle(el)
    if (cs.maskImage && cs.maskImage !== 'none') media.style.maskImage = cs.maskImage
    if (cs.webkitMaskImage && cs.webkitMaskImage !== 'none') media.style.webkitMaskImage = cs.webkitMaskImage

    // The town map's pins open their towns, as the pins on the page do.
    for (const [i, pin] of clone.querySelectorAll('.town-pin').entries()) {
      pin.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !pins[i]) return
        e.preventDefault()
        box.close()
        pins[i].click()
      })
    }

    clone.classList.add('lightbox-item')
    clone.style.setProperty('--ar', String(w / h))
    clone.style.setProperty('--nw', `${widest(el) || w}px`)
    stage.replaceChildren(clone)
    if (media.tagName === 'VIDEO' && media.autoplay) media.play().catch(() => {})
    const caption = el.closest('figure')?.querySelector('figcaption')?.textContent.trim() || ''
    captionEl.textContent = caption
    box.classList.toggle('has-caption', caption !== '')
    // A card is far taller than it is wide: it opens at full width and scrolls, rather than shrinking to fit.
    box.classList.toggle('is-tall', h > w * 1.4)
    trigger = el
    box.showModal()
    box.scrollTop = 0
  }

  // A looping video given controls (reduced motion) keeps its own click: it plays and pauses.
  const targets = [...document.querySelectorAll('.globes img, .plate .pic > img, .plate .pic > video, .town-card-land, .town-card-img')]
    .filter((el) => !(el.tagName === 'VIDEO' && el.controls))
  for (const el of targets) {
    el.tabIndex = 0
    el.setAttribute('role', 'button')
    el.setAttribute('aria-haspopup', 'dialog')
    el.classList.add('zoomable')
    el.addEventListener('click', () => open(el))
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el) }
    })
  }

  // A click anywhere but a pin closes it.
  box.addEventListener('click', (e) => { if (!e.target.closest('a, button')) box.close() })

  box.addEventListener('close', () => {
    stage.replaceChildren()
    trigger?.focus({ preventScroll: true })
  })
}
