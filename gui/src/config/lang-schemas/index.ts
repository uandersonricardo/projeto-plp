import func1 from './func1.json';

export interface FrameHint {
  bindingKey?: string;
  bindingKeyRegex?: string;
  matchBindingType?: string;
  matchOrigin?: string;
  matchOriginRegex?: string;
  label?: string;
  collapse?: boolean;
}

export interface LanguageSchema {
  languageId?: string;
  frameHints?: FrameHint[];
  bindingTypeAliases?: Record<string, string>;
}

const SCHEMAS: Record<string, LanguageSchema> = {
  Func1: func1,
  func1: func1,
};

export default SCHEMAS;
