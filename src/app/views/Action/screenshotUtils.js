import html2canvas from "html2canvas";

export const captureFullPageScreenshot = async () => {
  const originalScrollY = window.scrollY;
  const originalHeight = document.documentElement.scrollHeight;

  // Scroll to the top of the page
  window.scrollTo(0, 0);

  // Capture screenshot
  const canvas = await html2canvas(document.body, {
    scrollX: 0,
    scrollY: 0,
    height: originalHeight,
    width: document.documentElement.scrollWidth,
    useCORS: true,
    backgroundColor: null
  });

  const dataUrl = canvas.toDataURL("image/png");

  // Restore the scroll position
  window.scrollTo(0, originalScrollY);

  return dataUrl;
};
