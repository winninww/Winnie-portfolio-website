"use client";

import Image, { type ImageProps } from "next/image";

type PortfolioImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

<<<<<<< HEAD
export function PortfolioImage({ src, alt, ...props }: PortfolioImageProps) {
  return <Image {...props} src={src} alt={alt} />;
}
=======
export function PortfolioImage({
  src,
  alt,
  ...props
}: Props) {

  console.log("图片组件收到:", src)

  return (
    <img
      {...props}
      src={src}
      alt={alt}
    />
  );
}
>>>>>>> a1d1572 (fix exhibition gallery jsx syntax)
