import { Font } from "@react-pdf/renderer";

let registered = false;

export const registerPbGothic = () => {
  if (registered) return;
  Font.register({
    family: "PBGothic",
    fonts: [
      { src: `${import.meta.env.BASE_URL}fonts/PBGothicRg.ttf`, fontWeight: 400 },
      { src: `${import.meta.env.BASE_URL}fonts/PBGothicBd.ttf`, fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
};
