import { initials } from "@/lib/utils";

const sizes = {
  sm: "w-10 h-10 text-sm rounded-xl",
  md: "w-20 h-20 text-xl rounded-2xl",
  lg: "w-full aspect-square text-5xl rounded-2xl",
};

export default function Avatar({
  name,
  image,
  size = "md",
  className = "",
}: {
  name: string;
  image?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <div
      className={`${sizes[size]} relative overflow-hidden shrink-0 flex items-center justify-center font-display font-bold text-aqua-200 bg-gradient-to-br from-leaf-500/20 via-aqua-500/20 to-gear-500/25 border border-white/[0.08] ${className}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  );
}
