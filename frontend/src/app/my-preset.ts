import { definePreset, palette } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const MyPreset = definePreset(Lara, {
    semantic: {
        primary: palette('#0173ae') as any
    }
});

export default MyPreset;
