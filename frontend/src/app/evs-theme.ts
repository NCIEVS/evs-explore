import { definePreset, palette } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const EvsTheme = definePreset(Lara, {
    semantic: {
        primary: palette('#1c5e86') as any
    },
    components: {
        button: {
            root: {
                roundedBorderRadius: '.375rem',
                borderRadius: '.125rem',
                paddingX: '.375rem',
                paddingY: '.325rem',
                label: {
                    fontWeight: '400'
                }
            }
        },
        datatable: {
            bodyCell: {
                padding: '.15rem .25rem',
            },
            headerCell: {
                padding: '.15rem .25rem'
            },
            root: {
                borderColor: '#d4d4d4',
            },
            paginatorTop: {
                borderColor: '#d4d4d4',
                borderWidth: '1px'
            }
        },
        inputtext: {
            root: {
                // paddingX: '.375rem',
                paddingY: '.25rem',
                borderRadius: '.125rem'
            }
        },
        multiselect: {
            root: {
                paddingY: '.25rem',
                borderRadius: '.125rem'
            }
        },
        paginator: {
            root: {
                padding: '.25rem .5rem'
            },
            navButton: {
                borderRadius: '.125rem',
                width: '2.125rem',
                height: '2.125rem'
            }
        },
        panel: {
            content: {
                padding: '.65rem 1.125rem',
            },
            header: {
                background: '#ebebec'
            }
        },
        radiobutton: {
            root: {
                width: '1.25rem',
                height: '1.25rem'
            }
        },
        select: {
            root: {
                paddingY: '.25rem',
                borderRadius: '.125rem'
            }
        },
        toolbar: {
            root: {
                padding: '.3rem .75rem',
                borderRadius: '0px'
            }
        },
        treetable: {
            bodyCell: {
                borderColor: '#d4d4d4',
                padding: '.15rem .15rem'
            },
        },
    }
});

export default EvsTheme;
