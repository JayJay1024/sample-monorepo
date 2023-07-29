"use client";

import WidgetsPositionContainer from "@/components/widgets-position-container";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  return (
    <main className="flex h-screen overflow-y-auto justify-center p-14">
      <DndProvider backend={HTML5Backend}>
        <WidgetsPositionContainer />
      </DndProvider>
    </main>
  );
}
