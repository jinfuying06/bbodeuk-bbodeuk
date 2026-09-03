import Icon from "./Icon";

type ToastProps = {
  message: string;
  visible: boolean;
  actionLabel?: string;
  onAction?: () => void;
  pill?: boolean;
};

export default function Toast({ message, visible, actionLabel, onAction, pill = false }: ToastProps) {
  return (
    <div
      className={`fixed left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 transition-all duration-300 ${
        pill ? "bottom-24 flex justify-center" : "bottom-24"
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}`}
    >
      <div
        className={`bg-inverse-surface text-inverse-on-surface shadow-xl ${
          pill
            ? "inline-flex items-center gap-2.5 rounded-full px-5 py-3.5"
            : "flex items-center justify-between rounded-xl px-space-md py-space-sm"
        }`}
      >
        <div className="flex min-w-0 items-center gap-space-xs">
          <Icon name={pill ? "task_alt" : "auto_awesome"} className="text-[20px] text-tertiary-fixed" />
          <span className="truncate text-body-md font-medium">{message}</span>
        </div>
        {actionLabel && onAction ? (
          <button
            className="ml-2 min-h-[32px] shrink-0 px-2 py-1 text-label-md text-primary-fixed transition-colors active:opacity-75"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
