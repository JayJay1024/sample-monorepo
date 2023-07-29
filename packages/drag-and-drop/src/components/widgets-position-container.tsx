"use client";

import { DeleteHandler, EditHandler, MoveHandler, Widget } from "@/types";
import { useCallback, useEffect, useState } from "react";
import PositionWidgetItem from "./position-widget-item";
import { findWidgetDeepIndex } from "@/utils";

let widgetCount = 0;

export default function WidgetsPositionContainer() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const handleAdd = () =>
    setWidgets((prev) => {
      return [
        {
          id: widgetCount,
          name: `#${widgetCount++}`,
          isFixed: false,
          isInstallChildren: false,
          subWidgets: [],
        },
        ...prev,
      ];
    });

  const handleDelete = useCallback<DeleteHandler>((id: number) => {
    setWidgets((prev) => {
      const [deep0Index, deep1Index] = findWidgetDeepIndex(id, prev);
      if (deep1Index > -1) {
        prev[deep0Index].subWidgets.splice(deep1Index, 1);
        return [...prev];
      } else {
        prev.splice(deep0Index, 1);
        return [...prev];
      }
    });
  }, []);

  const handleEdit = useCallback<EditHandler>((id, meta) => {
    setWidgets((prev) => {
      const [deep0Index, deep1Index] = findWidgetDeepIndex(id, prev);
      if (deep1Index > -1) {
        prev[deep0Index].subWidgets[deep1Index].name = meta.name;
        return [...prev];
      } else {
        prev[deep0Index].name = meta.name;
        return [...prev];
      }
    });
  }, []);

  const handleMove = useCallback<MoveHandler>((dragId, hoverId, options) => {
    setWidgets((prev) => {
      const [dragDeep0Index, dragDeep1Index] = findWidgetDeepIndex(dragId, prev);
      const [hoverDeep0Index, hoverDeep1Index] = findWidgetDeepIndex(hoverId, prev);

      if (dragDeep0Index === -1 || hoverDeep0Index === -1) {
        return prev;
      }

      if (options?.isMoveIntoSub) {
        if (dragDeep0Index === hoverDeep0Index) {
          // in the same sub-widgets container
          return prev;
        } else {
          // widget => sub-widget
          const dragWidget = { ...prev[dragDeep0Index] };
          prev[hoverDeep0Index].subWidgets.push(dragWidget);
          prev.splice(dragDeep0Index, 1);
          return [...prev];
        }
      } else if (dragDeep1Index > -1 && hoverDeep1Index > -1) {
        // sub-widget => sub-widget
        const dragWidget = { ...prev[dragDeep0Index].subWidgets[dragDeep1Index] };
        prev[dragDeep0Index].subWidgets.splice(dragDeep1Index, 1);
        prev[hoverDeep0Index].subWidgets.splice(hoverDeep1Index, 0, dragWidget);
        return [...prev];
      } else if (dragDeep1Index > -1 && hoverDeep0Index > -1 && hoverDeep1Index === -1) {
        // sub-widget => widget
        const dragWidget = { ...prev[dragDeep0Index].subWidgets[dragDeep1Index] };
        prev[dragDeep0Index].subWidgets.splice(dragDeep1Index, 1);
        prev.splice(hoverDeep0Index, 0, dragWidget);
        return [...prev];
      } else if (dragDeep0Index > -1 && dragDeep1Index === -1 && hoverDeep1Index > -1) {
        // widget => sub-widget
        // only through the way of options?.isMoveIntoSub
        return prev;
      } else if (dragDeep0Index > -1 && dragDeep1Index === -1 && hoverDeep0Index > -1 && hoverDeep1Index === -1) {
        // widget => widget
        const dragWidget = { ...prev[dragDeep0Index] };
        prev.splice(dragDeep0Index, 1);
        prev.splice(hoverDeep0Index, 0, dragWidget);
        return [...prev];
      }

      return prev;
    });
  }, []);

  useEffect(() => {
    setWidgets(
      new Array(1)
        .fill(0)
        .map(() => {
          return {
            id: widgetCount,
            name: `#${widgetCount++}`,
            isFixed: true,
            isInstallChildren: false,
            subWidgets: [] as Widget[],
          };
        })
        .concat(
          {
            id: widgetCount,
            name: `#${widgetCount++}`,
            isFixed: true,
            isInstallChildren: true,
            subWidgets: [
              {
                id: widgetCount,
                name: `#${widgetCount++}`,
                isFixed: false,
                isInstallChildren: false,
                subWidgets: [],
              },
            ],
          },
          {
            id: widgetCount,
            name: `#${widgetCount++}`,
            isFixed: true,
            isInstallChildren: false,
            subWidgets: [] as Widget[],
          },
          {
            id: widgetCount,
            name: `#${widgetCount++}`,
            isFixed: true,
            isInstallChildren: true,
            subWidgets: [],
          }
        )
    );
  }, []);

  return (
    <div className="w-[400px] flex flex-col gap-3">
      {/* add widget */}
      <button
        className="w-full border rounded py-2 transition-transform hover:scale-[1.01] active:translate-y-1 bg-white"
        onClick={handleAdd}
      >
        Add Widget
      </button>

      <div className="h-full overflow-y-auto bg-white p-5 rounded">
        <div className="flex flex-col gap-3">
          {/* widgets */}
          {widgets.map((widget) => (
            <PositionWidgetItem
              key={widget.id}
              widget={widget}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onMove={handleMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
