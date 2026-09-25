import { useEffect, useState, type ReactNode } from "react";
import GlassButton from "../../components/GlassButton";
import Icon from "../../components/Icon";
import PageShell from "../../components/PageShell";
import { getSpace, spaceColor } from "../../data/cleaning";
import { recognizeSpaces } from "./api";
import FlowHeader from "./FlowHeader";
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

// Figma 슬롯 순서(거실/주방 · 욕실/방).
const SPACE_ORDER: SpaceKey[] = ["living", "kitchen", "bathroom", "bedroom"];

const LOADING_STEPS = ["사진 속 공간을 구분하는 중", "관리할 아이템을 찾는 중", "추천 초안을 만드는 중"];

type PhotoSetupScreenProps = {
  onComplete: (drafts: AXSpaceDraft[]) => void;
  onSkip: () => void;
  onBack: () => void;
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

function Intro({ title, body }: { title: ReactNode; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-[25px] font-bold leading-[39px] text-sky-ink">{title}</h1>
      <p className="text-bb-body text-sky-muted">{body}</p>
    </section>
  );
}

function InfoCard({ mark, title, body }: { mark: string; title?: string; body: string }) {
  return (
    <section className="flex gap-3 rounded-row-sm bg-sky-tint p-4">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-white text-[20px] font-bold text-sky-deep">
        {mark}
      </span>
      <div className="flex min-w-0 flex-col gap-[3px]">
        {title ? <h2 className="text-bb-label font-bold text-sky-ink">{title}</h2> : null}
        <p className="text-bb-caption text-sky-muted">{body}</p>
      </div>
    </section>
  );
}

/**
 * AI/01 미등록 (260:3168) · AI/02 분석 가능 (260:3268) · AI/03 분석 중 (260:3369) · AI/04 인식 실패 (260:3439).
 * 등록한 사진은 실패해도 그대로 유지된다(slots state는 status와 무관).
 */
export default function PhotoSetupScreen({ onComplete, onSkip, onBack }: PhotoSetupScreenProps) {
  const [slots, setSlots] = useState<Record<SpaceKey, File[]>>({
    living: [],
    kitchen: [],
    bathroom: [],
    bedroom: [],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [step, setStep] = useState(0);

  const filledSpaces = SPACE_ORDER.filter((key) => slots[key].length >= REQUIRED_PHOTOS_PER_SPACE);
  const photoCount = filledSpaces.reduce((sum, key) => sum + slots[key].length, 0);
  const canSubmit = filledSpaces.length > 0 && status !== "loading";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (status !== "loading") return;
    setStep(0);
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, LOADING_STEPS.length - 1)), 800);
    return () => window.clearInterval(timer);
  }, [status]);

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
      <FlowHeader title="사진 맞춤 설정" onBack={status === "error" ? () => setStatus("idle") : onBack} />
      <main className="flex flex-col gap-3 px-margin-screen pb-7 pt-header">
        {status === "loading" ? (
          <>
            <Intro title="사진을 확인하고 있어요" body="공간과 관리할 아이템을 찾고 있어요. 잠시만 기다려 주세요." />
            <section aria-live="polite" className="flex h-[260px] flex-col items-center justify-center gap-[18px] rounded-2xl bg-sky-white px-6 py-7">
              <span aria-hidden="true" className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-sky-tint text-sky-deep">
                <Icon name="sparkle" className="animate-pulse text-[26px] motion-reduce:animate-none" />
              </span>
              <p className="text-center text-[15px] font-bold leading-[23px] text-sky-ink">{LOADING_STEPS[step]}</p>
              <p className="text-center text-bb-caption text-sky-muted">
                선택한 {filledSpaces.length}개 공간 · 사진 {photoCount}장
              </p>
              <div aria-hidden="true" className="flex w-full flex-col gap-2">
                {LOADING_STEPS.map((label, index) => (
                  <span
                    key={label}
                    className={`rounded-[5px] transition-all duration-500 ${index <= step ? "h-2.5 bg-sky-brand" : "h-2 bg-sky-line/55"}`}
                  />
                ))}
              </div>
            </section>
            <InfoCard mark="✓" body="추천된 공간과 아이템을 다음 화면에서 직접 확인하고 수정할 수 있어요." />
          </>
        ) : status === "error" ? (
          <>
            <Intro title="사진을 인식하지 못했어요" body="등록한 사진은 그대로 있어요. 다시 시도하거나 직접 설정할 수 있어요." />
            <section className="flex flex-col gap-2.5 rounded-row-sm bg-sky-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-bb-label font-bold text-sky-ink">
                  사진 {photoCount}장 · {filledSpaces.length}개 공간
                </h2>
                <span className="flex h-[26px] items-center rounded-full bg-sky-tint px-3.5 text-bb-small text-sky-deep">사진 유지됨</span>
              </div>
              <div className="flex gap-2">
                {filledSpaces.map((key) => (
                  <div key={key} className="flex h-[42px] min-w-0 flex-1 items-center gap-[7px] rounded-xl px-2" style={{ backgroundColor: spaceColor(key, 0.28) }}>
                    <span className="flex shrink-0" style={{ color: getSpace(key).iconColor }}>
                      <Icon name={getSpace(key).icon} className="text-[20px]" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-medium leading-[17px] text-sky-ink">{spaceLabels[key]}</span>
                      <span className="text-[10px] leading-4 text-sky-muted">{slots[key].length}장</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
            <section role="alert" className="flex gap-3.5 rounded-row-sm bg-sky-tint p-[18px]">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-white text-[20px] font-bold text-sky-deep">
                !
              </span>
              <div className="flex min-w-0 flex-col gap-[7px]">
                <h2 className="text-[15px] font-bold leading-[23px] text-sky-ink">잠시 연결이 불안정했어요</h2>
                <p className="text-bb-label-sm font-normal text-sky-muted">네트워크 상태를 확인한 뒤 다시 시도해 주세요. 사진을 다시 고를 필요는 없어요.</p>
                <p className="rounded-[10px] bg-sky-tint px-2.5 py-[7px] text-bb-small text-sky-deep">밝은 곳에서 찍은 사진일수록 잘 보여요</p>
              </div>
            </section>
            <GlassButton onClick={submit}>다시 시도하기</GlassButton>
            <button
              className="press flex h-14 w-full items-center justify-center rounded-full border border-sky-line bg-sky-white text-bb-label text-sky-deep"
              type="button"
              onClick={onSkip}
            >
              사진 없이 직접 설정하기
            </button>
          </>
        ) : (
          <>
            {filledSpaces.length === 0 ? (
              <>
                <Intro title={<>공간 사진으로<br />맞춤 설정하기</>} body="사진에 보이는 물건을 기준으로 관리 아이템을 추천해드려요." />
                <InfoCard mark="!" title="공간마다 1장은 꼭 필요해요" body="원하면 2장을 더 찍어 인식 정확도를 높일 수 있어요." />
              </>
            ) : (
              <Intro title="사진을 확인해 주세요" body="채운 공간만 한 번에 분석해요. 사진은 공간당 최대 3장까지 넣을 수 있어요." />
            )}

            <section className="grid grid-cols-2 gap-3">
              {SPACE_ORDER.map((key) => (
                <PhotoSlot
                  key={key}
                  spaceKey={key}
                  label={spaceLabels[key]}
                  photos={slots[key]}
                  maxPhotos={MAX_PHOTOS_PER_SPACE}
                  requiredPhotos={REQUIRED_PHOTOS_PER_SPACE}
                  onAdd={(files) => addPhotos(key, files)}
                  onRemove={(index) => removePhoto(key, index)}
                />
              ))}
            </section>

            <GlassButton disabled={!canSubmit} onClick={submit}>
              사진으로 시작하기
            </GlassButton>
            <button className="flex h-[34px] w-full items-center justify-center text-bb-label-sm text-sky-deep transition-opacity active:opacity-60" type="button" onClick={onSkip}>
              사진 없이 빠르게 시작하기
            </button>
          </>
        )}
      </main>
    </PageShell>
  );
}
