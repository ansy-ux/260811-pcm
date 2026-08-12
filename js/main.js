document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero__bg-img");
  if (slides.length >= 2) {
    let current = 0;
    const interval = 6000; // matches heroZoomOut animation duration in style.css

    setInterval(() => {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, interval);
  }

  const header = document.querySelector(".header");
  if (header) {
    const toggleFixed = () => {
      header.classList.toggle("is-fixed", window.scrollY > 0);
    };
    toggleFixed();
    window.addEventListener("scroll", toggleFixed);
  }

  const btnTop = document.querySelector(".btn-top");
  const heroSection = document.querySelector(".hero");
  const footerSection = document.querySelector(".footer");
  if (btnTop && heroSection && footerSection) {
    const STOP_GAP = 50; // footer 위 50px 지점에서 정지

    const updateBtnTop = () => {
      const scrollY = window.scrollY;

      btnTop.classList.toggle("is-visible", scrollY >= heroSection.offsetHeight);

      const stopScrollY = footerSection.offsetTop - window.innerHeight;
      if (scrollY >= stopScrollY) {
        btnTop.style.top = `${footerSection.offsetTop - STOP_GAP - btnTop.offsetHeight}px`;
        btnTop.classList.add("is-stuck");
      } else {
        btnTop.style.top = "";
        btnTop.classList.remove("is-stuck");
      }
    };

    updateBtnTop();
    window.addEventListener("scroll", updateBtnTop);
    window.addEventListener("resize", updateBtnTop);

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const parkingMapTrigger = document.getElementById("parkingMapTrigger");
  const parkingPopup = document.getElementById("parkingPopup");
  const parkingPopupDim = document.getElementById("parkingPopupDim");
  const parkingPopupClose = document.getElementById("parkingPopupClose");
  if (parkingMapTrigger && parkingPopup && parkingPopupDim && parkingPopupClose) {
    const openPopup = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      parkingPopup.classList.add("is-open");
    };

    const closePopup = () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      parkingPopup.classList.remove("is-open");
    };

    parkingMapTrigger.addEventListener("click", openPopup);
    parkingMapTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPopup();
      }
    });
    parkingPopupDim.addEventListener("click", closePopup);
    parkingPopupClose.addEventListener("click", closePopup);
  }

  if (window.AOS) {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }
});
