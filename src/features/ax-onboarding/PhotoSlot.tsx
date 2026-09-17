import { useEffect, useState } from "react";
import Icon from "../../components/Icon";

type PhotoSlotProps = {
  label: string;
  photos: File[];
  maxPhotos: number;
  requiredPhotos: number;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export default function PhotoSlot({ label, photos, maxPhotos, requiredPhotos, onAdd, onRemove }: PhotoSlotProps) {
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

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) return;
    onAdd(Array.from(fileList).slice(0, remaining));
  };

  return (
    <div
      className={`flex flex-col gap-space-xs rounded-xl border p-space-sm shadow-sm ${
        filled ? "border-primary/40 bg-primary-fixed/20" : "border-outline-variant/50 bg-surface-container-lowest"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-title-sm text-on-surface">{label}</span>
        <span className={`text-caption ${filled ? "text-primary" : "text-on-surface-variant"}`}>{filled ? "완료" : "필수 1장"}</span>
      </div>

      <div className="grid grid-cols-3 gap-space-xxs">
        {previewUrls.map((url, index) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-surface-container">
            <img src={url} alt={`${label} 사진 ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="사진 삭제"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-inverse-surface/80 text-inverse-on-surface"
              onClick={() => onRemove(index)}
            >
              <Icon name="close" className="text-[14px]" />
            </button>
          </div>
        ))}

        {canAddMore ? (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-outline-variant text-on-surface-variant transition-colors active:bg-surface-container-low">
            <Icon name="add_a_photo" className="text-[22px]" />
            <span className="text-caption">{photos.length === 0 ? "촬영" : "추가"}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        ) : null}
      </div>
    </div>
  );
}
