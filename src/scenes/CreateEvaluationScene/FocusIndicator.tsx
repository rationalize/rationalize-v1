import React, { useRef } from "react";
import classNames from "classnames";

import styles from "./FocusIndicator.module.scss";
import { ChevronLeft } from "react-feather";

const ICON_HEIGHT = 20;

export type FocusIndicatorProps = {
  className?: string;
  focussedElement: HTMLElement | null;
};

function calculateOffset(
  indicatorElement: HTMLElement | null,
  focussedElement: HTMLElement | null
) {
  if (indicatorElement && focussedElement) {
    const indicatorBounds = indicatorElement.getBoundingClientRect();
    const focusBounds = focussedElement.getBoundingClientRect();
    return (
      focusBounds.top +
      focusBounds.height / 2 -
      indicatorBounds.top -
      ICON_HEIGHT / 2
    );
  }
}

export function FocusIndicator({
  className,
  focussedElement,
}: FocusIndicatorProps) {
  const focusRef = useRef<HTMLDivElement | null>(null);
  const offset = calculateOffset(focusRef.current, focussedElement);
  return (
    <div
      className={classNames(className, styles.FocusIndicator)}
      ref={focusRef}
    >
      <div
        className={styles.FocusIndicator__Before}
        style={{ flexBasis: offset }}
      />
      <ChevronLeft
        className={styles.FocusIndicator__Icon}
        style={{
          display: focussedElement ? "block" : "none",
        }}
      />
      <div className={styles.FocusIndicator__After} />
    </div>
  );
}
