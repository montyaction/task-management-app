import { useEffect, useMemo, useState } from "react";

const getFallbackText = (user) => {
  const raw = (user?.username || user?.email || "User").trim();
  const name = raw.includes("@") ? raw.split("@")[0] : raw;
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function UserAvatar({ user, className = "", sizeClass = "h-10 w-10", textClass = "text-sm" }) {
  const [imageError, setImageError] = useState(false);
  const avatarUrl = user?.avatarUrl?.trim?.() || "";

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const showImage = useMemo(() => !!avatarUrl && !imageError, [avatarUrl, imageError]);
  const fallbackText = useMemo(() => getFallbackText(user), [user]);

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-full border border-white/80 bg-gradient-to-br from-slate-100 to-slate-200 font-semibold text-slate-700 shadow-sm ${sizeClass} ${textClass} ${className}`}
      aria-label="User avatar"
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt={`${user?.username || "User"} avatar`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallbackText}</span>
      )}
    </div>
  );
}
