import { useState } from "react";
import Icon from "../../components/Icon";
import PageShell from "../../components/PageShell";
import { recognizeSpaces } from "./api";
import { spaceLabels, type SpaceKey } from "./itemLibrary";
import PhotoSlot from "./PhotoSlot";
import {
  type AXImageInput,
  type AXImageMediaType,
  type AXRecognitionResponse,
  type AXRecognizeRequest,
  type AXSpaceDraft,
  MAX_PHOTOS_PER_SPACE,
  REQUIRED_PHOTOS_PER_SPACE,
  toDraftItems,
} from "./types";

const SUPPORTED_MEDIA_TYPES: AXImageMediaType[] = ["image/png", "image/jpeg", "image/webp"];

function resolveMediaType(file: File): AXImageMediaType {
  return (SUPPORTED_MEDIA_TYPES as string[]).includes(file.type) ? (file.type as AXImageMediaType) : "image/jpeg";
}

const SPACE_ORDER: SpaceKey[] = ["living", "kitchen", "bathroom", "bedroom"];

type PhotoSetupScreenProps = {
  onComplete: (drafts: AXSpaceDraft[]) => void;
  onSkip: () => void;
  onBack?: () => void;
};

function readFileAsImageInput(file: File): Promise<AXImageInput> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("이미지를 읽지 못했어요."));
        return;
      }
      resolve({ data: result.split(",")[1] ?? "", mediaType: resolveMediaType(file) });
    };
    reader.onerror = () => reject(reader.error ?? new Error("이미지를 읽지 못했어요."));
    reader.readAsDataURL(file);
  });
}

/**
 * 인식 응답 + 요청한 슬롯 순서를 편집 가능한 초안으로 변환한다.
 * 신뢰도 임계값 처리는 types.ts의 toDraftItems() 한 곳에만 있고, 여기서는 그걸 호출만 한다.
 */
function buildInitialDrafts(response: AXRecognitionResponse, requestedSpaces: SpaceKey[]): AXSpaceDraft[] {
  return response.results.map((result, index) => {
    const requestedKey = requestedSpaces[index];
    const resolvedSpaceKey = result.spaceType ?? requestedKey;
    return {
      spaceKey: resolvedSpaceKey,
      resolved: result.spaceType !== null || result.ambiguousCandidates.length === 0,
      ambiguousCandidates: result.ambiguousCandidates,
      items: toDraftItems(result.items),
    };
  });
}

export default function PhotoSetupScreen({ onComplete, onSkip, onBack }: PhotoSetupScreenProps) {
  const [slots, setSlots] = useState<Record<SpaceKey, File[]>>({
    living: [],
    kitchen: [],
    bathroom: [],
    bedroom: [],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const filledSpaces = SPACE_ORDER.filter((key) => slots[key].length >= REQUIRED_PHOTOS_PER_SPACE);
  const canSubmit = filledSpaces.length > 0 && status !== "loading";

  const addPhotos = (key: SpaceKey, files: File[]) => {
    setSlots((current) => ({ ...current, [key]: [...current[key], ...files].slice(0, MAX_PHOTOS_PER_SPACE) }));
  };

  const removePhoto = (key: SpaceKey, index: number) => {
    setSlots((current) => ({ ...current, [key]: current[key].filter((_, i) => i !== index) }));
  };

  const submit = async () => {
    if (!canSubmit) return;
    setStatus("loading");
    try {
      const requestSpaces = await Promise.all(
        filledSpaces.map(async (key) => ({
          spaceKey: key,
          images: await Promise.all(slots[key].map(readFileAsImageInput)),
        })),
      );
      const request: AXRecognizeRequest = { spaces: requestSpaces };
      const response = await recognizeSpaces(request);
      const drafts = buildInitialDrafts(response, filledSpaces);
      setStatus("idle");
      onComplete(drafts);
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-md">
        <div className="mb-space-lg flex items-center">
          {onBack ? (
            <button
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
              type="button"
              aria-label="이전 화면으로"
              onClick={onBack}
            >
              <Icon name="arrow_back_ios_new" className="text-[22px]" />
            </button>
          ) : null}
        </div>

        <section className="mb-space-lg">
          <h1 className="text-headline-lg">공간 사진으로 맞춤 설정하기</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            사진에 보이는 물건을 기준으로 아이템을 추천해드려요. 공간마다 1장은 꼭 필요하고, 2장은 선택으로 더 찍을 수 있어요.
          </p>
        </section>

        <section className="mb-space-lg grid grid-cols-2 gap-space-sm">
          {SPACE_ORDER.map((key) => (
            <PhotoSlot
              key={key}
              label={spaceLabels[key]}
              photos={slots[key]}
              maxPhotos={MAX_PHOTOS_PER_SPACE}
              requiredPhotos={REQUIRED_PHOTOS_PER_SPACE}
              onAdd={(files) => addPhotos(key, files)}
              onRemove={(index) => removePhoto(key, index)}
            />
          ))}
        </section>

        {status === "error" ? (
          <section className="mb-space-lg rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
            <p className="text-body-md text-on-surface">사진 인식에 실패했어요. 다시 시도하거나 수동으로 설정할 수 있어요.</p>
            <div className="mt-space-sm flex gap-space-sm">
              <button className="text-label-md text-primary" type="button" onClick={submit}>
                다시 시도하기
              </button>
              <button className="text-label-md text-secondary" type="button" onClick={onSkip}>
                수동으로 계속하기
              </button>
            </div>
          </section>
        ) : null}

        <button
          className="mt-auto flex h-14 items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md disabled:opacity-50"
          type="button"
          onClick={submit}
          disabled={!canSubmit}
        >
          {status === "loading" ? "사진을 확인하고 있어요..." : "사진으로 시작하기"}
        </button>
        <button
          className="mt-space-sm w-full py-2 text-center text-label-md text-secondary transition-colors active:opacity-75"
          type="button"
          onClick={onSkip}
          disabled={status === "loading"}
        >
          사진 없이 빠르게 시작하기
        </button>
      </main>
    </PageShell>
  );
}
