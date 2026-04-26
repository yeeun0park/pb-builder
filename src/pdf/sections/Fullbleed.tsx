import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { FullbleedSection } from "@/lib/types";
import {
  CAPTION_HEIGHT,
  PAGE_WIDTH,
  colors,
  fonts,
  fullbleedImageHeight,
  spacing,
  typography,
} from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    display: "flex",
    flexDirection: "column",
  },
  imageBox: {
    width: PAGE_WIDTH,
  },
  image: {
    width: PAGE_WIDTH,
  },
  placeholder: {
    width: PAGE_WIDTH,
    backgroundColor: "#F2F2F2",
  },
  captionWrap: {
    width: PAGE_WIDTH,
    height: CAPTION_HEIGHT,
    paddingHorizontal: 80,
    paddingVertical: spacing.captionPaddingY,
    display: "flex",
    justifyContent: "center",
  },
  caption: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.caption.size,
    lineHeight: typography.caption.lineHeight,
    color: colors.fg,
    textAlign: "center",
  },
});

export const Fullbleed = ({ section }: { section: FullbleedSection }) => {
  const imgH = fullbleedImageHeight(section.imageMeta);
  return (
    <View style={styles.wrap}>
      <View style={[styles.imageBox, { height: imgH }]}>
        {section.image ? (
          <Image
            src={section.image}
            style={[styles.image, { height: imgH, objectFit: "contain" }]}
          />
        ) : (
          <View style={[styles.placeholder, { height: imgH }]} />
        )}
      </View>
      {section.caption && (
        <View style={styles.captionWrap}>
          <Text style={styles.caption}>{section.caption}</Text>
        </View>
      )}
    </View>
  );
};
