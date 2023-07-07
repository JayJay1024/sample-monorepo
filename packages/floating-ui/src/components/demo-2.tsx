import { useClick, useFloating, useInteractions, useTransitionStyles } from "@floating-ui/react";
import { useState } from "react";

export default function Demo2() {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, context, floatingStyles } = useFloating({ open: isOpen, onOpenChange: setIsOpen });
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 700,
    initial: { transform: "scale(0.65)", opacity: 0 },
    open: { transform: "scale(1)", opacity: 1 },
    close: { transform: "scale(0.65)", opacity: 0 },
  });

  const click = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Demo 2
      </button>
      {isMounted && (
        <div
          style={{
            ...floatingStyles,
          }}
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <div style={{ ...styles }}>Tooltip</div>
        </div>
      )}
    </>
  );
}
