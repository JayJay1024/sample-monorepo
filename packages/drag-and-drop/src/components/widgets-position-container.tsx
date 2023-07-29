"use client";

import { DeleteHandler, EditHandler, MoveHandler, Widget } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import PositionWidgetItem from "./position-widget-item";
import { findWidgetDeepIndex } from "@/utils";

export default function WidgetsPositionContainer() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const widgetIdRef = useRef(0);

  const handleAddWidget = () =>
    setWidgets((prev) => {
      return [
        {
          id: widgetIdRef.current,
          name: `#${widgetIdRef.current++}`,
          isFixed: false,
          isInstallChildren: false,
          subWidgets: [],
        },
        ...prev,
      ];
    });

  const handleDeleteWidget = useCallback<DeleteHandler>((id: number) => {
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

  const handleEditWidget = useCallback<EditHandler>((id, meta) => {
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

  const handleMoveWidget = useCallback<MoveHandler>((dragId, hoverId, options) => {
    // options?.isMoveIntoSub: move to drag-here-item

    setWidgets((prev) => {
      const [dragDeep0Index, dragDeep1Index] = findWidgetDeepIndex(dragId, prev);
      const [hoverDeep0Index, hoverDeep1Index] = findWidgetDeepIndex(hoverId, prev);

      if (dragDeep0Index === -1 || hoverDeep0Index === -1) {
        return prev;
      }

      // console.log(
      //   `${dragId} => ${hoverId}, [${dragDeep0Index}, ${hoverDeep0Index}] => [${dragDeep1Index}, ${hoverDeep1Index}], ${
      //     options?.isMoveIntoSub || false
      //   }`
      // );

      if (options?.isMoveIntoSub) {
        if (dragDeep0Index === hoverDeep0Index) {
          return prev;
        } else {
          // move to drag-here-item
          const dragWidget = { ...prev[dragDeep0Index] };
          prev[hoverDeep0Index].subWidgets.push(dragWidget);
          prev.splice(dragDeep0Index, 1);
          return [...prev];
        }
      } else if (dragDeep1Index > -1 && hoverDeep1Index > -1) {
        // from sub-widget to sub-widget
        const dragWidget = { ...prev[dragDeep0Index].subWidgets[dragDeep1Index] };
        prev[dragDeep0Index].subWidgets.splice(dragDeep1Index, 1);
        prev[hoverDeep0Index].subWidgets.splice(hoverDeep1Index, 0, dragWidget);
        return [...prev];
      } else if (dragDeep1Index > -1 && hoverDeep0Index > -1 && hoverDeep1Index === -1) {
        // from sub-widget to widget
        const dragWidget = { ...prev[dragDeep0Index].subWidgets[dragDeep1Index] };
        prev[dragDeep0Index].subWidgets.splice(dragDeep1Index, 1);
        prev.splice(hoverDeep0Index, 0, dragWidget);
        return [...prev];
      } else if (dragDeep0Index > -1 && dragDeep1Index === -1 && hoverDeep1Index > -1) {
        // from widget to sub-widget
        // const dragWidget = { ...prev[dragDeep0Index] };
        // prev.splice(dragDeep0Index, 1);
        // prev[hoverDeep0Index].subWidgets.splice(hoverDeep1Index, 0, dragWidget);
        // return [...prev];

        // only via moving to drag-here-item
        return prev;
      } else if (dragDeep0Index > -1 && dragDeep1Index === -1 && hoverDeep0Index > -1 && hoverDeep1Index === -1) {
        // from widget to widget
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
            id: widgetIdRef.current,
            name: `#${widgetIdRef.current++}`,
            isFixed: true,
            isInstallChildren: false,
            subWidgets: [] as Widget[],
          };
        })
        .concat(
          {
            id: widgetIdRef.current,
            name: `#${widgetIdRef.current++}`,
            isFixed: true,
            isInstallChildren: true,
            subWidgets: [
              {
                id: widgetIdRef.current,
                name: `#${widgetIdRef.current++}`,
                isFixed: false,
                isInstallChildren: false,
                subWidgets: [],
              },
            ],
          },
          {
            id: widgetIdRef.current,
            name: `#${widgetIdRef.current++}`,
            isFixed: true,
            isInstallChildren: false,
            subWidgets: [] as Widget[],
          },
          {
            id: widgetIdRef.current,
            name: `#${widgetIdRef.current++}`,
            isFixed: true,
            isInstallChildren: true,
            subWidgets: [],
          }
        )
    );
  }, []);

  return (
    <div className="h-full overflow-y-auto w-[400px] bg-white p-5 rounded">
      <div className="flex flex-col gap-3">
        {/* add widget */}
        <div className="pb-2">
          <button
            className="w-full border rounded py-2 transition-transform hover:scale-105 active:scale-95"
            onClick={handleAddWidget}
          >
            Add Widget
          </button>
        </div>

        {/* widgets */}
        {widgets.map((widget) => (
          <PositionWidgetItem
            key={widget.id}
            widget={widget}
            onDelete={handleDeleteWidget}
            onEdit={handleEditWidget}
            onMove={handleMoveWidget}
          />
        ))}
      </div>
    </div>
  );
}
