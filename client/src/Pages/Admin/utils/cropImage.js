import { createImage } from "./createImage";

export const getCroppedImg = async (imageSrc, crop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to the size of the cropped area
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Draw the image on the canvas based on the crop values
  ctx.drawImage(
    image,
    crop.x, // x-coordinate to start cropping from the source image
    crop.y, // y-coordinate to start cropping from the source image
    crop.width, // width of the cropped area
    crop.height, // height of the cropped area
    0, // x-coordinate to start drawing on the canvas (destination)
    0, // y-coordinate to start drawing on the canvas (destination)
    crop.width, // width to draw on canvas
    crop.height // height to draw on canvas
  );

  // Return the cropped image as a Blob object (JPEG format)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas conversion to blob failed."));
        }
      },
      "image/jpeg",
      1 // Quality factor (1 is highest quality)
    );
  });
};
