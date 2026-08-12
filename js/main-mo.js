document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".mo-menu");
  const menuBtn = document.querySelector(".mo-header__menu");
  const menuImg = document.querySelector(".mo-menu__img");
  const menuClose = document.querySelector(".mo-menu__close");
  if (menu && menuBtn && menuImg) {
    menuBtn.addEventListener("click", () => menu.classList.add("is-open"));
    menuImg.addEventListener("click", () => menu.classList.remove("is-open"));
    if (menuClose) menuClose.addEventListener("click", () => menu.classList.remove("is-open"));
  }

  const cycleImg = document.querySelector(".mo-frame__img--cycle");
  if (cycleImg) {
    const cycleSources = [
      "image/주차상품권-9.png",
      "image/주차상품권-10.png",
      "image/이용가능%20주차장%20상세정보.png",
    ];
    let cycleIndex = 0;
    cycleImg.addEventListener("click", () => {
      cycleIndex = (cycleIndex + 1) % cycleSources.length;
      cycleImg.src = cycleSources[cycleIndex];
    });
  }

  const header = document.querySelector(".mo-header");
  const btnTop = document.querySelector(".mo-btn-top");
  const track = document.querySelector(".mo-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const lastIndex = slides.length - 1;
  const freeScroll = document.querySelector(".mo-slide__scroll");
  const DURATION = 600;

  let index = 0;
  let animating = false;

  const render = () => {
    track.style.transform = `translateY(-${index * 100}vh)`;
    if (header) header.classList.toggle("is-fixed", index > 0);
    if (btnTop) btnTop.classList.toggle("is-visible", index > 0);
  };

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(lastIndex, next));
    if (clamped === index || animating) return;
    index = clamped;
    animating = true;
    render();
    window.setTimeout(() => {
      animating = false;
    }, DURATION);
  };

  render();

  if (btnTop) {
    btnTop.addEventListener("click", () => goTo(0));
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (animating) {
        e.preventDefault();
        return;
      }

      const goingDown = e.deltaY > 0;

      // Last slide's content is taller than the screen: let the wheel
      // scroll it natively, and only hijack to step back once it's
      // scrolled all the way back to its own top.
      if (index === lastIndex && freeScroll) {
        if (!goingDown && freeScroll.scrollTop <= 0) {
          e.preventDefault();
          goTo(index - 1);
        }
        return;
      }

      e.preventDefault();
      goTo(index + (goingDown ? 1 : -1));
    },
    { passive: false }
  );

  // Touch (mobile) support — wheel events never fire on touch devices, so
  // swipes need their own handling mirroring the wheel logic above.
  const SWIPE_THRESHOLD = 40;
  let touchStartY = null;
  let touchLastY = null;

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (touchStartY === null) return;
      touchLastY = e.touches[0].clientY;

      // On the free-scroll slide, let native touch scrolling happen unless
      // already at its top and the user is dragging further down.
      if (index === lastIndex && freeScroll) {
        if (touchLastY > touchStartY && freeScroll.scrollTop <= 0) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener("touchend", () => {
    if (touchStartY === null || touchLastY === null) return;
    const deltaY = touchStartY - touchLastY; // positive = swiped up = advance
    touchStartY = null;
    touchLastY = null;

    if (animating || Math.abs(deltaY) < SWIPE_THRESHOLD) return;

    const goingDown = deltaY > 0;

    if (index === lastIndex && freeScroll) {
      if (!goingDown && freeScroll.scrollTop <= 0) {
        goTo(index - 1);
      }
      return;
    }

    goTo(index + (goingDown ? 1 : -1));
  });
});
