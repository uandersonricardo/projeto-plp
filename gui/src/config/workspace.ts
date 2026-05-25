import { CodeCell } from "../models/cell/CodeCell";
import { MarkdownCell } from "../models/cell/MarkdownCell";
import { Notebook } from "../models/notebook/Notebook";
import { Workspace } from "../models/workspace/Workspace";
import { AVAILABLE_LANGUAGES } from "./languages";

const DEFAULT_LANGUAGE = AVAILABLE_LANGUAGES.find((language) => language.name === "Func3") ?? AVAILABLE_LANGUAGES[0];

export const INITIAL_WORKSPACE = new Workspace("Untitled Workspace", [
  new Notebook("Notebook 1", DEFAULT_LANGUAGE, [
    new MarkdownCell("# Welcome\nWrite notes and explanations here."),
    new CodeCell('let var x = 1 in\n  let var x = "Hi" in\n    let var x = 0, var y = 1, var z = 2 in x + y + z'),
  ]),
]);
