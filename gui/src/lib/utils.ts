import type { Language } from "../models/types/execution";

export const languageToShortName = (language: Language) => {
	const name = language.name;
	return `L${name[0]}${name[name.length - 1]}`;
};

export const languageToStyles = (language: Language) => {
	const stylesMap: Record<string, string> = {
		exp1: "bg-red-600 text-white",
		exp2: "bg-teal-600 text-white",
		func1: "bg-cyan-400 text-white",
		func2: "bg-blue-600 text-white",
		func3: "bg-green-600 text-white",
		imp1: "bg-pink-600 text-white",
		imp2: "bg-amber-600 text-white",
		oo1: "bg-purple-600 text-white",
		oo2: "bg-black-500 text-white",
	};

	return stylesMap[language.name.toLowerCase()] ?? "bg-gray-400 text-white";
};
