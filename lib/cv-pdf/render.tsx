import { renderToBuffer } from "@react-pdf/renderer";
import { CvDocument } from "@/lib/cv-pdf/CvDocument";
import type { CvPdfData } from "@/lib/cv-pdf/get-cv-pdf-data";

export async function renderCvPdf(data: CvPdfData): Promise<Buffer> {
  return renderToBuffer(<CvDocument data={data} />);
}
