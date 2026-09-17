import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import { itemLibrary, spaceLabels, type SpaceKey } from "../../src/features/ax-onboarding/itemLibrary";
import { MAX_PHOTOS_PER_SPACE, type AXRecognitionResponse, type AXRecognizeRequest } from "../../src/features/ax-onboarding/types";

/**
 * PRD_v3.0 SECTION 19 (AX 온보딩) 백엔드 프록시 핵심 로직.
 * 계약: src/features/ax-onboarding/types.ts 의 AXRecognizeRequest / AXRecognitionResponse.
 * 이 파일은 플랫폼 비종속. Vercel 등 실제 배포 어댑터는 vercel.ts 참고.
 */

const SPACE_KEYS = Object.keys(spaceLabels) as [SpaceKey, ...SpaceKey[]];
const ITEM_IDS = itemLibrary.map((item) => item.id) as [string, ...string[]];

// itemId를 itemLibrary의 실제 id로만 강제한다 — 모델이 목록 밖 이름을 자유 생성할 수 없다.
const RecognizedItemSchema = z.object({
  itemId: z.enum(ITEM_IDS),
  confidence: z.number().int().min(0).max(100),
});

const SpaceResultSchema = z.object({
  spaceType: z.enum(SPACE_KEYS).nullable(),
  ambiguousCandidates: z.array(z.enum(SPACE_KEYS)),
  items: z.array(RecognizedItemSchema),
});

const RecognitionSchema = z.object({
  results: z.array(SpaceResultSchema),
});

let cachedClient: Anthropic | null = null;
function getClient(): Anthropic {
  // 지연 생성: ANTHROPIC_API_KEY가 없는 환경(로컬 타입체크 등)에서 모듈 로드 자체는 실패하지 않게 한다.
  if (!cachedClient) cachedClient = new Anthropic();
  return cachedClient;
}

function buildPrompt(request: AXRecognizeRequest): Anthropic.Messages.ContentBlockParam[] {
  const sectionLines: string[] = [];
  const imageBlocks: Anthropic.Messages.ContentBlockParam[] = [];

  request.spaces.forEach((space, index) => {
    const candidates = itemLibrary
      .filter((item) => item.spaceKey === space.spaceKey)
      .map((item) => `${item.id}(${item.name})`)
      .join(", ");
    sectionLines.push(
      `[구간 ${index}] 사용자가 "${spaceLabels[space.spaceKey]}"라고 표시한 공간의 사진 ${space.images.length}장. ` +
        `이 공간에서 인식 가능한 아이템 후보(이 중에서만 고를 것): ${candidates || "(없음)"}`,
    );
    for (const image of space.images) {
      imageBlocks.push({
        type: "image",
        source: { type: "base64", media_type: image.mediaType, data: image.data },
      });
    }
  });

  const instructions: Anthropic.Messages.ContentBlockParam = {
    type: "text",
    text:
      `아래는 사용자가 지정한 구간 순서대로 이어진 사진들이다.\n${sectionLines.join("\n")}\n\n` +
      `규칙:\n` +
      `1) 각 구간의 사진에서 실제로 눈에 보이는 물건만 인식해서, 그 구간에 미리 제시된 후보 목록의 id 중에서만 골라라. ` +
      `목록에 없는 물건은 무시하고 새 이름을 절대 만들지 마라.\n` +
      `2) 사진이 지정된 공간과 다르게 보이거나 복합 공간(예: 원룸의 거실 겸 침실)으로 보이면 그 구간의 spaceType을 null로 하고 ` +
      `ambiguousCandidates에 가능한 공간 후보를 넣어라. 지정된 공간이 맞다고 확신하면 spaceType에 그 공간을 그대로 넣고 ambiguousCandidates는 빈 배열로 해라.\n` +
      `3) confidence는 그 아이템이 실제로 사진에 있다는 확신을 0~100 정수로 표현해라. 애매하면 낮은 값을 써라.\n` +
      `4) results 배열은 반드시 위 구간과 같은 개수, 같은 순서로 반환해라.`,
  };

  return [instructions, ...imageBlocks];
}

export async function handleAXRecognize(request: AXRecognizeRequest): Promise<AXRecognitionResponse> {
  if (!request.spaces || request.spaces.length === 0) {
    throw new Error("spaces가 비어 있습니다");
  }
  for (const space of request.spaces) {
    if (space.images.length === 0 || space.images.length > MAX_PHOTOS_PER_SPACE) {
      throw new Error(`"${space.spaceKey}" 공간의 사진 수가 허용 범위(1~${MAX_PHOTOS_PER_SPACE}장)를 벗어났습니다`);
    }
  }

  const content = buildPrompt(request);

  const response = await getClient().messages.parse({
    model: "claude-opus-5",
    max_tokens: 4096,
    messages: [{ role: "user", content }],
    output_config: { format: zodOutputFormat(RecognitionSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("AI 응답을 구조화된 형식으로 해석하지 못했습니다");
  }

  if (response.parsed_output.results.length !== request.spaces.length) {
    throw new Error("응답 결과 개수가 요청한 공간 수와 일치하지 않습니다");
  }

  return response.parsed_output;
}
