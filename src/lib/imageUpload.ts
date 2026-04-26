export type ImageMeta = { w: number; h: number };

export const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const measureImage = (dataUrl: string): Promise<ImageMeta> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("이미지를 읽을 수 없습니다"));
    img.src = dataUrl;
  });

export const processImageFile = async (
  file: File,
): Promise<{ image: string; imageMeta: ImageMeta; name: string }> => {
  const image = await readAsDataUrl(file);
  const imageMeta = await measureImage(image);
  return { image, imageMeta, name: file.name };
};
