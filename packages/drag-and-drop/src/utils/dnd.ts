import { Widget } from "@/types";

export function findWidgetDeepIndex(id: number, widgets: Widget[]) {
  let deep1Index = -1;

  const deep0Index = widgets.findIndex((deep0Item) => {
    if (deep0Item.id === id) {
      return true;
    }

    deep1Index = deep0Item.subWidgets.findIndex((deep1Item) => deep1Item.id === id);
    return deep1Index > -1;
  });

  return [deep0Index, deep1Index];
}
