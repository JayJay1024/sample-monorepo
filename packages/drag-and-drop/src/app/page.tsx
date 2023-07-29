"use client";

import WidgetsPosition from "@/components/widgets-position";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  return (
    <main className="flex h-screen overflow-y-auto justify-center py-14 px-2">
      <DndProvider backend={HTML5Backend}>
        <WidgetsPosition />
      </DndProvider>
    </main>
  );
}
