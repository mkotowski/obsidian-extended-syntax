import { App, PluginSettingTab, Setting, Notice } from "obsidian";

import ExtendedSyntax from "./main";
import { DEFAULT_SETTINGS } from "./settings";
import { InlineElementSettingsModal } from "./inlineElementSettingsModal";
import {
	emitEvent,
	InlineSyntaxEditedEventDetail,
	InlineSyntaxRemovedEventDetail,
} from "./customEvents";

function shallowCompare(object1: unknown, object2: unknown): boolean {
	return (
		Object.keys(object1).length === Object.keys(object2).length &&
		(Object.keys(object1) as (keyof typeof object1)[]).every((key) => {
			return (
				Object.prototype.hasOwnProperty.call(object2, key) &&
				object1[key] === object2[key]
			);
		})
	);
}

export class ExtendedSyntaxSettingTab extends PluginSettingTab {
	plugin: ExtendedSyntax;

	constructor(app: App, plugin: ExtendedSyntax) {
		super(app, plugin);
		this.plugin = plugin;

		addEventListener(
			"extended-syntax:inline-element-settings-edit",
			async (event: CustomEvent) => {
				const { originalSettings, editedSettings } =
					event.detail as InlineSyntaxEditedEventDetail;

				this.plugin.settings.inlineElements.forEach(
					(element, index, array) => {
						const isEqualToOriginal = shallowCompare(
							originalSettings,
							element
						);

						if (isEqualToOriginal) {
							array[index] = editedSettings;
						}
					}
				);
				await this.plugin.saveSettings();
				this.display();

				new Notice(
					"You will need to refresh open previews for changes to take effect."
				);
			}
		);

		addEventListener(
			"extended-syntax:inline-element-settings-remove",
			async (event: CustomEvent) => {
				const { originalSettings } =
					event.detail as InlineSyntaxRemovedEventDetail;

				this.plugin.settings.inlineElements.forEach(
					(element, index, array) => {
						const isEqualToOriginal = shallowCompare(
							originalSettings,
							element
						);

						if (isEqualToOriginal) {
							array = array.splice(index, 1);
						}
					}
				);
				await this.plugin.saveSettings();
				this.display();

				new Notice(
					"You will need to refresh open previews for changes to take effect."
				);
			}
		);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for Extended Syntax plugin",
		});

		containerEl.createEl("p", {
			text: "Document’s rendered view must be reloaded for all changes to be applied.",
		});

		this.plugin.settings.inlineElements.forEach((element) => {
			new Setting(containerEl)
				.setName(element.label)
				.setDesc(element.description)
				.addExtraButton((button) => {
					button
						.setIcon("pencil")
						.setTooltip(`Edit the settings for ${element.label}`)
						.onClick(async () => {
							new InlineElementSettingsModal(
								this.app,
								element
							).open();
						});
				})
				.addExtraButton((button) => {
					button
						.setIcon("trash")
						.setTooltip(`Remove ${element.label}`)
						.onClick(async () => {
							emitEvent(
								"extended-syntax:inline-element-settings-remove",
								{
									originalSettings: element,
								}
							);
							this.display();
							new Notice(
								"You may need to restart Obsidian for all changes to take effect."
							);
						});
				})
				.addToggle((toggle) => {
					toggle
						.setValue(element.isEnabled)
						.setTooltip(
							`Enable/disable rendering of ${element.label}`
						)
						.onChange(async (value) => {
							element.isEnabled = value;
							await this.plugin.saveSettings();
						});
				});
		});

		containerEl.createEl("h3", {
			text: "Danger zone",
		});

		new Setting(containerEl)
			.setName("Reset settings")
			.addButton((button) => {
				button
					.setIcon("reset")
					.setTooltip("Reset all setting to the default state.")
					.setButtonText("Reset")
					.setWarning()
					.onClick(async (event) => {
						this.plugin.settings = JSON.parse(
							JSON.stringify(DEFAULT_SETTINGS)
						);
						console.log("Extended Syntax settings resetted.");
						await this.plugin.saveSettings();
						this.display();
					});
			});
	}
}
