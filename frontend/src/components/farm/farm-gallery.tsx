import Image from "next/image";

export function FarmGallery({ images, alt }: { images: string[]; alt: string }) {
  const [hero, ...rest] = images;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="relative aspect-16/10 overflow-hidden rounded-lg sm:col-span-2 sm:aspect-4/3">
        <Image
          src={hero}
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
        {rest.map((src, i) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={`${alt} — view ${i + 2}`}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
