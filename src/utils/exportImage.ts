import html2canvas from "html2canvas";

export async function exportCanvasAsImage(
  canvasElement: HTMLElement,
  filename: string = "收纳布局图"
): Promise<void> {
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Failed to export image:", error);
    throw error;
  }
}

export function generateLayoutImageWithLabels(
  canvasElement: HTMLElement,
  layoutName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.background = "#fff";
    wrapper.style.padding = "30px";
    wrapper.style.fontFamily = "system-ui, sans-serif";

    const title = document.createElement("div");
    title.style.fontSize = "20px";
    title.style.fontWeight = "600";
    title.style.color = "#374151";
    title.style.marginBottom = "16px";
    title.style.textAlign = "center";
    title.textContent = layoutName;

    const clone = canvasElement.cloneNode(true) as HTMLElement;
    clone.style.position = "relative";
    clone.style.margin = "0 auto";

    wrapper.appendChild(title);
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    html2canvas(wrapper, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        document.body.removeChild(wrapper);
        resolve(dataUrl);
      })
      .catch((error) => {
        document.body.removeChild(wrapper);
        reject(error);
      });
  });
}

export async function downloadLayoutImage(
  canvasElement: HTMLElement,
  layoutName: string
): Promise<void> {
  try {
    const dataUrl = await generateLayoutImageWithLabels(canvasElement, layoutName);
    const link = document.createElement("a");
    link.download = `${layoutName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to download layout image:", error);
    throw error;
  }
}
