
This folder stores images used by the app (logo, icons, backgrounds).

Included placeholders (SVG):
- `logo.svg`    : simple header/logo placeholder
- `avatar.svg`  : simple avatar placeholder

Suggested additional files to add:
- `logo.png`    : high-resolution PNG logo (optional)
- `avatar.jpg`  : user avatar (optional)
- `icon-*.png`  : small icons for menu items (optional)

Place image files here and then import them with (adjust relative path):

```
import Logo from '../../assets/images/logo.svg';
import Avatar from '../../assets/images/avatar.svg';
```

Notes:
- The SVG placeholders are plain text SVG files. To render them in React Native you can:
	- Use `react-native-svg` and `react-native-svg-transformer` to import SVGs as components, or
	- Convert the SVG to PNG and import as an Image, or
	- Use them in a WebView if appropriate.
- If you want, I can add PNG placeholders instead — tell me if you prefer PNG.
