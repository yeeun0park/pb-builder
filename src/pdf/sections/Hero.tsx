import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { HeroSection } from "@/lib/types";
import { PAGE_WIDTH, colors, fonts, heroHeight, typography } from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    objectFit: "cover",
  },
  placeholder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    backgroundColor: "#E8ECEF",
  },
  overlayDark: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    backgroundColor: colors.overlayDark,
  },
  overlayLight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    backgroundColor: colors.overlayLight,
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    padding: 80,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  centerAlign: { alignItems: "center", textAlign: "center" },
  leftAlign: { alignItems: "flex-start", textAlign: "left" },
  headlineWhite: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: typography.heroHeadline.size,
    lineHeight: typography.heroHeadline.lineHeight,
    letterSpacing: typography.heroHeadline.letterSpacing,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  headlineDark: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: typography.heroHeadline.size,
    lineHeight: typography.heroHeadline.lineHeight,
    letterSpacing: typography.heroHeadline.letterSpacing,
    color: colors.fg,
    marginBottom: 16,
  },
  subWhite: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.heroSub.size,
    lineHeight: typography.heroSub.lineHeight,
    color: "#FFFFFF",
    marginBottom: 24,
  },
  subDark: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.heroSub.size,
    lineHeight: typography.heroSub.lineHeight,
    color: colors.fg,
    marginBottom: 24,
  },
  periodWhite: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.period.size,
    letterSpacing: typography.period.letterSpacing,
    color: "rgba(255, 255, 255, 0.85)",
  },
  periodDark: {
    fontFamily: fonts.body,
    fontWeight: 400,
    fontSize: typography.period.size,
    letterSpacing: typography.period.letterSpacing,
    color: colors.fgMuted,
  },
});

export const Hero = ({ section }: { section: HeroSection }) => {
  const h = heroHeight(section.imageMeta);
  const overlay = section.overlay ?? "dark";
  const align = section.align ?? "center";
  const isDarkText = overlay === "light" || overlay === "none";

  const sized = { height: h };

  return (
    <View style={[styles.wrap, sized]}>
      {section.image ? (
        <Image src={section.image} style={[styles.image, sized]} />
      ) : (
        <View style={[styles.placeholder, sized]} />
      )}
      {overlay === "dark" && <View style={[styles.overlayDark, sized]} />}
      {overlay === "light" && <View style={[styles.overlayLight, sized]} />}
      <View
        style={[
          styles.content,
          sized,
          align === "center" ? styles.centerAlign : styles.leftAlign,
        ]}
      >
        <Text style={isDarkText ? styles.headlineDark : styles.headlineWhite}>
          {section.headline}
        </Text>
        {section.subhead && (
          <Text style={isDarkText ? styles.subDark : styles.subWhite}>
            {section.subhead}
          </Text>
        )}
        {section.period && (
          <Text style={isDarkText ? styles.periodDark : styles.periodWhite}>
            {section.period}
          </Text>
        )}
      </View>
    </View>
  );
};
