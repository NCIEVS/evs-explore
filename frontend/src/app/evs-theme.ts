import { definePreset, palette } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const EvsTheme = definePreset(Lara, {
    semantic: {
        primary: palette('#0173ae') as any
    },
    options: {
        darkModeSelector: '.my-app-dark'
    }
});

export default EvsTheme;
