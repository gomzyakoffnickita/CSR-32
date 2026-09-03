// Выезжающие изображения друг из под друга

const teamAnimation = document.querySelector(".team__animation-wrapper");
const images = gsap.utils.toArray(".team__animation-wrapper img");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: teamAnimation,
    start: "top 90%",
    end: "bottom 90%",
    pin: false,
    scrub: true,
  },
});

tl.fromTo(images[1],
  { rotateY: 25, x: 0, opacity: 0 },
  { rotateY: 0, x: -450, opacity: 1 }, 0);
tl.fromTo(images[2],
  { rotateY: -25, x: 0, opacity: 0 },
  { rotateY: 0, x: 450, opacity: 1 }, 0); 
