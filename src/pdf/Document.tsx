import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import type { Campaign } from "@/lib/types";
import { registerPbGothic } from "./fonts";
import { Fullbleed } from "./sections/Fullbleed";
import { FooterLogo } from "./sections/FooterLogo";
import { Grid } from "./sections/Grid";
import { Hero } from "./sections/Hero";
import { Split } from "./sections/Split";
import { TextBlock } from "./sections/TextBlock";
import { PAGE_WIDTH, totalPageHeight } from "./theme";

registerPbGothic();

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
  },
});

type Props = {
  campaign: Campaign;
  logoSrc: string;
};

export const CampaignDocument = ({ campaign, logoSrc }: Props) => {
  const height = totalPageHeight(campaign.sections);
  return (
    <Document
      title={campaign.title}
      author="PB Detail Page Builder"
      creator="PB Detail Page Builder"
    >
      <Page size={[PAGE_WIDTH, height]} style={styles.page} wrap={false}>
        {campaign.sections.map((section) => {
          switch (section.type) {
            case "hero":
              return <Hero key={section.id} section={section} />;
            case "fullbleed":
              return <Fullbleed key={section.id} section={section} />;
            case "split":
              return <Split key={section.id} section={section} />;
            case "textBlock":
              return (
                <TextBlock
                  key={section.id}
                  section={section}
                  themeColor={campaign.themeColor}
                />
              );
            case "grid":
              return <Grid key={section.id} section={section} />;
          }
        })}
        <FooterLogo logoSrc={logoSrc} />
      </Page>
    </Document>
  );
};
