"use client";

import Image, { type ImageProps } from "next/image";

type PortfolioImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function PortfolioImage({ src, alt, ...props }: PortfolioImageProps) {
  return <Image {...props} src={src} alt={alt} />;
}
