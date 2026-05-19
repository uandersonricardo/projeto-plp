import type { LanguageFn } from "highlight.js";
import type { Language } from "../models/types/execution";

export const escapeHtml = (text: string) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export function languageToHljs(def: Language): LanguageFn {
  return (hljs) => ({
    name: def.name,
    aliases: [def.name],
    keywords: {
      keyword: def.bnf.keywords ?? [],
      literal: def.bnf.literals ?? [],
      type: def.bnf.types ?? [],
      built_in: def.bnf.builtins ?? [],
    },
    contains: [
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        className: "operator",
        match: /(:=|==|\+\+|\^\^|\.\.|[+\-*<>.:;,])/,
      },
    ],
  });
}
