import { App, PluginSettingTab, Setting, Notice } from "obsidian";

import ExtendedSyntax from "./main";
import { InlineElementSettingsModal } from "./inlineElementSettingsModal";
import { DEFAULT_SETTINGS } from "./settings";

export class ExtendedSyntaxSettingTab extends PluginSettingTab {
	plugin: ExtendedSyntax;

	constructor(app: App, plugin: ExtendedSyntax) {
		super(app, plugin);
		this.plugin = plugin;
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
