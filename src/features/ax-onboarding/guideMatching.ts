import { itemLibrary } from "./itemLibrary";
import { guideContent, type GuideContent } from "./guideContent";

/** itemId로 정적 가이드 콘텐츠를 조회한다. */
export function getGuideForItem(itemId: string): GuideContent | undefined {
  return guideContent.find((guide) => guide.itemId === itemId);
}

/** itemLibrary에는 있는데 guideContent가 없는 아이템 id 목록(개발용 커버리지 검증). */
export function getItemsMissingGuide(): string[] {
  const guidedIds = new Set(guideContent.map((guide) => guide.itemId));
  return itemLibrary.filter((item) => !guidedIds.has(item.id)).map((item) => item.id);
}
