/* global mkr, gsap, TextPlugin, ScrollToPlugin */
// A 300 × 250 banner ad built entirely in JavaScript with mkr 0.6.2: no HTML
// to write, no stylesheet. It runs in an iframe, the way ads are served, and
// colors come from the page's design tokens (CSS variables).
;(function () {
  // mkr was written for GSAP 2. GSAP 3 still answers to TweenMax and
  // TimelineMax; these lines cover the rest (GSAP 3 decides on 3D
  // transforms itself, so mkr's force3d default goes).
  gsap.registerPlugin(TextPlugin, ScrollToPlugin)
  delete mkr.defaults.force3d

  var ISI =
    '<p style="margin:0 0 6px"><strong>Important Safety Information</strong></p>' +
    '<p style="margin:0 0 6px">This is placeholder text for a demonstration. It describes no real product.</p>' +
    '<p style="margin:0 0 6px">Pharmaceutical banner ads carry safety information that must stay readable: a scrolling panel inside the ad, and the full text on request.</p>' +
    '<p style="margin:0 0 6px">mkr scrolls this panel at a steady speed in pixels per second, and can lay it out in full for a screen capture.</p>' +
    '<p style="margin:0">End of placeholder safety information.</p>'

  function build() {
    // A container 300 × 250, with a timeline built in.
    var ad = new mkr({
      tmln: { paused: true },
      css: {
        position: 'relative',
        width: 300,
        height: 250,
        overflow: 'hidden',
        background: 'var(--surface)',
        color: 'var(--fg)',
        border: '1px solid var(--border)',
        boxSizing: 'border-box',
      },
    })

    var headline = ad.create('div', {
      text: 'Your headline here',
      css: { x: 16, y: 18, fontSize: 22, fontWeight: 700, alpha: 0 },
    })
    var tagline = ad.create('div', {
      text: 'Sample brand, for demonstration only',
      css: { x: 16, y: 52, fontSize: 12, color: 'var(--fg-muted)', alpha: 0 },
    })
    var cta = ad.create('a', {
      attr: { href: '#' },
      text: 'Learn more',
      css: {
        x: 16,
        y: 84,
        padding: '6px 12px',
        borderRadius: 4,
        background: 'var(--accent)',
        color: 'var(--on-accent)',
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        alpha: 0,
      },
    })
    // Listeners keep their scope (js-signals underneath).
    mkr.on(cta, 'click', function (event) {
      event.preventDefault()
    })

    // The safety information: a scrolling panel along the bottom.
    var isi = ad.create('div', {
      attr: {
        tabindex: 0,
        role: 'region',
        'aria-label': 'Important Safety Information',
      },
      css: {
        x: 0,
        y: 128,
        width: 298,
        height: 120,
        overflowY: 'auto',
        padding: '8px 16px',
        boxSizing: 'border-box',
        borderTop: '1px solid var(--border)',
        fontSize: 11,
        lineHeight: 1.45,
      },
    })
    isi.innerHTML = ISI

    ad.tmln
      .to(headline, 0.6, { alpha: 1, y: 14 })
      .to(tagline, 0.4, { alpha: 1 }, '-=0.2')
      .to(cta, 0.4, { alpha: 1 }, '-=0.1')

    var scrolling = []
    return {
      play: function () {
        ad.tmln.play()
        // 14 px/s, starting from wherever the panel is now.
        scrolling = mkr.scroll(isi, 14, {
          delay: ad.tmln.progress() < 1 ? 1.5 : 0,
        })
      },
      pause: function () {
        ad.tmln.pause()
        scrolling.forEach(function (tween) {
          tween.kill()
        })
      },
      // Reduced motion: the finished frame, no scrolling.
      settle: function () {
        ad.tmln.progress(1)
      },
      // Screen-capture mode: the panel grows to show all of its text.
      reveal: function () {
        this.pause()
        mkr.reveal(isi, {}, { overflow: 'visible' })
        // mkr 0.6 adds the panel's offset from GSAP 2's _gsTransform, which
        // GSAP 3 no longer has, so finish the layout here.
        var bottom = Math.ceil(isi.getBoundingClientRect().bottom) + 1
        gsap.set([ad.container, document.body], { height: bottom })
        return bottom
      },
    }
  }

  window.banner = { build: build }
})()
