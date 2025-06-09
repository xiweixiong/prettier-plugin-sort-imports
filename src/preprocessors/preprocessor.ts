import { ParserOptions, parse as babelParser } from '@babel/parser';
import { Directive, ImportDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { extractASTNodes } from '../utils/extract-ast-nodes';
import { getCodeFromAst } from '../utils/get-code-from-ast';
import { getExperimentalParserPlugins } from '../utils/get-experimental-parser-plugins';
import { getSortedNodes } from '../utils/get-sorted-nodes';
import { isSortImportsIgnored } from '../utils/is-sort-imports-ignored';
import { organize } from '../utils/organize/organize';
import { ParserOptions as PrettierParserOptions } from 'prettier';

const organizeImports = (code: string, options: PrettierParserOptions) => {
    if (code.includes('// organize-imports-ignore') || code.includes('// tslint:disable:ordered-imports')) {
        return code;
    }

    const isRange =
        Boolean(options.originalText) ||
        options.rangeStart !== 0 ||
        (options.rangeEnd !== Infinity && options.rangeEnd !== code.length);

    if (isRange) {
        return code; // processing a range doesn't make sense
    }

    try {
        return organize(code, options);
    } catch (error) {
        if (process.env.DEBUG) {
            console.error(error);
        }

        return code;
    }
};

export function preprocessor(code: string, options: PrettierOptions) {
    code = organizeImports(code, options as any);

    const {
        importOrderParserPlugins,
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
        importOrderSideEffects,
        importOrderImportAttributesKeyword,
    } = options;

    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: getExperimentalParserPlugins(importOrderParserPlugins),
    };

    const ast = babelParser(code, parserOptions);
    const interpreter = ast.program.interpreter;

    const {
        importNodes,
        directives,
    }: { importNodes: ImportDeclaration[]; directives: Directive[] } =
        extractASTNodes(ast);

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;
    if (isSortImportsIgnored(importNodes)) return code;

    const allImports = getSortedNodes(importNodes, {
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
        importOrderSideEffects,
    });

    return getCodeFromAst(allImports, directives, code, interpreter, {
        importOrderImportAttributesKeyword,
    });
}
