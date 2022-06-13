export interface InlineSyntaxSettings {
	label: string;
	description: string;
	isEnabled: boolean;
	openingSequence: string;
	closingSequence: string;
	htmlTag: string;
	htmlStyle: string;
	htmlClasses: string;
}

export interface ExtendedSyntaxSettings {
	version: string;
	inlineElements: Array<InlineSyntaxSettings>;
}

export const DEFAULT_SETTINGS: ExtendedSyntaxSettings = {
	version: "0.1.0",
	inlineElements: [
		{
			label: "Insertion",
			description: "Syntax: ++insert++",
			isEnabled: true,
			openingSequence: "++",
			closingSequence: "++",
			htmlTag: "ins",
			htmlStyle: "color:var(--interactive-success)",
			htmlClasses: "extended-syntax-insert",
		},
		{
			label: "Small caps",
			description: "Syntax: ^^small caps^^",
			isEnabled: false,
			openingSequence: "^^",
			closingSequence: "^^",
			htmlTag: "span",
			htmlStyle: "font-variant:small-caps",
			htmlClasses: "extended-syntax-small-caps",
		},
		{
			label: "Superscript",
			description: "Syntax: ^superscript^",
			isEnabled: true,
			openingSequence: "^",
			closingSequence: "^",
			htmlTag: "sup",
			htmlStyle: "",
			htmlClasses: "extended-syntax-superscript",
		},
		{
			label: "Subscript",
			description: "Syntax: ~subscript~",
			isEnabled: true,
			openingSequence: "~",
			closingSequence: "~",
			htmlTag: "sub",
			htmlStyle: "",
			htmlClasses: "extended-syntax-subscript",
		},
		{
			label: "Spoiler",
			description: "Syntax: ||spoiler||",
			isEnabled: true,
			openingSequence: "||",
			closingSequence: "||",
			htmlTag: "span",
			htmlStyle: "",
			htmlClasses: "extended-syntax-spoiler",
		},
		{
			label: "Underline",
			description: "Syntax: ..underline..",
			isEnabled: false,
			openingSequence: "..",
			closingSequence: "..",
			htmlTag: "span",
			htmlStyle: "text-decoration:underline",
			htmlClasses: "extended-syntax-underline",
		},
		{
			label: "Center alignment",
			description: "Syntax: ->center<-",
			isEnabled: false,
			openingSequence: "->",
			closingSequence: "<-",
			htmlTag: "div",
			htmlStyle: "text-align:center",
			htmlClasses: "extended-syntax-center",
		},
	],
};
