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

  if (window.AOS) {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }
});
