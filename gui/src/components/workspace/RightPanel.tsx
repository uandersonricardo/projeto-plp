import { DebuggerContent } from "./DebuggerContent";

export function RightPanel() {
  return (
    <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
        <h2>Debugger</h2>
      </div>
      <DebuggerContent />
    </div>
  );
}
