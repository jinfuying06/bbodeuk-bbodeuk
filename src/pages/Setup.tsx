import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";

const homes = [
  ["원룸 / 오피스텔", "home"],
  ["투룸 / 1.5룸", "cottage"],
  ["쓰리룸 이상", "domain"],
];

const spaces = [
  ["현관", "door_front"],
  ["욕실", "water_drop"],
  ["주방", "soup_kitchen"],
  ["거실", "weekend"],
  ["침실 / 방", "bed"],
  ["베란다 / 다용도실", "balcony"],
];

const defaultSpacesByHome = [
  ["현관", "욕실", "주방", "침실 / 방"],
  ["현관", "욕실", "주방", "거실", "침실 / 방"],
  ["현관", "욕실", "주방", "거실", "침실 / 방", "베란다 / 다용도실"],
];

export default function Setup() {
  const navigate = useNavigate();
  const [home, setHome] = useState(0);
  const [selected, setSelected] = useState(defaultSpacesByHome[0]);

  const selectHome = (index: number) => {
    setHome(index);
    setSelected(defaultSpacesByHome[index]);
  };

  const completeSetup = () => {
    window.localStorage.setItem(
      "bbodeuk.setup.v1",
      JSON.stringify({
        homeType: homes[home][0],
        spaces: selected,
      }),
    );
    navigate("/home");
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-md">
        <div className="mb-space-lg flex items-center">
          <Link className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface" to="/welcome">
            <Icon name="arrow_back_ios_new" className="text-[22px]" />
          </Link>
        </div>
        <section className="mb-space-lg">
          <h1 className="text-headline-lg">청소준비</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">살고 계신 집의 형태를 알려주세요. 권장 청소 주기는 뽀득뽀득이 알아서 챙겨드릴게요.</p>
        </section>
        <section className="mb-space-lg">
          <div className="mb-space-sm">
            <h2 className="text-title-sm">주거 형태</h2>
          </div>
          <div className="grid grid-cols-3 gap-space-xs">
            {homes.map(([title, icon], index) => {
              const locked = index === 2;
              return (
              <button
                key={title}
                className={`relative min-h-[108px] overflow-hidden rounded-xl p-space-sm text-center shadow-sm ${
                  locked ? "bg-surface-container text-outline" : home === index ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest text-on-surface"
                }`}
                type="button"
                onClick={() => {
                  if (!locked) selectHome(index);
                }}
              >
                {locked ? <div className="absolute inset-0 bg-surface/45 backdrop-blur-[1px]" /> : null}
                {locked ? <span className="absolute inset-x-1 top-2 z-20 text-center text-[10px] font-semibold leading-tight text-primary drop-shadow-sm">plus를 구독해보세요!</span> : null}
                <span className="relative z-10 block">
                  <Icon name={locked ? "lock" : icon} className="mx-auto mb-space-xs text-[28px]" fill={home === index && !locked} />
                  <span className="block text-title-sm leading-tight">{title}</span>
                </span>
              </button>
              );
            })}
          </div>
        </section>
        <section className="mb-space-lg">
          <div className="mb-space-sm">
            <h2 className="text-title-sm">청소할 공간</h2>
          </div>
          <div className="flex flex-wrap gap-space-xs">
            {spaces.map(([label, icon]) => {
              const active = selected.includes(label);
              return (
                <button key={label} className={`flex items-center gap-1.5 rounded-full px-space-md py-space-xs text-label-md ${active ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest text-on-surface-variant shadow-sm"}`} type="button" onClick={() => setSelected((current) => (active ? current.filter((item) => item !== label) : [...current, label]))}>
                  <Icon name={icon} className="text-[16px]" />
                  {label}
                  {active ? <Icon name="check" className="text-[16px]" /> : null}
                </button>
              );
            })}
          </div>
        </section>
        <button className="mt-auto flex h-14 items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md" type="button" onClick={completeSetup}>
          뽀득뽀득 시작하기
        </button>
      </main>
    </PageShell>
  );
}
