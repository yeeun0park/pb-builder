import { Image, StyleSheet, View } from "@react-pdf/renderer";
import {
  FOOTER_HEIGHT,
  LOGO_ASPECT,
  LOGO_WIDTH,
  PAGE_WIDTH,
  colors,
} from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    height: FOOTER_HEIGHT,
    backgroundColor: colors.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * LOGO_ASPECT,
  },
});

export const FooterLogo = ({ logoSrc }: { logoSrc: string }) => (
  <View style={styles.wrap}>
    <Image src={logoSrc} style={styles.logo} />
  </View>
);
