import { PDFViewer } from "@react-pdf/renderer";
import { CampaignDocument } from "@/pdf/Document";
import type { Campaign } from "@/lib/types";

type Props = {
  campaign: Campaign;
  logoSrc: string;
};

export default function PdfPreview({ campaign, logoSrc }: Props) {
  return (
    <PDFViewer
      style={{ width: "100%", height: "100%", border: "none" }}
      showToolbar
    >
      <CampaignDocument campaign={campaign} logoSrc={logoSrc} />
    </PDFViewer>
  );
}
