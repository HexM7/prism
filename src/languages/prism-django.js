import markupTemplating from './prism-markup-templating.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'django',
	require: markupTemplating,
	alias: 'jinja2',
	grammar({ getLanguage }) {
		// Django/Jinja2 syntax definition for Prism.js <http://prismjs.com> syntax highlighter.
		// Mostly it works OK but can paint code incorrectly on complex html/template tag combinations.


		Prism.languages.django = {
			'comment': /^\{#[\s\S]*?#\}$/,
			'tag': {
				pattern: /(^\{%[+-]?\s*)\w+/,
				lookbehind: true,
				alias: 'keyword'
			},
			'delimiter': {
				pattern: /^\{[{%][+-]?|[+-]?[}%]\}$/,
				alias: 'punctuation'
			},
			'string': {
				pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
				greedy: true
			},
			'filter': {
				pattern: /(\|)\w+/,
				lookbehind: true,
				alias: 'function'
			},
			'test': {
				pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
				lookbehind: true,
				alias: 'function'
			},
			'function': /\b[a-z_]\w+(?=\s*\()/i,
			'keyword': /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
			'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
			'number': /\b\d+(?:\.\d+)?\b/,
			'boolean': /[Ff]alse|[Nn]one|[Tt]rue/,
			'variable': /\b\w+\b/,
			'punctuation': /[{}[\](),.:;]/
		};


		let pattern = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g;
		let markupTemplating = Prism.languages['markup-templating'];

		Prism.hooks.add('before-tokenize', function (env) {
			markupTemplating.buildPlaceholders(env, 'django', pattern);
		});
		Prism.hooks.add('after-tokenize', function (env) {
			markupTemplating.tokenizePlaceholders(env, 'django');
		});

		// Add an Jinja2 alias

		Prism.hooks.add('before-tokenize', function (env) {
			markupTemplating.buildPlaceholders(env, 'jinja2', pattern);
		});
		Prism.hooks.add('after-tokenize', function (env) {
			markupTemplating.tokenizePlaceholders(env, 'jinja2');
		});
	}
});