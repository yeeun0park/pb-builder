import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { GridSection } from "@/lib/types";
import { PAGE_WIDTH, colors, fonts, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  wrap: {
    width: PAGE_WIDTH,
    paddingVertical: spacing.gridPaddingY,
    paddingHorizontal: spacing.gridPaddingX,
    display: "flex",
    flexDirection: "column",
  },
  headline: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: typography.sectionHeadline.size,
    lineHeight: typography.sectionHeadline.lineHeight,
    letterSpacing: typography.sectionHeadline.letterSpacing,
    color: colors.fg,
    marginBottom: 32,
    textAlign: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  itemText: {
    display: "flex",
    flexDirection: "column",
    marginTop: 12,
  },
  itemTitle: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: 16,
    color: colors.fg,
    marginBottom: 4,
  },
  itemCaption: {
    fontFamily: fonts.body,
    fontSize: typography.caption.size,
    lineHeight: typography.caption.lineHeight,
    color: colors.fgMuted,
  },
  placeholder: {
    backgroundColor: "#F2F2F2",
    width: "100%",
  },
});

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const Grid = ({ section }: { section: GridSection }) => {
  const cols = section.columns;
  const gap = cols === 2 ? spacing.gridGap2 : spacing.gridGap3;
  const contentWidth = PAGE_WIDTH - spacing.gridPaddingX * 2;
  const colWidth = (contentWidth - (cols - 1) * gap) / cols;
  const rows = chunk(section.items, cols);

  return (
    <View style={styles.wrap}>
      {section.headline && <Text style={styles.headline}>{section.headline}</Text>}
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.row, { marginTop: rowIndex === 0 ? 0 : gap }]}
        >
          {row.map((item, colIndex) => (
            <View
              key={colIndex}
              style={{
                width: colWidth,
                marginLeft: colIndex === 0 ? 0 : gap,
              }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  style={{
                    width: colWidth,
                    height: colWidth,
                    objectFit: "contain",
                    backgroundColor: "#F7F7F7",
                  }}
                />
              ) : (
                <View
                  style={[styles.placeholder, { height: colWidth }]}
                />
              )}
              {(item.title || item.caption) && (
                <View style={styles.itemText}>
                  {item.title && (
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  )}
                  {item.caption && (
                    <Text style={styles.itemCaption}>{item.caption}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
