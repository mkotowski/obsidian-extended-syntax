import { InlineSyntaxSettings } from "./settings";

export function emitEvent(type: string, detail = {}) {
	// Make sure there’s an event type
	if (!type) return;

	// Create a new event
	const event = new CustomEvent(type, {
		bubbles: true,
		cancelable: true,
		detail: detail,
	});

	// Dispatch the event
	return dispatchEvent(event);
}

export interface InlineSyntaxEditedEventDetail {
	originalSettings: InlineSyntaxSettings;
	editedSettings: InlineSyntaxSettings;
}

export interface InlineSyntaxRemovedEventDetail {
	originalSettings: InlineSyntaxSettings;
}

export interface InlineSyntaxAddedEventDetail {
	newSettings: InlineSyntaxSettings;
}
