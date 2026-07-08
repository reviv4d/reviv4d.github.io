const copyButton = document.querySelector("[data-copy-target]");

copyButton?.addEventListener("click", async () => {
  const target = document.getElementById(copyButton.dataset.copyTarget);
  if (!target) return;

  try {
    await navigator.clipboard.writeText(target.innerText);
    copyButton.textContent = "Copied";
    window.setTimeout(() => { copyButton.textContent = "Copy BibTeX"; }, 1800);
  } catch {
    copyButton.textContent = "Select to copy";
  }
});

// Autoplay result videos only while they're on screen; pause when they leave.
// The teaser keeps its own [autoplay]; everything else is scroll-triggered so
// we never decode ~30 clips at once. Videos are muted/loop/playsinline, which
// is what browsers require to allow programmatic play.
const scrollVideos = document.querySelectorAll("video:not([autoplay])");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window && scrollVideos.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play?.().catch(() => {}); // ignore autoplay rejections
        } else {
          video.pause?.();
        }
      }
    },
    { threshold: 0.25 } // play once ~25% visible
  );
  scrollVideos.forEach((video) => io.observe(video));
}
