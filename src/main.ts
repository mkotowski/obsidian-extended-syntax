import {
	Plugin,
	MarkdownPostProcessor,
	MarkdownPostProcessorContext,
} from "obsidian";

import * as he from "he";

import {
	InlineSyntaxSettings,
	ExtendedSyntaxSettings,
	DEFAULT_SETTINGS,
} from "./settings";

import { ExtendedSyntaxSettingTab } from "./settingsTab";

// Main Tags to search for custom syntax
const TAGS = "p, h1, h2, h3, h4, h5, h6, ol, ul, table, span, div";

function isParseable(htmlElement: HTMLElement) {
	if (
		(htmlElement.nodeName === "SPAN" &&
			htmlElement?.classList.contains("math")) ||
		htmlElement.nodeName === "CODE" ||
		htmlElement.nodeName === "PRE"
	) {
		return false;
	}
	return true;
}

export default class ExtendedSyntax extends Plugin {
	settings: ExtendedSyntaxSettings;

	// Generated on load to prevent RegEx collison with tags
	// starting in similar manner (for example `^` and `^^`).
	sortedInlineElementSettings: Array<InlineSyntaxSettings>;

	// https://stackoverflow.com/a/3561711
	static escapeRegExp(string: string) {
		return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
	}

	textReplace(
		element: HTMLElement,
		syntaxSettings: InlineSyntaxSettings
	): boolean {
		if (!isParseable(element)) {
			return false;
		}

		const regex = new RegExp(
			`(?<!<(pre)|(code)|(span [^\n]*?class="[^\n]*?math)[^\n]*?>[^\n]*?)${ExtendedSyntax.escapeRegExp(
				he.encode(syntaxSettings.openingSequence, {
					useNamedReferences: true,
				})
			)}\\S+?([^\\S\n]+\\S+?)*${ExtendedSyntax.escapeRegExp(
				he.encode(syntaxSettings.closingSequence, {
					useNamedReferences: true,
				})
			)}(?![^\n]*?</(pre)|(code)|(span)>)`,
			"g"
		);

		if (element.hasChildNodes()) {
			element.childNodes.forEach((child: ChildNode) =>
				this.textReplace(child as HTMLElement, syntaxSettings)
			);

			let innerHTML = element.innerHTML;

			innerHTML.match(regex)?.forEach((el: string) => {
				const fragments = innerHTML.split(el);

				const newText = el.slice(
					he.encode(syntaxSettings.openingSequence, {
						useNamedReferences: true,
					}).length,
					el.length -
						he.encode(syntaxSettings.closingSequence, {
							useNamedReferences: true,
						}).length
				);

				const newElement = createEl(
					syntaxSettings.htmlTag as keyof HTMLElementTagNameMap,
					{
						cls:
							"obsidian-extended-syntax " +
							syntaxSettings.htmlClasses,
					}
				);

				newElement.innerHTML = newText;
				if (syntaxSettings.htmlStyle) {
					newElement.style.cssText += syntaxSettings.htmlStyle;
				}

				innerHTML = fragments[0] + newElement.outerHTML + fragments[1];

				element.innerHTML = innerHTML;
			});
		} else if (element.nodeType === Node.TEXT_NODE) {
			if (
				element?.parentNode.nodeName === "PRE" ||
				element?.parentNode.nodeName === "CODE" ||
				(element?.parentNode.nodeName === "SPAN" &&
					element?.parentElement?.classList.contains("math"))
			) {
				return false;
			}

			element.textContent.match(regex)?.forEach((el: string) => {
				const newText = el.slice(
					he.encode(syntaxSettings.openingSequence, {
						useNamedReferences: true,
					}).length,
					el.length -
						he.encode(syntaxSettings.closingSequence, {
							useNamedReferences: true,
						}).length
				);

				const newElement = createEl(
					syntaxSettings.htmlTag as keyof HTMLElementTagNameMap,
					{
						cls:
							"obsidian-extended-syntax " +
							syntaxSettings.htmlClasses,
						text: newText,
					}
				);

				if (syntaxSettings.htmlStyle) {
					newElement.style.cssText += syntaxSettings.htmlStyle;
				}

				const textFragments = element.textContent.split(el);
				const parentElement = element.parentElement;
				const newContainerElement = document.createElement("span");

				if (!parentElement) {
					element.replaceWith(newElement);
				} else {
					parentElement?.replaceChild(newContainerElement, element);
				}

				newContainerElement.appendText(textFragments[0]);
				newContainerElement.appendChild(newElement);
				newContainerElement.appendText(textFragments[1]);
			});
		} else {
			return false;
		}
		return true;
	}

	public postprocessor: MarkdownPostProcessor = (
		element: HTMLElement,
		context: MarkdownPostProcessorContext
	) => {
		const blockToReplace = element.querySelectorAll(TAGS);
		if (blockToReplace.length === 0) return;

		this.sortedInlineElementSettings.forEach(
			(syntax: InlineSyntaxSettings) => {
				if (syntax.isEnabled) {
					if (
						syntax.htmlTag.toLowerCase() === "script" ||
						syntax.htmlTag.toLowerCase() === "object" ||
						syntax.htmlTag.toLowerCase() === "embed" ||
						syntax.htmlTag.toLowerCase() === "link"
					) {
						console.error(
							`Unsanitized HTML tag: ${syntax.htmlTag}`
						);
						return false;
					}
					blockToReplace.forEach((block) => {
						this.textReplace(block as HTMLElement, syntax);
					});
				}
			}
		);
	};

	async onload() {
		console.log("Loading Extended Syntax plugin...");
		await this.loadSettings();

		this.sortedInlineElementSettings = JSON.parse(
			JSON.stringify(this.settings.inlineElements)
		);

		this.sortedInlineElementSettings.sort((a, b) => {
			if (a.openingSequence > b.openingSequence) {
				return -1;
			}
			if (a.openingSequence < b.openingSequence) {
				return 1;
			}
			return 0;
		});

		console.log(this.sortedInlineElementSettings);

		this.registerMarkdownPostProcessor(this.postprocessor);
		this.addSettingTab(new ExtendedSyntaxSettingTab(this.app, this));
		console.log("Extended Syntax plugin fully setup.");
	}

	onunload() {
		console.log("Unloading Extended Syntax plugin.");
	}

	async loadSettings() {
		console.log("Loading Extended Syntax settings.");
		const defaults = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
		this.settings = Object.assign({}, defaults, await this.loadData());
		this.sortedInlineElementSettings = JSON.parse(
			JSON.stringify(this.settings.inlineElements)
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		console.log("Extended Syntax settings saved.");
		this.sortedInlineElementSettings = JSON.parse(
			JSON.stringify(this.settings.inlineElements)
		);
	}
}
