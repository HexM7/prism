import yaml from './prism-yaml.js';

// https://en.wikipedia.org/wiki/Test_Anything_Protocol

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'tap',
	require: yaml,
	grammar: {
		'fail': /not ok[^#{\n\r]*/,
		'pass': /ok[^#{\n\r]*/,
		'pragma': /pragma [+-][a-z]+/,
		'bailout': /bail out!.*/i,
		'version': /TAP version \d+/i,
		'plan': /\b\d+\.\.\d+(?: +#.*)?/,
		'subtest': {
			pattern: /# Subtest(?:: .*)?/,
			greedy: true
		},
		'punctuation': /[{}]/,
		'directive': /#.*/,
		'yamlish': {
			pattern: /(^[ \t]*)---[\s\S]*?[\r\n][ \t]*\.\.\.$/m,
			lookbehind: true,
			inside: 'yaml',
			alias: 'language-yaml'
		}
	}
});