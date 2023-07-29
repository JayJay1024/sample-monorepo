export enum DragTypes {
  WIDGET = "widget",
}

export interface DragObject {
  id: number;
}

export type DropResult = unknown;

export interface CollectedProps {
  isDragging: boolean;
}

export type DeleteHandler = (id: number) => void;
export type EditHandler = (id: number, meta: { name: string }) => void;
export type MoveHandler = (dragId: number, hoverId: number, options?: { isMoveIntoSub?: boolean }) => void;
