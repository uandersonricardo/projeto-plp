import { createToken, EmbeddedActionsParser, EOF, Lexer } from "chevrotain";

import { AndExpression } from "../expressions/and-expression";
import { BooleanValue } from "../expressions/boolean-value";
import { ConcatExpression } from "../expressions/concat-expression";
import { EqualsExpression } from "../expressions/equals-expression";
import { IntegerValue } from "../expressions/integer-value";
import { LengthExpression } from "../expressions/length-expression";
import { MinusExpression } from "../expressions/minus-expression";
import { NotExpression } from "../expressions/not-expression";
import { OrExpression } from "../expressions/or-expression";
import { StringValue } from "../expressions/string-value";
import { SubtractionExpression } from "../expressions/subtraction-expression";
import { SumExpression } from "../expressions/sum-expression";
import { Program } from "../program";
import { Id } from "../expressions/id";
import { VariableDeclaration } from "../declaration/variable-declaration";
import { CompositeDeclaration } from "../declaration/composite-declaration";
import { DeclarationExpression } from "../expressions/declaration-expression";
import { FunctionDeclaration } from "../declaration/function-declaration";
import { IfThenElse } from "../expressions/if-then-else";
import { Application } from "../expressions/application";
import { FunctionValue } from "../expressions/function-value";

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_$\u00c0-\u1fff\u3040-\ufaff][a-zA-Z0-9_$\u00c0-\u1fff\u3040-\ufaff]*/,
});

const And = createToken({ name: "And", pattern: /and/, longer_alt: Identifier });
const Or = createToken({ name: "Or", pattern: /or/, longer_alt: Identifier });
const Not = createToken({ name: "Not", pattern: /not/, longer_alt: Identifier });
const Length = createToken({ name: "Length", pattern: /length/, longer_alt: Identifier });
const True = createToken({ name: "True", pattern: /true/, longer_alt: Identifier });
const False = createToken({ name: "False", pattern: /false/, longer_alt: Identifier });
const Let = createToken({ name: "Let", pattern: /let/, longer_alt: Identifier });
const Var = createToken({ name: "Var", pattern: /var/, longer_alt: Identifier });
const In = createToken({ name: "In", pattern: /in/, longer_alt: Identifier });
const If = createToken({ name: "If", pattern: /if/, longer_alt: Identifier });
const Then = createToken({ name: "Then", pattern: /then/, longer_alt: Identifier });
const Else = createToken({ name: "Else", pattern: /else/, longer_alt: Identifier });
const Func = createToken({ name: "Func", pattern: /fun/, longer_alt: Identifier });
const Fn = createToken({ name: "Fn", pattern: /fn/, longer_alt: Identifier });

const IntegerLiteral = createToken({
  name: "IntegerLiteral",
  pattern: /0[xX][0-9a-fA-F]+[lL]?|0[0-7]*[lL]?|[1-9][0-9]*[lL]?/,
});

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^"\\]|\\.)*"/,
});

const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LBrace = createToken({ name: "LBrace", pattern: /\{/ });
const RBrace = createToken({ name: "RBrace", pattern: /\}/ });
const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Dot = createToken({ name: "Dot", pattern: /\./ });

const Eq = createToken({ name: "Eq", pattern: /==/ });
const Le = createToken({ name: "Le", pattern: /<=/ });
const Ge = createToken({ name: "Ge", pattern: />=/ });
const Ne = createToken({ name: "Ne", pattern: /!=/ });
const ScOr = createToken({ name: "ScOr", pattern: /\|\|/ });
const ScAnd = createToken({ name: "ScAnd", pattern: /&&/ });
const Concat = createToken({ name: "Concat", pattern: /\+\+/ });
const Assign = createToken({ name: "Assign", pattern: /=/ });
const Gt = createToken({ name: "Gt", pattern: />/ });
const Lt = createToken({ name: "Lt", pattern: /</ });
const Bang = createToken({ name: "Bang", pattern: /!/ });
const Tilde = createToken({ name: "Tilde", pattern: /~/ });
const Hook = createToken({ name: "Hook", pattern: /\?/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Plus = createToken({ name: "Plus", pattern: /\+/ });
const Minus = createToken({ name: "Minus", pattern: /-/ });
const Star = createToken({ name: "Star", pattern: /\*/ });
const Slash = createToken({ name: "Slash", pattern: /\// });
const BitAnd = createToken({ name: "BitAnd", pattern: /&/ });
const BitOr = createToken({ name: "BitOr", pattern: /\|/ });
const Xor = createToken({ name: "Xor", pattern: /\^/ });
const Rem = createToken({ name: "Rem", pattern: /%/ });

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const LineComment = createToken({ name: "LineComment", pattern: /\/\/[^\r\n]*/, group: Lexer.SKIPPED });
const BlockComment = createToken({ name: "BlockComment", pattern: /\/\*[\s\S]*?\*\//, group: Lexer.SKIPPED });

const allTokens = [
  WhiteSpace,
  LineComment,
  BlockComment,
  And,
  Or,
  Not,
  Length,
  True,
  False,
  Let,
  Var,
  In,
  If,
  Then,
  Else,
  Func,
  Fn,
  Identifier,
  IntegerLiteral,
  StringLiteral,
  LParen,
  RParen,
  LBrace,
  RBrace,
  LBracket,
  RBracket,
  Semicolon,
  Comma,
  Dot,
  Eq,
  Le,
  Ge,
  Ne,
  ScOr,
  ScAnd,
  Concat,
  Assign,
  Gt,
  Lt,
  Bang,
  Tilde,
  Hook,
  Colon,
  Plus,
  Minus,
  Star,
  Slash,
  BitAnd,
  BitOr,
  Xor,
  Rem,
];

export const func2Lexer = new Lexer(allTokens);

export class Func2Parser extends EmbeddedActionsParser {
  [key: string]: any;

  constructor() {
    super(allTokens, {
      maxLookahead: 4,
    });

    const $ = this;

    // Same as "Input" in the original code, but with a different name to
    // avoid confusion with the "input" property of the parser.
    $.RULE("parse", () => {
      const program = $.SUBRULE($.program);
      $.CONSUME(EOF);
      return program;
    });

    $.RULE("valueInteger", () => {
      const token = $.CONSUME(IntegerLiteral);
      return new IntegerValue(parseInt(token.image));
    });

    $.RULE("valueBoolean", () => {
      return $.OR([
        {
          ALT: () => {
            $.CONSUME(True);
            return new BooleanValue(true);
          },
        },
        {
          ALT: () => {
            $.CONSUME(False);
            return new BooleanValue(false);
          },
        },
      ]);
    });

    $.RULE("valueString", () => {
      const token = $.CONSUME(StringLiteral);

      const str = token.image.substring(1, token.image.length - 1);
      return new StringValue(str);
    });

    $.RULE("value", () => {
      return $.OR([
        { ALT: () => $.SUBRULE($.valueInteger) },
        { ALT: () => $.SUBRULE($.valueBoolean) },
        { ALT: () => $.SUBRULE($.valueString) },
        { ALT: () => $.SUBRULE($.valueFunction) },
      ]);
    });

    $.RULE("valueFunction", () => {
      $.CONSUME(Fn);
      const params: any = $.SUBRULE($.idList);
      $.CONSUME(Dot);
      const exp: any = $.SUBRULE($.expression);
      return new FunctionValue(params, exp);
    });

    $.RULE("id", () => {
      const token = $.CONSUME(Identifier);
      const str = token.image;
      return new Id(str);
    });

    $.RULE("minus", () => {
      $.CONSUME(Minus);
      const exp: any = $.SUBRULE($.primaryExpr);
      return new MinusExpression(exp);
    });

    $.RULE("not", () => {
      $.CONSUME(Not);
      const exp: any = $.SUBRULE($.primaryExpr);
      return new NotExpression(exp);
    });

    $.RULE("length", () => {
      $.CONSUME(Length);
      const exp: any = $.SUBRULE($.primaryExpr);
      return new LengthExpression(exp);
    });

    $.RULE("primaryExpr", () => {
      return $.OR([
        { ALT: () => $.SUBRULE($.value) },
        {
          GATE: $.BACKTRACK($.idFollowedByLParen),
          ALT: () => $.SUBRULE($.application),
        },
        { ALT: () => $.SUBRULE($.id) },
        {
          ALT: () => {
            $.CONSUME(LParen);
            const exp: any = $.SUBRULE($.expression);
            $.CONSUME(RParen);
            return exp;
          },
        },
      ]);
    });

    $.RULE("idList", () => {
      const ids: any[] = [];

      $.AT_LEAST_ONE(() => {
        ids.push($.SUBRULE($.id));
      });

      return ids;
    });

    $.RULE("variableDeclaration", () => {
      $.CONSUME(Var);
      const id: any = $.SUBRULE($.id);
      $.CONSUME(Assign);
      const exp: any = $.SUBRULE($.expression);
      return new VariableDeclaration(id, exp);
    });

    $.RULE("functionDeclaration", () => {
      $.CONSUME(Func);
      const id: any = $.SUBRULE($.id);
      const params: any = $.SUBRULE($.idList);
      $.CONSUME(Assign);
      const exp: any = $.SUBRULE($.expression);
      return new FunctionDeclaration(id, params, exp);
    });

    $.RULE("compositeDeclaration", () => {
      const d1: any = $.SUBRULE($.singleDeclaration);
      $.CONSUME(Comma);
      const d2: any = $.SUBRULE($.declaration);
      return new CompositeDeclaration(d1, d2);
    });

    $.RULE("singleDeclaration", () => {
      return $.OR([{ ALT: () => $.SUBRULE($.variableDeclaration) }, { ALT: () => $.SUBRULE($.functionDeclaration) }]);
    });

    $.RULE("variableDeclarationFollowedByComma", () => {
      this.SUBRULE($.variableDeclaration);
      this.CONSUME(Comma);
    });

    $.RULE("functionDeclarationFollowedByComma", () => {
      $.SUBRULE($.functionDeclaration);
      $.CONSUME(Comma);
    });

    $.RULE("declaration", () => {
      return $.OR([
        {
          GATE: $.BACKTRACK($.variableDeclarationFollowedByComma),
          ALT: () => $.SUBRULE($.compositeDeclaration),
        },
        {
          GATE: $.BACKTRACK($.functionDeclarationFollowedByComma),
          ALT: () => $.SUBRULE2($.compositeDeclaration),
        },
        { ALT: () => $.SUBRULE($.variableDeclaration) },
        { ALT: () => $.SUBRULE($.functionDeclaration) },
        {
          ALT: () => {
            $.CONSUME(LParen);
            const exp: any = $.SUBRULE2($.declaration);
            $.CONSUME(RParen);
            return exp;
          },
        },
      ]);
    });

    $.RULE("declarationExpr", () => {
      $.CONSUME(Let);
      const dec: any = $.SUBRULE($.declaration);
      $.CONSUME(In);
      const exp: any = $.SUBRULE($.expression);
      return new DeclarationExpression(dec, exp);
    });

    $.RULE("conditionalExpr", () => {
      $.CONSUME(If);
      const cond: any = $.SUBRULE($.expression);
      $.CONSUME(Then);
      const thenExp: any = $.SUBRULE2($.expression);
      $.CONSUME(Else);
      const elseExp: any = $.SUBRULE3($.expression);
      return new IfThenElse(cond, thenExp, elseExp);
    });

    $.RULE("application", () => {
      const id: any = $.SUBRULE($.id);
      $.CONSUME(LParen);
      const args: any[] = [];
      $.OPTION(() => {
        args.push($.SUBRULE($.expression));
        $.MANY(() => {
          $.CONSUME(Comma);
          args.push($.SUBRULE2($.expression));
        });
      });
      $.CONSUME(RParen);
      return new Application(id, args);
    });

    $.RULE("idFollowedByLParen", () => {
      $.SUBRULE($.id);
      $.CONSUME(LParen);
    });

    $.RULE("unaryExpr", () => {
      return $.OR([
        {
          ALT: () => $.SUBRULE($.minus),
        },
        {
          ALT: () => $.SUBRULE($.not),
        },
        {
          ALT: () => $.SUBRULE($.length),
        },
        {
          ALT: () => $.SUBRULE($.declarationExpr),
        },
        {
          ALT: () => $.SUBRULE($.conditionalExpr),
        },
        {
          ALT: () => $.SUBRULE($.primaryExpr),
        },
      ]);
    });

    $.RULE("binaryExpr3", () => {
      let left: any = $.SUBRULE($.unaryExpr);

      $.MANY(() => {
        $.CONSUME(And);
        const right: any = $.SUBRULE2($.unaryExpr);
        left = new AndExpression(left, right);
      });

      return left;
    });

    $.RULE("binaryExpr2", () => {
      let left: any = $.SUBRULE($.binaryExpr3);

      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(Plus);
              const right: any = $.SUBRULE2($.binaryExpr3);
              left = new SumExpression(left, right);
            },
          },
          {
            ALT: () => {
              $.CONSUME(Minus);
              const right: any = $.SUBRULE3($.binaryExpr3);
              left = new SubtractionExpression(left, right);
            },
          },
          {
            ALT: () => {
              $.CONSUME(Or);
              const right: any = $.SUBRULE4($.binaryExpr3);
              left = new OrExpression(left, right);
            },
          },
          {
            ALT: () => {
              $.CONSUME(Concat);
              const right: any = $.SUBRULE5($.binaryExpr3);
              left = new ConcatExpression(left, right);
            },
          },
        ]);
      });

      return left;
    });

    $.RULE("binaryExpr", () => {
      let left: any = $.SUBRULE($.binaryExpr2);

      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(Eq);
              const right: any = $.SUBRULE2($.binaryExpr2);
              left = new EqualsExpression(left, right);
            },
          },
          {
            ALT: () => {
              $.CONSUME(LParen);

              const args: any[] = [];
              $.OPTION(() => {
                args.push($.SUBRULE($.expression));
                $.MANY2(() => {
                  $.CONSUME(Comma);
                  args.push($.SUBRULE3($.expression));
                });
              });

              $.CONSUME(RParen);
              left = new Application(left, args);
            },
          },
        ]);
      });

      return left;
    });

    $.RULE("expression", () => {
      return $.SUBRULE($.binaryExpr);
    });

    $.RULE("program", () => {
      const exp: any = $.SUBRULE($.expression);
      return new Program(exp);
    });

    $.performSelfAnalysis();
  }
}
