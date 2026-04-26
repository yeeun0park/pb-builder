import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TextBlockSection } from "@/lib/types";
import { PAGE_WIDTH, colors, fonts, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    paddingVertical: spacing.textBlockPaddingY,
    paddingHorizontal: spacing.textBlockPaddingX,
    display: "flex",
    flexDirection: "column",
  },
  bgWhite: { backgroundColor: colors.bg },
  bgMuted: { backgroundColor: "#F8F8F8" },
  alignCenter: { alignItems: "center" },
  alignLeft: { alignItems: "flex-start" },
  headline: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: typography.sectionHeadline.size,
    lineHeight: typography.sectionHeadline.lineHeight,
    letterSpacing: typography.sectionHeadline.letterSpacing,
    color: colors.fg,
    marginBottom: 24,
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.body.size,
    lineHeight: typography.body.lineHeight,
    color: colors.fg,
  },
  bodyCenter: { textAlign: "center" },
  bodyLeft: { textAlign: "left" },
});

export const TextBlock = ({
  section,
  themeColor,
}: {
  section: TextBlockSection;
  themeColor: string;
}) => {
  const align = section.align ?? "center";
  const bg = section.bg ?? "white";
  const bgStyle =
    bg === "muted"
      ? styles.bgMuted
      : bg === "themeTint"
        ? { backgroundColor: `${themeColor}14` }
        : styles.bgWhite;

  return (
    <View
      style={[
        styles.wrap,
        bgStyle,
        align === "center" ? styles.alignCenter : styles.alignLeft,
      ]}
    >
      {section.headline && (
        <Text
          style={[
            styles.headline,
            align === "center" ? styles.bodyCenter : styles.bodyLeft,
          ]}
        >
          {section.headline}
        </Text>
      )}
      <Text
        style={[
          styles.body,
          align === "center" ? styles.bodyCenter : styles.bodyLeft,
        ]}
      >
        {section.body}
      </Text>
    </View>
  );
};
