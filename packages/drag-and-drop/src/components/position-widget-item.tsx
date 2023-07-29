import {
  CollectedProps,
  DeleteHandler,
  DragObject,
  DragTypes,
  DropResult,
  EditHandler,
  MoveHandler,
  Widget,
} from "@/types";
import Image from "next/image";
import { useDrag, useDrop } from "react-dnd";
import PositionWidgetSubItem from "./position-widget-sub-item";

interface Props {
  widget: Widget;
  onDelete: DeleteHandler;
  onEdit: EditHandler;
  onMove: MoveHandler;
}

export default function PositionWidgetItem({ widget, onDelete, onEdit, onMove }: Props) {
  const [{ isDragging }, dragSourceRef, dragPreviewRef] = useDrag<DragObject, DropResult, CollectedProps>(
    {
      type: DragTypes.WIDGET,
      item: { id: widget.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [widget.id]
  );

  const [, dropTargetRef] = useDrop<DragObject>(
    {
      accept: DragTypes.WIDGET,
      hover: (draggedItem, monitor) => {
        if (draggedItem.id !== widget.id && monitor.isOver({ shallow: true })) {
          onMove(draggedItem.id, widget.id);
        }
      },
    },
    [widget.id, onMove]
  );

  const [, subDropTargetRef] = useDrop<DragObject>(
    {
      accept: DragTypes.WIDGET,
      hover: (draggedItem) => {
        if (widget.isInstallChildren) {
          onMove(draggedItem.id, widget.id, { isMoveIntoSub: true });
        }
      },
    },
    [widget.id, widget.isInstallChildren, onMove]
  );

  return (
    <div
      className={`rounded shadow-lg py-5 transition-opacity ${widget.isFixed ? "bg-[#F2F4FA]" : "bg-white"} ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
      ref={(node) => dragPreviewRef(dropTargetRef(node))}
    >
      <div
        ref={subDropTargetRef}
        className={`px-5 flex ${widget.isFixed ? "flex-col gap-2" : "flex-row items-center justify-between"}`}
      >
        {/* icon & name */}
        <div className="flex items-center gap-1">
          <Image
            width={20}
            height={20}
            alt={`${widget.isFixed ? "Fixed" : "Custom"} widget`}
            src={`${widget.isFixed ? "/fixed-widget.svg" : "/custom-widget.svg"}`}
          />
          <span
            className={`text-sm font-semibold ${
              widget.isFixed && !widget.isInstallChildren ? "text-[#9D9D9D]" : "text-[#302B3C]"
            }`}
          >
            {widget.name.slice(0, 20)}
            {widget.name.length > 20 ? "..." : ""}
          </span>
        </div>

        {/* delete & drag */}
        {!widget.isFixed && (
          <div className="flex items-center gap-2">
            <Image
              width={16}
              height={16}
              alt="Remove widget"
              src="/delete.svg"
              className="transition-transform hover:cursor-pointer hover:scale-105 active:scale-95"
              onClick={() => onDelete(widget.id)}
            />
            <Image
              width={16}
              height={16}
              alt="Drag widget"
              src="/drag.svg"
              className="transition-transform hover:cursor-move hover:scale-105 active:scale-95"
              ref={dragSourceRef}
            />
          </div>
        )}

        {/* sub widgets */}
        {widget.isFixed && widget.isInstallChildren && (
          <>
            {/* existing widget */}
            <div className="px-5 py-3 border border-[#D8D8D8]">
              <span className="text-sm font-semibold text-[#9D9D9D]">Existing widget (uneditable)</span>
            </div>

            {widget.subWidgets.map((item) => (
              <PositionWidgetSubItem key={item.id} widget={item} onDelete={onDelete} onEdit={onEdit} onMove={onMove} />
            ))}

            {/* drag here tips */}
            <div
              className="px-5 py-3 border border-dashed border-[#D8D8D8] flex items-center gap-1"
              ref={dropTargetRef}
            >
              <Image width={20} height={20} alt="Drop widget" src="/drop.svg" />
              <span className="text-sm font-normal text-[#9D9D9D]">Drag widget here</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
