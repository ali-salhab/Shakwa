export const FONTS = {
  regular: "Changa-Regular",
  medium: "Changa-Medium",
  semiBold: "Changa-SemiBold",
  bold: "Changa-Bold",
} as const;

export const fontWeights = {
  regular: { fontFamily: FONTS.regular, fontWeight: "400" as const },
  medium: { fontFamily: FONTS.medium, fontWeight: "500" as const },
  semiBold: { fontFamily: FONTS.semiBold, fontWeight: "600" as const },
  bold: { fontFamily: FONTS.bold, fontWeight: "700" as const },
};
