import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { SplitSection } from "@/lib/types";
import {
  PAGE_WIDTH,
  colors,
  fonts,
  spacing,
  splitColumnWidth,
  splitImageHeight,
  typography,
} from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    paddingVertical: spacing.splitPaddingY,
    paddingHorizontal: spacing.textBlockPaddingX,
    display: "flex",
    flexDirection: "row",
  },
  rowReverse: { flexDirection: "row-reverse" },
  spacer: { width: spacing.splitColumnGap },
  textCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  headline: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: typography.sectionHeadline.size,
    lineHeight: typography.sectionHeadline.lineHeight,
    letterSpacing: typography.sectionHeadline.letterSpacing,
    color: colors.fg,
    marginBottom: 20,
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.body.size,
    lineHeight: typography.body.lineHeight,
    color: colors.fg,
  },
  bulletWrap: { marginTop: 16 },
  bullet: {
    fontFamily: fonts.body,
    fontSize: typography.body.size,
    lineHeight: typography.body.lineHeight,
    color: colors.fg,
  },
  placeholder: { backgroundColor: "#F2F2F2" },
});

export const Split = ({ section }: { section: SplitSection }) => {
  const isRight = (section.imageSide ?? "left") === "right";
  const colW = splitColumnWidth();
  const imgH = splitImageHeight(section.imageMeta);
  const colDim = { width: colW, height: imgH };

  return (
    <View style={isRight ? [styles.wrap, styles.rowReverse] : styles.wrap}>
      <View style={colDim}>
        {section.image ? (
          <Image
            src={section.image}
            style={[colDim, { objectFit: "cover" }]}
          />
        ) : (
          <View style={[colDim, styles.placeholder]} />
        )}
      </View>
      <View style={styles.spacer} />
      <View style={[styles.textCol, colDim]}>
        <Text style={styles.headline}>{section.headline}</Text>
        <Text style={styles.body}>{section.body}</Text>
        {section.bullets && section.bullets.length > 0 && (
          <View style={styles.bulletWrap}>
            {section.bullets.map((b, i) => (
              <Text key={i} style={styles.bullet}>
                · {b}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
