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
                paddingX: '.625rem',
                paddingY: '.5rem'
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
        inputtext: {
            root: {
                paddingY: '.5rem'
            }
        },
        multiselect: {
            root: {
                paddingY: '.375rem'
            }
        },
        panel: {
            content: {
                padding: '.65rem 1.125rem'
            }
        },
        radiobutton: {
            root: {
                width: '1.25rem',
                height: '1.25rem',
                checkedBackground: '#016294'
            }
        },
        select: {
            root: {
                paddingY: '.375rem'
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
