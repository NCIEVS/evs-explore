import { definePreset, palette } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const EvsTheme = definePreset(Lara, {
    semantic: {
        primary: palette('#016294') as any
    },
    components: {
        button: {
            root: {
                roundedBorderRadius: '.375rem',
                borderRadius: '.375rem',
                paddingX: '.725rem',
                paddingY: '.580rem'
            }
        },
        datatable: {
            bodyCell: {
                padding: '.25rem .5rem',
                
            },
            headerCell: {
                borderColor: '#d1d1d1'
            },
            root: {
                borderColor: '#d1d1d1',
            }
        },
        panel: {
            content: {
                padding: '.65rem 1.125rem'
            }
        },
        toolbar: {
            root: {
                padding: '.575rem .75rem',
                borderRadius: '0px'
            }
        },
        treetable: {
            bodyCell: {
                borderColor: '#D5D5D5'
            }
        },
    }
});

export default EvsTheme;
