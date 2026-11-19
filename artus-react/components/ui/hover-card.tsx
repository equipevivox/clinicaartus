"use client";

import { useId, type ReactNode } from "react";

type HoverCardProps = {
  label: string;
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Click on the photo (mouse/keyboard), or a second tap on touch. */
  onActivate?: () => void;
};

export default function HoverCard({
  label,
  trigger,
  children,
  open,
  onOpenChange,
  onActivate,
}: HoverCardProps) {
  const panelId = useId();

  return (
    <div
      className="hover-card"
      data-open={open}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onOpenChange(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.querySelector(":focus-visible")) {
          onOpenChange(false);
        }
      }}
    >
      <button
        className="team-avatar"
        type="button"
        aria-label={label}
        aria-describedby={open ? panelId : undefined}
        aria-expanded={open}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) onOpenChange(true);
        }}
        onBlur={() => onOpenChange(false)}
        onClick={(event) => {
          const touch = event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === "touch";
          // Touch: first tap shows the card, second tap activates.
          if (onActivate && (!touch || open)) {
            onActivate();
            return;
          }
          onOpenChange(touch ? !open : true);
        }}
      >
        {trigger}
      </button>
      <div id={panelId} className="hover-card-position" role="tooltip" aria-hidden={!open}>
        <div className="hover-card-content">{children}</div>
      </div>
    </div>
  );
}
