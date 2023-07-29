import { CollectedProps, DeleteHandler, DragObject, DragTypes, EditHandler, MoveHandler, Widget } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface Props {
  widget: Widget;
  onDelete: DeleteHandler;
  onEdit: EditHandler;
  onMove: MoveHandler;
}

export default function PositionWidgetSubItem({ widget, onDelete, onEdit, onMove }: Props) {
  const [isChangeName, setIsChangeName] = useState(false);
  const [inputName, setInputName] = useState(widget.name);

  const [{ isDragging }, dragSourceRef, dragPreviewRef] = useDrag<DragObject, unknown, CollectedProps>(
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
      hover: (draggedItem) => {
        if (draggedItem.id !== widget.id) {
          onMove(draggedItem.id, widget.id);
        }
      },
    },
    [widget.id, onMove]
  );

  return (
    <div
      className={`rounded shadow-lg flex px-5 py-3 border border-[#D8D8D8] bg-white items-center justify-between transition-opacity ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
      ref={(node) => dragPreviewRef(dropTargetRef(node))}
    >
      {/* name & edit */}
      <div className="flex items-center gap-2">
        {isChangeName ? (
          <input
            placeholder={widget.name}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onBlur={() => {
              onEdit(widget.id, { name: inputName });
              setIsChangeName(false);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                onEdit(widget.id, { name: inputName });
                setIsChangeName(false);
              }
            }}
            className="px-1 border border-[#D8D8D8] rounded text-sm font-light focus-visible:outline-none"
            autoFocus
          />
        ) : (
          <span
            className={`text-sm font-semibold ${
              widget.isFixed && !widget.isInstallChildren ? "text-[#9D9D9D]" : "text-[#302B3C]"
            }`}
          >
            {widget.name.slice(0, 20)}
            {widget.name.length > 20 ? "..." : ""}
          </span>
        )}
        {!isChangeName && (
          <Image
            width={16}
            height={16}
            alt="Edit widget"
            src="/edit.svg"
            className="transition-transform hover:cursor-pointer hover:scale-105 active:scale-95"
            onClick={() => setIsChangeName(true)}
          />
        )}
      </div>

      {/* delete & drag */}
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
    </div>
  );
}
