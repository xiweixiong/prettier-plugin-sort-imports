import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';
import { organize } from '../utils/organize/organize';
import { ParserOptions } from 'prettier';

const organizeImports = (code: string, options: ParserOptions) => {
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
        return organize(code, options as any);
    } catch (error) {
        if (process.env.DEBUG) {
            console.error(error);
        }

        return code;
    }
};

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
    const { descriptor } = parse(code);

    const scriptContent = descriptor.script?.content;
    const scriptSetupContent = descriptor.scriptSetup?.content;

    if (!scriptContent && !scriptSetupContent) {
        return code;
    }

    let transformedCode = organizeImports(code, options as any);

    const replacer = (content: string) => {
        // we pass the second argument as a function to avoid issues with the replacement string
        // if string contained special groups (like $&, $`, $', $n, $<n>, etc.) this would produce invalid results
        return transformedCode.replace(
            content,
            () => `\n${preprocessor(content, options)}\n`,
        );
    };

    if (scriptContent) {
        transformedCode = replacer(scriptContent);
    }

    if (scriptSetupContent) {
        transformedCode = replacer(scriptSetupContent);
    }

    return transformedCode;
}
