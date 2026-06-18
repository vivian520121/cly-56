import html2canvas from "html2canvas";

async function waitForFonts(): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}

function copyComputedStyles(source: HTMLElement, target: HTMLElement): void {
  const computed = window.getComputedStyle(source);
  const cssText = computed.cssText;
  if (cssText) {
    target.style.cssText = cssText;
  }
}

function deepCloneWithStyles(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(false) as HTMLElement;
  copyComputedStyles(element, clone);

  const childElements = Array.from(element.children) as HTMLElement[];
  for (const child of childElements) {
    const clonedChild = deepCloneWithStyles(child);
    clone.appendChild(clonedChild);
  }

  return clone;
}

export async function exportCanvasAsImage(
  canvasElement: HTMLElement,
  filename: string = "收纳布局图"
): Promise<void> {
  try {
    await waitForFonts();

    const canvas = await html2canvas(canvasElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
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

export async function generateLayoutImageWithLabels(
  canvasElement: HTMLElement,
  layoutName: string
): Promise<string> {
  await waitForFonts();

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "-9999px";
  wrapper.style.background = "#fff";
  wrapper.style.padding = "30px";
  wrapper.style.fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  wrapper.style.zIndex = "-1";
  wrapper.style.width = "fit-content";

  const title = document.createElement("div");
  title.style.fontSize = "20px";
  title.style.fontWeight = "600";
  title.style.color = "#374151";
  title.style.marginBottom = "16px";
  title.style.textAlign = "center";
  title.style.lineHeight = "1.5";
  title.textContent = layoutName;

  const clone = deepCloneWithStyles(canvasElement);
  clone.style.position = "relative";
  clone.style.margin = "0 auto";
  clone.style.transform = "none";

  wrapper.appendChild(title);
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => setTimeout(r, 150));

  try {
    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedWrapper = clonedDoc.body.lastElementChild as HTMLElement;
        if (clonedWrapper) {
          clonedWrapper.style.visibility = "visible";
        }
      },
    });

    const dataUrl = canvas.toDataURL("image/png");
    document.body.removeChild(wrapper);
    return dataUrl;
  } catch (error) {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
    throw error;
  }
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
