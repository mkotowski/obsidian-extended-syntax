import { App, Modal, Setting } from "obsidian";

import { InlineSyntaxSettings } from "./settings";

export class InlineElementSettingsModal extends Modal {
	elementSettings: InlineSyntaxSettings;

	constructor(app: App, settings: InlineSyntaxSettings) {
		super(app);
		this.elementSettings = settings;
	}

	onOpen() {
		const { contentEl: modalContent, titleEl: titleContent } = this;

		titleContent.setText(`Settings for ${this.elementSettings.label}`);
		modalContent.empty();

		new Setting(modalContent)
			.setName("Label")
			.setDesc("Specify the Name of your wrapper.")
			.addText((text) => {
				text.setPlaceholder("Emphasis")
					.setValue(this.elementSettings.label)
					.onChange((value) => {});
			});

		new Setting(modalContent)
			.setName("Description")
			.setDesc("Describe the element’s usage and meaning.")
			.addText((text) => {
				text.setPlaceholder("Some brief explanation...")
					.setValue(this.elementSettings.description)
					.onChange((value) => {});
			});

		new Setting(modalContent)
			.setName("Enabled")
			.setDesc("Should the tag be enabled?")
			.addToggle((toggle) => {
				toggle
					.setValue(this.elementSettings.isEnabled)
					.onChange(async (value) => {
						this.elementSettings.isEnabled = value;
					});
			});

		new Setting(modalContent)
			.setName("Opening sequence")
			.setDesc(
				"What characters should mark the beginning of the element?"
			)
			.addText((text) => {
				text.setPlaceholder("**")
					.setValue(this.elementSettings.openingSequence)
					.onChange((value) => {});
			});

		new Setting(modalContent)
			.setName("Closing sequence")
			.setDesc("What characters should mark the end of the element?")
			.addText((text) => {
				text.setPlaceholder("**")
					.setValue(this.elementSettings.closingSequence)
					.onChange((value) => {});
			});

		new Setting(modalContent)
			.setName("HTML tag")
			.setDesc("What HTML tag should be used.")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("a", "<a></a>")
					.addOption("cite", "<cite></cite>")
					.addOption("code", "<code></code>")
					.addOption("del", "<del></del>")
					.addOption("div", "<div></div>")
					.addOption("em", "<em></em>")
					.addOption("ins", "<ins></ins>")
					.addOption("small", "<small></small>")
					.addOption("span", "<span></span>")
					.addOption("strong", "<strong></strong>")
					.addOption("sub", "<sub></sub>")
					.addOption("sup", "<sup></sup>")
					.setValue(this.elementSettings.htmlTag);
			});

		new Setting(modalContent)
			.setName("Inline CSS")
			.setDesc("Optional CSS properties.")
			.addText((text) => {
				text.setPlaceholder("color:red;user-select:none;")
					.setValue(this.elementSettings.htmlStyle)
					.onChange((value) => {});
			});

		new Setting(modalContent)
			.setName("Custom classes")
			.setDesc("Space-separated list of additional classes.")
			.addText((text) => {
				text.setPlaceholder("color:red;user-select:none;")
					.setValue(this.elementSettings.htmlClasses)
					.onChange((value) => {});
			});

		modalContent.createEl("hr");

		const btnDiv = modalContent.createDiv();
		const btnCancel = createEl("button", { text: "Cancel" });
		const btnSave = createEl("button", { text: "Save", cls: "mod-cta" });

		btnDiv.style.display = "flex";
		btnDiv.style.justifyContent = "flex-end";
		btnDiv.appendChild(btnCancel);
		btnDiv.appendChild(btnSave);
	}

	onClose() {
		const { containerEl } = this;
		containerEl.empty();
	}
}
