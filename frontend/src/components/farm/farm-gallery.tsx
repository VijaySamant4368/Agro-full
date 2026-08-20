import Image from "next/image";

export function FarmGallery({ images = [], alt }: { images?: string[]; alt: string }) {
  const safeImages = Array.isArray(images) && images.length > 0
    ? images
    : ["https://picsum.photos/seed/farm-default/900/600"];

  const hero = safeImages[0];
  const rest = safeImages.slice(1);

  if (rest.length === 0) {
    return (
      <div className="relative aspect-16/9 overflow-hidden rounded-lg">
        <Image
          src={hero}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      </div>
    );
  }

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
          <div key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
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
