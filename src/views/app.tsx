import { useEffect } from "react";
import { Exp1 } from "../lib/plp/exp1";

function App() {
  useEffect(() => {
    const lang = new Exp1();
    const result = lang.run('5 + length("hello" ++ "world")');

    console.log("Result:", result);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Hello, World!</h1>
    </div>
  );
}

export default App;
