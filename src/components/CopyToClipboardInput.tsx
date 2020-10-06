import React, { useState, useEffect } from "react";
import { InputWithControls } from "components/InputWithControls";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, InputProps } from "reactstrap";
import { Clipboard, Check } from "react-feather";

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  if (e.target instanceof HTMLInputElement) {
    e.target.select();
  }
}

export type CopyToClipboardInputProps = {
  text: string;
} & InputProps;

export function CopyToClipboardInput({
  text,
  disabled,
  ...rest
}: CopyToClipboardInputProps) {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks > 0) {
      // Reset the clicks after a timeout
      const timer = window.setTimeout(() => {
        setClicks(0);
      }, 1000);
      // The timeout clears on every increment, postponing the reset
      return () => clearTimeout(timer);
    }
  }, [clicks]);

  function handleCopy() {
    setClicks(clicks + 1);
  }

  return (
    <InputWithControls
      type="text"
      value={text}
      onChange={() => {}}
      onFocus={handleFocus}
      disabled={disabled}
      {...rest}
    >
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <Button disabled={disabled} color="transparent">
          {clicks > 0 ? <Check size="1rem" /> : <Clipboard size="1rem" />}
        </Button>
      </CopyToClipboard>
    </InputWithControls>
  );
}
