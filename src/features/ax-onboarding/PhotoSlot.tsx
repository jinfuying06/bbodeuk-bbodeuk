import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { getSpace, spaceColor } from "../../data/cleaning";
import type { SpaceKey } from "./itemLibrary";

type PhotoSlotProps = {
  spaceKey: SpaceKey;
  label: string;
  photos: File[];
  maxPhotos: number;
  requiredPhotos: number;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

/** Figma "Photo slot / 공간" (AI/01 260:3231 빈 상태 · AI/02 260:3325 채운 상태). */
export default function PhotoSlot({ spaceKey, label, photos, maxPhotos, requiredPhotos, onAdd, onRemove }: PhotoSlotProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const filled = photos.length >= requiredPhotos;
  const canAddMore = photos.length < maxPhotos;

  const picker = (
    <input
      type="file"
      accept="image/*"
      capture="environment"
      className="sr-only"
      onChange={(event) => {
        const files = Array.from(event.target.files ?? []).slice(0, maxPhotos - photos.length);
        if (files.length > 0) onAdd(files);
        event.target.value = "";
      }}
    />
  );

  return (
    <div
      className="flex h-[134px] flex-col gap-2 rounded-row-sm bg-sky-white p-3 transition-colors duration-300"
      style={filled ? { backgroundColor: spaceColor(spaceKey, 0.28) } : undefined}
    >
      <div className="flex h-[22px] items-center justify-between">
        <span className="text-bb-label-sm font-bold text-sky-ink">{label}</span>
        <span className="text-bb-small" style={{ color: filled ? getSpace(spaceKey).iconColor : undefined }}>
          {filled ? "완료" : <span className="text-sky-muted">필수 {requiredPhotos}장</span>}
        </span>
      </div>

      <div className="flex h-[76px] gap-1.5">
        {previewUrls.map((url, index) => (
          <div key={url} className="relative min-w-0 flex-1 overflow-hidden rounded-xl" style={{ backgroundColor: getSpace(spaceKey).color }}>
            <img src={url} alt={`${label} 사진 ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label={`${label} 사진 ${index + 1} 삭제`}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center"
              onClick={() => onRemove(index)}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-ink/70 text-sky-white">
                <Icon name="plus" className="rotate-45 text-[14px]" />
              </span>
            </button>
          </div>
        ))}

        {canAddMore ? (
          <label
            aria-label={`${label} 사진 ${photos.length === 0 ? "촬영" : "추가"}`}
            className={`press flex cursor-pointer flex-col items-center justify-center gap-0.5 border border-dashed border-sky-line text-sky-muted has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky-deep ${
              photos.length === 0 ? "flex-1 rounded-xl" : "w-[25px] shrink-0 rounded-[10px]"
            }`}
          >
            <Icon name="plus" className={photos.length === 0 ? "text-[23px]" : "text-[16px]"} />
            {photos.length === 0 ? <span className="text-bb-small">촬영</span> : null}
            {picker}
          </label>
        ) : null}
      </div>
    </div>
  );
}
