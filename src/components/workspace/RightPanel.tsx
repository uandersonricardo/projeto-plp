export function RightPanel() {
  return (
    <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
        <h2>Debugger</h2>
      </div>
      <div className="p-[14px] flex-1 flex flex-col justify-center">
        <span className="text-center text-sm text-gray-400 p-4">
          Here it will show compilation and execution contexts.
        </span>
      </div>
    </div>
  );
}
