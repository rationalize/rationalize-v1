import React, { useRef, useState, useEffect } from "react";
import { Popover, PopoverProps, PopoverBody } from "reactstrap";
import { HelpCircle } from "react-feather";

import styles from "./HelpPopover.module.scss";

export type HelpPopoverProps = {
  children: React.ReactNode;
  placement?: PopoverProps["placement"];
};

export function HelpPopover({
  children,
  placement = "bottom",
}: HelpPopoverProps) {
  const [isOpen, setOpen] = useState(false);
  const handleToggle = () => setOpen(!isOpen);

  const iconRef = useRef(null);
  const currentIcon = iconRef.current;

  function handleMouseUp() {
    setOpen(false);
  }

  function handleIconClick(e: React.MouseEvent) {
    e.stopPropagation();
    handleToggle();
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleMouseUp);
      return () => window.removeEventListener("click", handleMouseUp);
    }
  }, [isOpen]);

  return (
    <>
      <span ref={iconRef} onClick={handleIconClick}>
        <HelpCircle size="1em" className={styles.HelpPopover__Icon} />
      </span>
      {currentIcon && (
        <Popover
          target={currentIcon}
          placement={placement}
          isOpen={isOpen}
          toggle={handleToggle}
        >
          <PopoverBody>{children}</PopoverBody>
        </Popover>
      )}
    </>
  );
}
