/**
 * SENTI Premium Brand Landing & Collection Page
 * Handles layout scaling, dynamic perfume details selector, and scroll page transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  let shopState = 0;    // 0 = Left side, 1 = Right side
  let meaningState = 0; // 0 = top screen (SENTI title), 1 = bottom screen (cards)

  // ── Shop Nature: sticky-scroll constants & state ──
  const SN_CONTAINER_HEIGHT = 3300; // design canvas height in px
  let snPrevScrollY = 0;

  function snGetScale() {
    return parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--scale-factor')
    ) || Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  }

  // Update scaled canvas + counter-translate category nav so it stays fixed on screen.
  // The header lives OUTSIDE the container and is shown/hidden via CSS class.
  function snUpdateTransform(scale) {
    const container = document.getElementById('sn-container');
    if (!container) return;
    const scrollY = window.scrollY;

    // Scroll the design canvas
    container.style.transform =
      `translateX(-50%) scale(${scale}) translateY(${-(scrollY / scale)}px)`;

    // Counter-translate category nav → stays fixed at its initial viewport position
    const cats = document.getElementById('sn-cats');
    if (cats) {
      cats.style.transform = `translateY(${scrollY / scale}px)`;
    }
  }

  const isShopPage = document.body.classList.contains('page-shopnature') ||
                     document.body.classList.contains('page-shopcity')  ||
                     document.body.classList.contains('page-shopmemoir');

  if (isShopPage) {
    const SC_CONTAINER_HEIGHT = document.body.classList.contains('page-shopcity')
      ? 2100   // City: 3 items
      : document.body.classList.contains('page-shopmemoir')
      ? 2700   // Memoir: 4 items
      : SN_CONTAINER_HEIGHT; // Nature: 3300

    const s0 = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);

    // Set outer height so the body scrolls the correct distance
    const outer = document.getElementById('sn-outer');
    if (outer) outer.style.height = Math.round(SC_CONTAINER_HEIGHT * s0) + 'px';

    // Set header-wrap visual height
    const headerWrap = document.getElementById('sn-header-wrap');
    if (headerWrap) headerWrap.style.height = Math.round(80 * s0) + 'px';

    // Scroll handler: update canvas transform + hide/show nav
    window.addEventListener('scroll', () => {
      const s = snGetScale();
      const scrollY = window.scrollY;

      snUpdateTransform(s);

      // Scroll-direction-aware nav: hide on down, reveal on up
      if (headerWrap) {
        if (scrollY > snPrevScrollY + 4) {
          headerWrap.classList.add('sn-nav-hidden');
        } else if (scrollY < snPrevScrollY - 4) {
          headerWrap.classList.remove('sn-nav-hidden');
        }
      }
      snPrevScrollY = scrollY;
    }, { passive: true });
  }

  // 1. Proportional Viewport Scaling Layout (Letterbox Contain)
  function handleResize() {
    const designWidth = 1920;
    const designHeight = 1080;

    let scale;
    scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);

    document.documentElement.style.setProperty('--scale-factor', scale.toString());

    // Dynamic container width to ensure full screen coverage without horizontal margins
    const containerWidth = window.innerWidth / scale;
    document.documentElement.style.setProperty('--container-width', `${containerWidth}px`);

    // Update shop layout on resize
    if (['shopnature','shopcity','shopmemoir'].includes(getPageType())) {
      const containerH = getPageType() === 'shopcity' ? 2100
                       : getPageType() === 'shopmemoir' ? 2700
                       : SN_CONTAINER_HEIGHT;
      const outer = document.getElementById('sn-outer');
      if (outer) outer.style.height = Math.round(containerH * scale) + 'px';
      const hw = document.getElementById('sn-header-wrap');
      if (hw) hw.style.height = Math.round(80 * scale) + 'px';
      snUpdateTransform(scale);
    }

    // Update shop layout translate on resize
    if (getPageType() === 'shop') {
      const navOffset = 40 * scale; // half of 80px nav, in px
      const maxScrollX = (3840 * scale) - window.innerWidth;
      const scrollX = shopState === 1 ? -maxScrollX : 0;
      const shopContainer = document.querySelector('.shop-container');
      if (shopContainer) {
        shopContainer.style.transition = 'none';
        shopContainer.style.top = `calc(50% + ${navOffset}px)`;
        shopContainer.style.transform = `translate3d(${scrollX}px, -50%, 0) scale(${scale})`;
        shopContainer.offsetHeight;
        shopContainer.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    }
  }

  handleResize();
  window.addEventListener('resize', handleResize);

  // ── Collection Intro: scroll-direction-aware nav hide/show ──
  if (getPageType() === 'collection-intro') {
    let ciPrevScrollY = 0;
    const ciHeaderWrap = document.getElementById('ci-header-wrap');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (ciHeaderWrap) {
        if (scrollY === 0) {
          ciHeaderWrap.classList.remove('ci-nav-hidden');
        } else if (scrollY > ciPrevScrollY + 4) {
          ciHeaderWrap.classList.add('ci-nav-hidden');
        } else if (scrollY < ciPrevScrollY - 4) {
          ciHeaderWrap.classList.remove('ci-nav-hidden');
        }
      }
      ciPrevScrollY = scrollY;
    }, { passive: true });
  }

  // Handle scroll position on entry for scrollable collection-intro page
  if (getPageType() === 'collection-intro') {
    if (window.location.hash === '#bottom') {
      // Temporarily disable scroll-behavior to prevent animation jump
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 99999);
      setTimeout(() => {
        window.scrollTo(0, 99999);
        document.documentElement.style.scrollBehavior = 'smooth';
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }

  // Remove page transition block on load
  document.body.classList.remove('page-transitioning');

  // Trigger entrance stagger animations after a brief delay
  setTimeout(() => {
    document.body.classList.add('reveal-active');
  }, 100);

  // Mark reveal animations as complete after they finish to make UI interactions snappy
  setTimeout(() => {
    document.body.classList.add('reveal-completed');
  }, 1500);

  // 2. Collection Category Selector Interaction (Only on collection page)
  const menuItems = document.querySelectorAll('.collection-menu-item');
  const bgOverlay = document.getElementById('bg-overlay');
  const centerImgWrapper = document.getElementById('center-image-wrapper');
  const centerImg = document.getElementById('center-image');
  const descContainer = document.getElementById('desc-container');
  const menuDot = document.getElementById('menu-dot');

  if (menuItems.length > 0 && descContainer) {
    const categoriesData = [
      {
        theme: "theme-nature",
        img: "assets/collection_nature.png",
        imgClass: "nature",
        descHtml: "<p>The smell left by the forest,</p><p>The place where the rain has gone,</p><p>in the way nature remembers.</p>",
        descClass: "nature",
        hasCenterImg: true
      },
      {
        theme: "theme-city",
        img: "assets/collection_city.png",
        imgClass: "city",
        descHtml: "<p>The city streets never truly fall silent,</p><p>The building lights reflect off wet pavement,</p><p>Cold air carries the scent of rain,</p><p>The city's senses linger long after you've gone.</p>",
        descClass: "city",
        hasCenterImg: true
      },
      {
        theme: "theme-memoir",
        img: "assets/collection_memoir.png",
        imgClass: "memoir",
        descHtml: "<p>The tension on the first day we met,</p><p>The happiness you feel when you have fun,</p><p>The emotions that the body reacts to first.</p>",
        descClass: "memoir",
        hasCenterImg: false
      },
      {
        theme: "theme-silence",
        img: "assets/collection_silence.png",
        imgClass: "silence",
        descHtml: "<p>The moment everything stopped</p><p>The calmness that comes from that moment</p><p>The calm scent of calmness</p><p>Only the scent fills the stillness.</p>",
        descClass: "silence",
        hasCenterImg: true
      },
      {
        theme: "theme-linger",
        img: "assets/collection_linger.png",
        imgClass: "linger",
        descHtml: "<p>A place that exists in past memories,</p><p>I felt like there was nothing there</p><p>The incense was still there.</p>",
        descClass: "linger",
        hasCenterImg: false
      }
    ];

    let currentIndex = 0;
    let autoplayTimer = null;

    function setActiveCategory(index) {
      if (index === currentIndex && menuItems[index].classList.contains('active')) return;
      currentIndex = index;

      // Set active button in menu
      menuItems.forEach((btn, idx) => {
        if (idx === index) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const data = categoriesData[index];

      // Slide the dot indicator (29px height step per menu item)
      const dotTop = 13 + (index * 29);
      if (menuDot) {
        menuDot.style.top = `${dotTop}px`;
      }

      // Fade out elements
      descContainer.classList.remove('active');
      if (centerImgWrapper) {
        centerImgWrapper.style.opacity = '0';
      }
      if (bgOverlay) {
        bgOverlay.classList.remove('active');
      }

      setTimeout(() => {
        // Update body theme class (removes other theme classes, sets active one)
        Array.from(document.body.classList).forEach(cls => {
          if (cls.startsWith('theme-')) {
            document.body.classList.remove(cls);
          }
        });
        document.body.classList.add(data.theme);

        // Update description content and coordinate class
        descContainer.className = `collection-desc-container ${data.descClass}`;
        descContainer.innerHTML = data.descHtml;
        descContainer.classList.add('active');

        // Update Memoir/Linger fullscreen backgrounds
        if (!data.hasCenterImg && bgOverlay) {
          bgOverlay.style.backgroundImage = `url('${data.img}')`;
          bgOverlay.classList.add('active');
        } else if (bgOverlay) {
          bgOverlay.style.backgroundImage = '';
        }

        // Update center image source and layout class
        if (data.hasCenterImg && centerImgWrapper && centerImg) {
          centerImg.src = data.img;
          centerImg.alt = `${menuItems[index].querySelector('.menu-label').textContent} Collection Scenery`;
          centerImgWrapper.className = `collection-center-image-wrapper ${data.imgClass}`;
          
          // Allow layout/source to apply before fading center image wrapper back in
          setTimeout(() => {
            centerImgWrapper.style.opacity = data.imgClass === 'silence' ? '0.7' : '1';
          }, 50);
        } else if (centerImgWrapper) {
          centerImgWrapper.className = `collection-center-image-wrapper ${data.imgClass}`;
        }

      }, 300);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % categoriesData.length;
        setActiveCategory(nextIndex);
      }, 3000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Bind click events to category items
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        if (isNaN(index)) return;
        setActiveCategory(index);
        startAutoplay(); // Reset autoplay timer on click
      });
    });

    // Start autoplay initially
    startAutoplay();
  }

  let isTransitioning = true;

  // Release scroll transitions lock after entrance animations complete
  setTimeout(() => {
    isTransitioning = false;
  }, 1200);

  function triggerPageTransition(targetUrl) {
    if (isTransitioning) return;
    isTransitioning = true;
    document.body.classList.add('page-transitioning');
    document.body.classList.remove('reveal-active', 'reveal-completed');
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 450);
  }

  function setMeaningState(state) {
    if (isTransitioning) return;
    isTransitioning = true;
    meaningState = state;

    const scale = parseFloat(document.documentElement.style.getPropertyValue('--scale-factor')) || 1;
    const shift = meaningState * 1080 * scale;
    const meaningContainer = document.querySelector('.meaning-container');
    if (meaningContainer) {
      meaningContainer.style.transform = `translateX(-50%) translateY(${-shift}px) scale(${scale})`;
    }

    setTimeout(() => { isTransitioning = false; }, 800);
  }

  function setShopState(state) {
    if (isTransitioning) return;
    isTransitioning = true;
    shopState = state;

    const scale = parseFloat(document.documentElement.style.getPropertyValue('--scale-factor')) || 1;
    const maxScrollX = (3840 * scale) - window.innerWidth;
    const scrollX = shopState === 1 ? -maxScrollX : 0;

    const navOffset = 40 * scale;
    const shopContainer = document.querySelector('.shop-container');
    if (shopContainer) {
      shopContainer.style.top = `calc(50% + ${navOffset}px)`;
      shopContainer.style.transform = `translate3d(${scrollX}px, -50%, 0) scale(${scale})`;
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  // Intercept nav links + product image links + back buttons for smooth fade transitions
  const navLinks = document.querySelectorAll('.nav-link, .brand-logo, .sn-img a, .pd-back-btn, .sn-cat--link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('#')) {
        e.preventDefault();
        triggerPageTransition(href);
      }
    });
  });

  // Helper to detect current page type
  function getPageType() {
    if (document.body.classList.contains('page-collection-intro')) {
      return 'collection-intro';
    } else if (document.body.classList.contains('page-collection')) {
      return 'collection';
    } else if (document.body.classList.contains('page-slogan')) {
      return 'slogan';
    } else if (document.body.classList.contains('page-story')) {
      return 'story';
    } else if (document.body.classList.contains('page-keyword')) {
      return 'keyword';
    } else if (document.body.classList.contains('page-shop')) {
      return 'shop';
    } else if (document.body.classList.contains('page-about')) {
      return 'about';
    } else if (document.body.classList.contains('page-meaning')) {
      return 'meaning';
    } else if (document.body.classList.contains('page-scent')) {
      return 'scent';
    } else if (document.body.classList.contains('page-sentiment')) {
      return 'sentiment';
    } else if (document.body.classList.contains('page-sentir')) {
      return 'sentir';
    } else if (document.body.classList.contains('page-product-detail')) {
      return 'product-detail';
    } else if (document.body.classList.contains('page-brand')) {
      return 'brand';
    } else if (document.body.classList.contains('page-product')) {
      return 'product';
    } else if (document.body.classList.contains('page-shopnature')) {
      return 'shopnature';
    } else if (document.body.classList.contains('page-shopcity')) {
      return 'shopcity';
    } else if (document.body.classList.contains('page-shopmemoir')) {
      return 'shopmemoir';
    } else {
      return 'landing';
    }
  }

  // Detect scroll direction for page swaps
  window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;

    const pageType = getPageType();

    if (pageType === 'landing' && e.deltaY > 40) {
      triggerPageTransition('collection.html');
    } else if (pageType === 'collection') {
      if (e.deltaY > 40) {
        triggerPageTransition('slogan.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('index.html');
      }
    } else if (pageType === 'slogan') {
      if (e.deltaY > 40) {
        triggerPageTransition('story.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('collection.html');
      }
    } else if (pageType === 'story') {
      if (e.deltaY > 40) {
        triggerPageTransition('keyword.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('slogan.html');
      }
    } else if (pageType === 'keyword') {
      if (e.deltaY > 40) {
        triggerPageTransition('shop.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('story.html');
      }
    } else if (pageType === 'about') {
      if (e.deltaY > 40) {
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'product') {
      if (e.deltaY > 40) {
        triggerPageTransition('shop_nature.html');
      }
    } else if (pageType === 'shopnature') {
      // Navigate back to product when at the very top and scrolling up
      if (e.deltaY < -40 && window.scrollY === 0) {
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'shopcity') {
      if (e.deltaY < -40 && window.scrollY === 0) {
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'shopmemoir') {
      if (e.deltaY < -40 && window.scrollY === 0) {
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'brand') {
      if (e.deltaY > 40) {
        triggerPageTransition('meaning.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('about.html');
      }
    } else if (pageType === 'meaning') {
      if (e.deltaY > 40) {
        triggerPageTransition('scent.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'scent') {
      if (e.deltaY > 40) {
        triggerPageTransition('sentiment.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('meaning.html');
      }
    } else if (pageType === 'sentiment') {
      if (e.deltaY > 40) {
        triggerPageTransition('sentir.html');
      } else if (e.deltaY < -40) {
        triggerPageTransition('scent.html');
      }
    } else if (pageType === 'sentir') {
      if (e.deltaY < -40) {
        triggerPageTransition('sentiment.html');
      }
    } else if (pageType === 'shop') {
      if (e.deltaY > 40) {
        if (shopState === 0) {
          setShopState(1);
        }
      } else if (e.deltaY < -40) {
        if (shopState === 1) {
          setShopState(0);
        } else if (shopState === 0) {
          triggerPageTransition('keyword.html');
        }
      }
    }
  }, { passive: true });

  // Detect keyboard navigation for page swaps
  window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;

    const pageType = getPageType();
    const scrollKeysDown = ['ArrowDown', 'PageDown', ' '];
    const scrollKeysUp = ['ArrowUp', 'PageUp'];

    if (pageType === 'landing' && scrollKeysDown.includes(e.key)) {
      e.preventDefault();
      triggerPageTransition('collection.html');
    } else if (pageType === 'collection') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('slogan.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('index.html');
      }
    } else if (pageType === 'slogan') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('story.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('collection.html');
      }
    } else if (pageType === 'story') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('keyword.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('slogan.html');
      }
    } else if (pageType === 'keyword') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('shop.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('story.html');
      }
    } else if (pageType === 'about') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'product') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('shop_nature.html');
      }
    } else if (pageType === 'shopnature') {
      if (scrollKeysUp.includes(e.key) && window.scrollY === 0) {
        e.preventDefault();
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'shopcity') {
      if (scrollKeysUp.includes(e.key) && window.scrollY === 0) {
        e.preventDefault();
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'shopmemoir') {
      if (scrollKeysUp.includes(e.key) && window.scrollY === 0) {
        e.preventDefault();
        triggerPageTransition('product.html');
      }
    } else if (pageType === 'brand') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('meaning.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('about.html');
      }
    } else if (pageType === 'meaning') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('scent.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'scent') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('sentiment.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('meaning.html');
      }
    } else if (pageType === 'sentiment') {
      if (scrollKeysDown.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('sentir.html');
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('scent.html');
      }
    } else if (pageType === 'sentir') {
      if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        triggerPageTransition('sentiment.html');
      }
    } else if (pageType === 'shop') {
      if (scrollKeysDown.includes(e.key)) {
        if (shopState === 0) {
          e.preventDefault();
          setShopState(1);
        }
      } else if (scrollKeysUp.includes(e.key)) {
        e.preventDefault();
        if (shopState === 1) {
          setShopState(0);
        } else if (shopState === 0) {
          triggerPageTransition('keyword.html');
        }
      }
    }
  });

  // Mobile/Touch Swipe Transitions
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isTransitioning) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    const pageType = getPageType();

    if (pageType === 'landing' && diffY > 80) {
      triggerPageTransition('collection.html');
    } else if (pageType === 'collection') {
      if (diffY > 80) {
        triggerPageTransition('slogan.html');
      } else if (diffY < -80) {
        triggerPageTransition('index.html');
      }
    } else if (pageType === 'slogan') {
      if (diffY > 80) {
        triggerPageTransition('story.html');
      } else if (diffY < -80) {
        triggerPageTransition('collection.html');
      }
    } else if (pageType === 'story') {
      if (diffY > 80) {
        triggerPageTransition('keyword.html');
      } else if (diffY < -80) {
        triggerPageTransition('slogan.html');
      }
    } else if (pageType === 'keyword') {
      if (diffY > 80) {
        triggerPageTransition('shop.html');
      } else if (diffY < -80) {
        triggerPageTransition('story.html');
      }
    } else if (pageType === 'about') {
      if (diffY > 80) {
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'brand') {
      if (diffY > 80) {
        triggerPageTransition('meaning.html');
      } else if (diffY < -80) {
        triggerPageTransition('about.html');
      }
    } else if (pageType === 'meaning') {
      if (diffY > 80) {
        triggerPageTransition('scent.html');
      } else if (diffY < -80) {
        triggerPageTransition('brand.html');
      }
    } else if (pageType === 'scent') {
      if (diffY > 80) {
        triggerPageTransition('sentiment.html');
      } else if (diffY < -80) {
        triggerPageTransition('meaning.html');
      }
    } else if (pageType === 'sentiment') {
      if (diffY > 80) {
        triggerPageTransition('sentir.html');
      } else if (diffY < -80) {
        triggerPageTransition('scent.html');
      }
    } else if (pageType === 'sentir') {
      if (diffY < -80) {
        triggerPageTransition('sentiment.html');
      }
    } else if (pageType === 'shop') {
      if (diffY > 80) {
        if (shopState === 0) {
          setShopState(1);
        }
      } else if (diffY < -80) {
        if (shopState === 1) {
          setShopState(0);
        } else if (shopState === 0) {
          triggerPageTransition('keyword.html');
        }
      }
    }
  }, { passive: true });

  // 3. Collection Intro — typography reveal (top to bottom)
  if (getPageType() === 'collection-intro') {
    const ciRevealEls = document.querySelectorAll('.ci-reveal');
    const ciObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.ciDelay || '0');
          setTimeout(() => {
            entry.target.classList.add('ci-revealed');
          }, delay);
          ciObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    ciRevealEls.forEach(el => ciObserver.observe(el));
  }

  // 4. Scent List & Floating Preview Card Interactions (Only on collection-intro page)
  if (getPageType() === 'collection-intro') {
    const scentItems = document.querySelectorAll('.scent-item');
    const previewCard = document.getElementById('scent-preview-card');
    const cardCoordinate = document.getElementById('card-coordinate');
    const cardImage = document.getElementById('card-image');
    const cardCode = document.getElementById('card-code');
    const cardDesc = document.getElementById('card-desc');

    const perfumesData = {
      'dawn-forest': {
        coordinate: 'N.38.03 · E.128.10',
        code: 'SNTI · N.FOREST.01',
        desc: 'The silence of the forest before the world awakes.',
        img: 'assets/perfume_dawn_forest.png',
        left: 795,
        top: 271
      },
      'falling-petals': {
        coordinate: 'N.37.52 · E.127.04',
        code: 'SNTI · N.PETAL.02',
        desc: 'The sweetness of petals falling on a spring afternoon.',
        img: 'assets/perfume_falling_petals.png',
        left: 1182,
        top: 40
      },
      'first-snow': {
        coordinate: 'N.37.68 · E.128.89',
        code: 'SNTI · N.SNOW.03',
        desc: 'The first snow of winter, cold air and quiet nights.',
        img: 'assets/perfume_first_snow.png',
        left: 1358,
        top: 335
      },
      '3am': {
        coordinate: 'N.37.32 · E.127.03',
        code: 'SNTI · C.3AM.02',
        desc: 'The city fades into the quiet of dawn.',
        img: 'assets/perfume_3am.png',
        left: 720,
        top: 252
      },
      'rainy-alley': {
        coordinate: 'N.37.34 · E.126.59',
        code: 'SNTI · M.RAIN.01',
        desc: 'The scent of rain on an old familiar street.',
        img: 'assets/perfume_rainy_alley.png',
        left: 1435,
        top: 574
      },
      'the-first-day': {
        coordinate: 'N.37.34 · E.126.59',
        code: 'SNTI · M.FIRST.02',
        desc: 'A warmth that lingered long after they were gone.',
        img: 'assets/perfume_the_first_day.png',
        left: 1200,
        top: 585
      },
      'old-room': {
        coordinate: 'N.37.34 · E.126.57',
        code: 'SNTI · M.ROOM.03',
        desc: 'The scent of a room that holds every memory.',
        img: 'assets/perfume_old_room.png',
        left: 1435,
        top: 690
      },
      'silent-morning': {
        coordinate: 'N.37.33 · E.126.58',
        code: 'SNTI · S.STILL.01',
        desc: 'The place where sound no longer exists.',
        img: 'assets/perfume_silent_morning.png',
        left: 1200,
        top: 502
      },
      'last-scent': {
        coordinate: 'N.37.32 · E.127.02',
        code: 'SNTI · L.LAST.01',
        desc: 'Some things never truly leave.',
        img: 'assets/perfume_last_scent.png',
        left: 1280,
        top: 723
      }
    };

    function updatePreviewCard(id) {
      const data = perfumesData[id];
      if (!data) return;

      // Update active state in scent list
      scentItems.forEach(item => {
        if (item.getAttribute('data-id') === id) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update card content
      if (cardCoordinate) cardCoordinate.textContent = data.coordinate;
      if (cardImage) cardImage.src = data.img;
      if (cardCode) cardCode.textContent = data.code;
      if (cardDesc) cardDesc.textContent = data.desc;

      // Update card position
      if (previewCard) {
        previewCard.style.left = `${data.left}px`;
        previewCard.style.top = `${data.top}px`;
      }
    }

    scentItems.forEach(item => {
      const id = item.getAttribute('data-id');
      if (perfumesData[id]) {
        item.addEventListener('mouseenter', () => {
          updatePreviewCard(id);
        });
        item.addEventListener('click', () => {
          updatePreviewCard(id);
        });
      }
    });

    // Initialize with Dawn Forest
    updatePreviewCard('dawn-forest');

    // Showcase section — left-to-right reveal on scroll
    const showcaseViewport = document.querySelector('.collection-showcase-viewport');
    const revealTargets = [
      document.querySelector('.showcase-col-1'),
      document.querySelector('.showcase-divider-1'),
      document.querySelector('.showcase-col-2'),
      document.querySelector('.showcase-divider-2'),
      document.querySelector('.showcase-col-3'),
    ];
    const revealDelays = [2000, 2150, 2250, 2400, 2500];
    let showcaseRevealed = false;

    function triggerShowcaseReveal() {
      if (showcaseRevealed) return;
      const rect = showcaseViewport.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        showcaseRevealed = true;
        revealTargets.forEach((el, i) => {
          if (!el) return;
          setTimeout(() => {
            el.classList.add('showcase-revealed');
          }, revealDelays[i]);
        });
      }
    }

    window.addEventListener('scroll', triggerShowcaseReveal, { passive: true });
    triggerShowcaseReveal(); // check on load in case already visible
  }
});

