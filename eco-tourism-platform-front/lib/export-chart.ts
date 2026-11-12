export async function exportChartPng(
  container: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(container, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Export PNG failed:", error);
    alert("Échec de l'export. Vérifiez que html2canvas est installé.");
  }
}