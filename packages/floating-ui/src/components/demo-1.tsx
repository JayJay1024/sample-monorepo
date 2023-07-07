import { useFloating, useInteractions, useHover, useFocus, FloatingArrow, arrow, offset } from "@floating-ui/react";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

export default function Demo1() {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,

    placement: "top",
    middleware: [
      offset(9),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Demo 1
      </button>
      <CSSTransition nodeRef={nodeRef} timeout={500} unmountOnExit classNames="my-fade" in={isOpen}>
        <div
          ref={(node) => {
            nodeRef.current = node;
            refs.setFloating(node);
          }}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          Tooltip
          <FloatingArrow ref={arrowRef} context={context} />
        </div>
      </CSSTransition>
    </>
  );
}
