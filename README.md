# Obsidian Extended Syntax Plugin

This is a plugin for Obsidian (https://obsidian.md) adding support for non-standard Markdown syntax for less needed and/or more rare inline features.

The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

At the moment, the plugin by default adds the following elements:
- insertion: `++added text++` as <ins style="color:green">added text</ins>
- subscript: `H~2~O` as H<sub>2</sub>O
- superscript: `a^2^` as a<sup>2</sup>
- small caps: `^^Small Caps^^` as <span style="font-variant:small-caps">Small Caps</span>
- Centered text: `->center<-` as:
  <center>center</center>
- “Discord-style” spoiler tag: `||spoiler||` rendered as a “censored” text

> **Note**  
> **Compatibility with other Markdown flavours:** All currently implemented tokens with the sole exception of Discord-style spoiler, can be safely replaced with a corresponding HTML notation and inline styles.

> **Warning**  
> At the time of developing this project, the Obsidian API is still in early alpha and is subject to change at any time!

## Development

- Clone this repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/obsidian-extended-syntax` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `src/main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Manual installation

- Create an empty folder (named for example `obsidian-extended-syntax`) in your `VaultFolder/.obsidian/plugins/` folder.
- Copy over the compiled `main.js`, `styles.css`, `manifest.json` to the created folder.

## TODO

- [ ] Add full support for nested Markdown and HTML.
- [ ] Add *Live Preview* support.
- [ ] Add settings for customization.
- [ ] Add export to sanitized HTML.
- [ ] Fix compatibility of spoiler tag with the Obsidian-native mark.

# Recommoneded plugins

- [Obsidian Emoji Shortcodes by phibr0][obsidian-emoji-shortcodes]

[obsidian-emoji-shortcodes]: https://github.com/phibr0/obsidian-emoji-shortcodes
