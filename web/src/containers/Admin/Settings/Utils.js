import { validateRequired, email, urlCheck } from '../../../components/AdminForm/validations';
import LANGUAGES from '../../../config/languages';

export const generateAdminSettings = (key) => {
    if (key === 'links') {
        return {
            twitter_instagram: {
                fields: {
                    twitter: {
                        type: 'input',
                        label: 'Twitter',
                        placeholder: 'twitter URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    instagram: {
                        type: 'input',
                        label: 'Instagram',
                        placeholder: 'instagram URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            telegram_facebook: {
                fields: {
                    telegram: {
                        type: 'input',
                        label: 'Telegram',
                        placeholder: 'telegram URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    facebook: {
                        type: 'input',
                        label: 'Facebook',
                        placeholder: 'facebook URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            linkedin_github: {
                fields: {
                    linkedin: {
                        type: 'input',
                        label: 'Linkedin',
                        placeholder: 'linkedin URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    github: {
                        type: 'input',
                        label: 'Github',
                        placeholder: 'github URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            contact_helpdesk: {
                fields: {
                    contact: {
                        type: 'input',
                        label: 'Contact',
                        placeholder: 'contact URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    helpdesk: {
                        type: 'input',
                        label: 'Helpdesk',
                        placeholder: 'helpdesk URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            terms_privacy: {
                fields: {
                    terms: {
                        type: 'input',
                        label: 'Terms',
                        placeholder: 'terms URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    privacy: {
                        type: 'input',
                        label: 'Privacy',
                        placeholder: 'privacy URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            api_whitepaper: {
                fields: {
                    api: {
                        type: 'input',
                        label: 'API',
                        placeholder: 'api URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    whitepaper: {
                        type: 'input',
                        label: 'Whitepaper',
                        placeholder: 'whitepaper URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            website_information: {
                fields: {
                    website: {
                        type: 'input',
                        label: 'Website',
                        placeholder: 'website URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    information: {
                        type: 'input',
                        label: 'Information',
                        placeholder: 'information URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            youtube: {
                fields: {
                    youtube: {
                        type: 'input',
                        label: 'Youtube',
                        placeholder: 'YouTube URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                },
            },
        }
    } else if (key === 'security') {
        return {
            admin_whitelist: {
                type: 'select',
                mode: 'tags',
                label: 'Admin Whitelist IPs',
                placeholder: 'Admin whitelist',
                tokenSeparators: [',', ' ', '   ']
            },
            allowed_domains: {
                type: 'select',
                mode: 'tags',
                label: 'Allowed domains',
                placeholder: 'Allowed domains',
                tokenSeparators: [',', ' ', '   ']
            },
            site_key: {
                type: 'input',
                label: 'Captcha site key (Google ReCaptcha V3)',
                placeholder: 'Captcha site key (Google ReCaptcha V3)'
            },
            secret_key: {
                type: 'input',
                label: 'Captcha secret key (Google ReCaptcha V3)',
                placeholder: 'Captcha secret key (Google ReCaptcha V3)'
            }
        };
    } else if (key === 'email') {
        return {
            email_distribution_list: {
                audit: {
                    type: 'input',
                    label: 'Auditor email',
                    placeholder: 'auditor email address',
                    validate: [validateRequired, email]
                }
            },
            email_configuration: {
                sender: {
                    type: 'input',
                    label: 'Sender email (appears in the emails sent to the user as sender)',
                    placeholder: 'Sender email',
                    validate: [validateRequired, email]
                },
                send_email_to_support: {
                    type: 'checkbox',
                    label: 'send email to support',
                    // placeholder: 'send email to support',
                    // validate: [validateRequired]
                },
                timezone: {
                    type: 'select',
                    label: 'Email timezone',
                    placeholder: 'Select email timezone',
                    validate: [validateRequired],
                    options: minimalTimezoneSet
                },
                server: {
                    type: 'input',
                    label: 'SMTP server',
                    placeholder: 'SMTP sever',
                    validate: [validateRequired]
                },
                port: {
                    type: 'input',
                    label: 'SMTP port',
                    placeholder: 'SMTP port',
                    validate: [validateRequired]
                },
                user: {
                    type: 'input',
                    label: 'SMTP username',
                    placeholder: 'SMTP username',
                    validate: [validateRequired]
                },
                password: {
                    type: 'password',
                    label: 'SMTP password',
                    placeholder: 'SMTP password',
                    validate: [validateRequired]
                }
            }
        };
    } else {
        return {
            api_name: {
                type: 'input',
                label: 'Exchange Name',
                placeholder: 'Exchange Name',
                validate: [validateRequired]
            },
            title: {
                type: 'input',
                label: 'Title',
                placeholder: 'Title',
                validate: [validateRequired]
            },
            description: {
                type: 'textarea',
                label: 'Description',
                placeholder: 'Description',
                validate: [validateRequired]
            },
            new_user_is_activated: {
                type: 'checkbox',
                label: 'Allow new signups (If disabled new users can\'t signup on the platform)',
                // placeholder: 'New user is activated',
                // validate: [validateRequired]
            },
            language: {
                type: 'select',
                label: 'Default Language',
                placeholder: 'Select default language',
                validate: [validateRequired],
                options: LANGUAGES
            },
            valid_languages: {
                type: 'select',
                label: 'Valid languages',
                placeholder: 'Valid languages',
                validate: [validateRequired],
                multiSelect: true,
                options: LANGUAGES
            },
            theme: {
                type: 'select',
                label: 'Default Theme',
                placeholder: 'Select default theme',
                validate: [validateRequired],
                options: [
                    { label: 'White', value: 'white' },
                    { label: 'Dark', value: 'dark' }
                ]
            },
            logo_path: {
                type: 'input',
                label: 'Logo (Dark Color)',
                placeholder: 'Insert the logo path',
                validate: [validateRequired, urlCheck]
            },
            logo_black_path: {
                type: 'input',
                label: 'Logo (Light Color)',
                placeholder: 'Insert the logo path',
                validate: [validateRequired, urlCheck]
            }
        };
    }
};

export const getThemeFields = (formValues = {}, renderPrefix, formKey = 'miscellaneous', coins) => {
    const data = {
        miscellaneous: {
            0: {
                'colors-main-black': {
                    type: 'input',
                    label: 'colors-main-black',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-main-black'])
                },
                'colors-white': {
                    type: 'input',
                    label: 'colors-white',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-white'])
                },
            },
           
            2: {
                'colors-deactivate': {
                    type: 'input',
                    label: 'colors-deactivate',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-deactivate'])
                },
                'colors-deactivate-color1': {
                    type: 'input',
                    label: 'colors-deactivate-color1',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-deactivate-color1'])
                },
            },
            3: {
                'colors-deactivate-color2': {
                    type: 'input',
                    label: 'colors-deactivate-color2',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-deactivate-color2'])
                },
                'colors-deactivate-color3': {
                    type: 'input',
                    label: 'colors-deactivate-color3',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-deactivate-color3'])
                },
            },
            4: {
                'colors-deactivate-color4': {
                    type: 'input',
                    label: 'colors-deactivate-color4',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-deactivate-color4'])
                },
                'colors-notifications-red': {
                    type: 'input',
                    label: 'colors-notifications-red',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-notifications-red'])
                },
            },
            5: {
                'colors-notification-inactive-red': {
                    type: 'input',
                    label: 'colors-notification-inactive-red',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-notification-inactive-red'])
                },
                'colors-notifications-blue': {
                    type: 'input',
                    label: 'colors-notifications-blue',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-notifications-blue'])
                },
            },
            6: {
                'colors-notifications-green': {
                    type: 'input',
                    label: 'colors-notifications-green',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-notifications-green'])
                },
                'color-currency-eur--main': {
                    type: 'input',
                    label: 'color-currency-eur--main',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['color-currency-eur--main'])
                },
            },
            7: {
                'color-currency-eur--secondary': {
                    type: 'input',
                    label: 'color-currency-eur--secondary',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['color-currency-eur--secondary'])
                },
                'color-currency-btc--main': {
                    type: 'input',
                    label: 'color-currency-btc--main',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['color-currency-btc--main'])
                },
            },
            8: {
                'color-currency-btc--secondary': {
                    type: 'input',
                    label: 'color-currency-btc--secondary',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['color-currency-btc--secondary'])
                },
                'colors-currencies-eur': {
                    type: 'input',
                    label: 'colors-currencies-eur',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-currencies-eur'])
                },
            },
            9: {
                'colors-currencies-btc': {
                    type: 'input',
                    label: 'colors-currencies-btc',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-currencies-btc'])
                },
                'dark-app-bar-add-tab-menu-background': {
                    type: 'input',
                    label: 'dark-app-bar-add-tab-menu-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-bar-add-tab-menu-background'])
                },
            },
            10: {
                'dark-app-bar-tab-active-menu-list-background': {
                    type: 'input',
                    label: 'dark-app-bar-tab-active-menu-list-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-bar-tab-active-menu-list-background'])
                },
                'app-bar-menu-list-color': {
                    type: 'input',
                    label: 'app-bar-menu-list-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar-menu-list-color'])
                },
            },
            11: {
                'app-bar-icon-inactive': {
                    type: 'input',
                    label: 'app-bar-icon-inactive',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar-icon-inactive'])
                },
                'app-bar--quicktrade-active-color': {
                    type: 'input',
                    label: 'app-bar--quicktrade-active-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar--quicktrade-active-color'])
                },
            },
            12: {
                'app-bar--quicktrade-inactive-color': {
                    type: 'input',
                    label: 'app-bar--quicktrade-inactive-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar--quicktrade-inactive-color'])
                },
                'app-bar-pairs-up': {
                    type: 'input',
                    label: 'app-bar-pairs-up',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar-pairs-up'])
                },
            },
            13: {
                'app-bar-pairs-down': {
                    type: 'input',
                    label: 'app-bar-pairs-down',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar-pairs-down'])
                },
                'dark-app-bar-pairs-up': {
                    type: 'input',
                    label: 'dark-app-bar-pairs-up',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-bar-pairs-up'])
                },
            },
            14: {
                'dark-app-bar-pairs-down': {
                    type: 'input',
                    label: 'dark-app-bar-pairs-down',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-bar-pairs-down'])
                }
            }
        },
        light: {
            1: {
                'app-background-color': {
                    type: 'input',
                    label: 'app-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-background-color'])
                },
                'app-light-background': {
                    type: 'input',
                    label: 'app-light-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-light-background'])
                },
            },
            2: {
                'app-sidebar-background': {
                    type: 'input',
                    label: 'app-sidebar-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-sidebar-background'])
                },
                'auth-container-background': {
                    type: 'input',
                    label: 'auth-container-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['auth-container-background'])
                },
            },
            3: {
                'quick-trade-background': {
                    type: 'input',
                    label: 'quick-trade-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['quick-trade-background'])
                },
                'quick-trade-container': {
                    type: 'input',
                    label: 'quick-trade-container',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['quick-trade-container'])
                },
            },
            4: {
                'app-modal-background': {
                    type: 'input',
                    label: 'app-modal-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-modal-background'])
                },
                'app-bar-background-color': {
                    type: 'input',
                    label: 'app-bar-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-bar-background-color'])
                },
            },
            5: {
                'app-line-divider': {
                    type: 'input',
                    label: 'app-line-divider',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-line-divider'])
                },
                'box-fields': {
                    type: 'input',
                    label: 'box-fields',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['box-fields'])
                },
            },
            6: {
                'buy': {
                    type: 'input',
                    label: 'buy',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['buy'])
                },
                'sell': {
                    type: 'input',
                    label: 'sell',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['sell'])
                },
            },
            7: {
                'color-sell-btc-light': {
                    type: 'input',
                    label: 'color-sell-btc-light',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['color-sell-btc-light'])
                },
                'link': {
                    type: 'input',
                    label: 'link',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['link'])
                },
            },
            8: {
                'trade-fields': {
                    type: 'input',
                    label: 'trade-fields',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['trade-fields'])
                },
                'trade-fields-border': {
                    type: 'input',
                    label: 'trade-fields-border',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['trade-fields-border'])
                },
            },
            9: {
                'trade-fill-indicator': {
                    type: 'input',
                    label: 'trade-fill-indicator',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['trade-fill-indicator'])
                },
                'trade-fill-indicator-text': {
                    type: 'input',
                    label: 'trade-fill-indicator-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['trade-fill-indicator-text'])
                },
            },
            10: {
                'buy-bids-text': {
                    type: 'input',
                    label: 'buy-bids-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['buy-bids-text'])
                },
                'sell-bids-text': {
                    type: 'input',
                    label: 'sell-bids-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['sell-bids-text'])
                },
            },
            11: {
                'app-logo-color': {
                    type: 'input',
                    label: 'app-logo-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['app-logo-color'])
                },
                'sidebar-border--color': {
                    type: 'input',
                    label: 'sidebar-border--color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['sidebar-border--color'])
                },
            },
            12: {
                'border-color': {
                    type: 'input',
                    label: 'border-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['border-color'])
                },
                'border-main': {
                    type: 'input',
                    label: 'border-main',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['border-main'])
                },
            },
            13: {
                'form-color-underline-focus': {
                    type: 'input',
                    label: 'form-color-underline-focus',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-color-underline-focus'])
                },
                'form-color-underline': {
                    type: 'input',
                    label: 'form-color-underline',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-color-underline'])
                },
            },
            14: {
                'form-color-placeholder': {
                    type: 'input',
                    label: 'form-color-placeholder',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-color-placeholder'])
                },
                'form-arrow': {
                    type: 'input',
                    label: 'form-arrow',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-arrow'])
                },
            },
            15: {
                'form-label': {
                    type: 'input',
                    label: 'form-label',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-label'])
                },
                'form-text-disabled': {
                    type: 'input',
                    label: 'form-text-disabled',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['form-text-disabled'])
                },
            },
            16: {
                'colors-terms-background': {
                    type: 'input',
                    label: 'colors-terms-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-terms-background'])
                },
                'tab-active': {
                    type: 'input',
                    label: 'tab-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tab-active'])
                },
            },
            17: {
                'tab-inactive': {
                    type: 'input',
                    label: 'tab-inactive',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tab-inactive'])
                },
                'sidebar-color': {
                    type: 'input',
                    label: 'sidebar-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['sidebar-color'])
                },
            },
            18: {
                'sidebar-color-active': {
                    type: 'input',
                    label: 'sidebar-color-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['sidebar-color-active'])
                },
                'info-panel-background': {
                    type: 'input',
                    label: 'info-panel-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['info-panel-background'])
                },
            },
            19: {
                'info-panel-text': {
                    type: 'input',
                    label: 'info-panel-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['info-panel-text'])
                },
                'icon-hover': {
                    type: 'input',
                    label: 'icon-hover',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['icon-hover'])
                },
            },
            20: {
                'icon-unhover': {
                    type: 'input',
                    label: 'icon-unhover',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['icon-unhover'])
                },
                'trade-tabs-inactive-color': {
                    type: 'input',
                    label: 'trade-tabs-inactive-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['trade-tabs-inactive-color'])
                },
            },
            21: {
                'footer-background-color': {
                    type: 'input',
                    label: 'footer-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['footer-background-color'])
                },
                'chat-message-background-even': {
                    type: 'input',
                    label: 'chat-message-background-even',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['chat-message-background-even'])
                },
            },
            22: {
                'chat-message-background-odd': {
                    type: 'input',
                    label: 'chat-message-background-odd',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['chat-message-background-odd'])
                },
                'chat-message-color': {
                    type: 'input',
                    label: 'chat-message-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['chat-message-color'])
                },
            },
            23: {
                'chat-box-border': {
                    type: 'input',
                    label: 'chat-box-border',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['chat-box-border'])
                },
                'history-color-buy': {
                    type: 'input',
                    label: 'history-color-buy',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['history-color-buy'])
                },
            },
            24: {
                'history-color-sell': {
                    type: 'input',
                    label: 'history-color-sell',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['history-color-sell'])
                },
                'colors-username-set-dark': {
                    type: 'input',
                    label: 'colors-username-set-dark',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['colors-username-set-dark'])
                },
            },
            25: {
                tradingViewWaterMark: {
                    type: 'input',
                    label: 'trading-view-water-mark',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewWaterMark'])
                },
                tradingViewAxis: {
                    type: 'input',
                    label: 'trading-view-axis',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewAxis'])
                },
            },
            26: {
                tradingViewText: {
                    type: 'input',
                    label: 'trading-view-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewText'])
                }
            }
        },
        dark: {
            1: {
                'dark-app-background-color': {
                    type: 'input',
                    label: 'dark-app-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-background-color'])
                },
                'dark-app-light-background': {
                    type: 'input',
                    label: 'dark-app-light-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-light-background'])
                },
            },
            2: {
                'dark-app-sidebar-background': {
                    type: 'input',
                    label: 'dark-app-sidebar-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-sidebar-background'])
                },
                'dark-auth-container-background': {
                    type: 'input',
                    label: 'dark-auth-container-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-auth-container-background'])
                },
            },
            3: {
                'dark-quick-trade-background': {
                    type: 'input',
                    label: 'dark-quick-trade-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-quick-trade-background'])
                },
                'dark-quick-trade-container': {
                    type: 'input',
                    label: 'dark-quick-trade-container',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-quick-trade-container'])
                },
            },
            4: {
                'dark-app-modal-background': {
                    type: 'input',
                    label: 'dark-app-modal-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-modal-background'])
                },
                'dark-app-bar-background-color': {
                    type: 'input',
                    label: 'dark-app-bar-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-bar-background-color'])
                },
            },
            5: {
                'dark-app-line-divider': {
                    type: 'input',
                    label: 'dark-app-line-divider',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-line-divider'])
                },
                'dark-box-fields': {
                    type: 'input',
                    label: 'dark-box-fields',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-box-fields'])
                },
            },
            6: {
                'dark-buy': {
                    type: 'input',
                    label: 'dark-buy',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-buy'])
                },
                'dark-sell': {
                    type: 'input',
                    label: 'dark-sell',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-sell'])
                },
            },
            7: {
                'dark-color-sell-btc-light': {
                    type: 'input',
                    label: 'dark-color-sell-btc-light',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-color-sell-btc-light'])
                },
                'dark-link': {
                    type: 'input',
                    label: 'dark-link',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-link'])
                },
            },
            8: {
                'dark-trade-fields': {
                    type: 'input',
                    label: 'dark-trade-fields',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-trade-fields'])
                },
                'dark-trade-fields-border': {
                    type: 'input',
                    label: 'dark-trade-fields-border',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-trade-fields-border'])
                },
            },
            9: {
                'dark-trade-fill-indicator': {
                    type: 'input',
                    label: 'dark-trade-fill-indicator',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-trade-fill-indicator'])
                },
                'dark-buy-bids-text': {
                    type: 'input',
                    label: 'dark-buy-bids-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-buy-bids-text'])
                },
            },
            10: {
                'dark-sell-asks-text': {
                    type: 'input',
                    label: 'dark-sell-asks-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-sell-asks-text'])
                },
                'dark-app-logo-color': {
                    type: 'input',
                    label: 'dark-app-logo-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-app-logo-color'])
                },
            },
            11: {
                'dark-border-main': {
                    type: 'input',
                    label: 'dark-border-main',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-border-main'])
                },
                'dark-inactive-color': {
                    type: 'input',
                    label: 'dark-inactive-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-inactive-color'])
                },
            },
            12: {
                'dark-icon-color': {
                    type: 'input',
                    label: 'dark-icon-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-icon-color'])
                },
                'dark-font-main-text-color': {
                    type: 'input',
                    label: 'dark-font-main-text-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-font-main-text-color'])
                },
            },
            13: {
                'dark-font-sub-text-color': {
                    type: 'input',
                    label: 'dark-font-sub-text-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-font-sub-text-color'])
                },
                'dark-font-sub-text-1-color': {
                    type: 'input',
                    label: 'dark-font-sub-text-1-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-font-sub-text-1-color'])
                },
            },
            14: {
                'dark-button-active': {
                    type: 'input',
                    label: 'dark-button-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-button-active'])
                },
                'dark-button-text': {
                    type: 'input',
                    label: 'dark-button-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-button-text'])
                },
            },
            15: {
                'dark-button-disabled': {
                    type: 'input',
                    label: 'dark-button-disabled',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-button-disabled'])
                },
                'dark-button-text-disabled': {
                    type: 'input',
                    label: 'dark-button-text-disabled',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-button-text-disabled'])
                },
            },
            16: {
                'dark-form-color-underline-focus': {
                    type: 'input',
                    label: 'dark-form-color-underline-focus',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-color-underline-focus'])
                },
                'dark-form-color-underline': {
                    type: 'input',
                    label: 'dark-form-color-underline',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-color-underline'])
                },
            },
            17: {
                'dark-form-placeholder': {
                    type: 'input',
                    label: 'dark-form-placeholder',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-placeholder'])
                },
                'dark-form-arrow': {
                    type: 'input',
                    label: 'dark-form-arrow',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-arrow'])
                },
            },
            18: {
                'dark-form-label': {
                    type: 'input',
                    label: 'dark-form-label',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-label'])
                },
                'dark-form-text-disabled': {
                    type: 'input',
                    label: 'dark-form-text-disabled',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-text-disabled'])
                },
            },
            19: {
                'dark-form-text': {
                    type: 'input',
                    label: 'dark-form-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-form-text'])
                },
                'dark-colors-terms-background': {
                    type: 'input',
                    label: 'dark-colors-terms-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-colors-terms-background'])
                },
            },
            20: {
                'dark-tab-active': {
                    type: 'input',
                    label: 'dark-tab-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-tab-active'])
                },
                'dark-tab-inactive': {
                    type: 'input',
                    label: 'dark-tab-inactive',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-tab-inactive'])
                },
            },
            21: {
                'dark-sidebar-color': {
                    type: 'input',
                    label: 'dark-sidebar-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-sidebar-color'])
                },
                'dark-sidebar-color-active': {
                    type: 'input',
                    label: 'dark-sidebar-color-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-sidebar-color-active'])
                },
            },
            22: {
                'dark-info-panel-background': {
                    type: 'input',
                    label: 'dark-info-panel-background',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-info-panel-background'])
                },
                'dar-info-panel-text': {
                    type: 'input',
                    label: 'dar-info-panel-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dar-info-panel-text'])
                },
            },
            23: {
                'dark-icon-hover': {
                    type: 'input',
                    label: 'dark-icon-hover',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-icon-hover'])
                },
                'dark-icon-unhover': {
                    type: 'input',
                    label: 'dark-icon-unhover',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-icon-unhover'])
                },
            },
            24: {
                'dark-tab-notification': {
                    type: 'input',
                    label: 'dark-tab-notification',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-tab-notification'])
                },
                'dark-disabled-main': {
                    type: 'input',
                    label: 'dark-disabled-main',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-disabled-main'])
                },
            },
            25: {
                'dark-disabled-secondary': {
                    type: 'input',
                    label: 'dark-disabled-secondary',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-disabled-secondary'])
                },
                'dark-trade-row-highlight': {
                    type: 'input',
                    label: 'dark-trade-row-highlight',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-trade-row-highlight'])
                },
            },
            26: {
                'dark-accordion-arrow-active': {
                    type: 'input',
                    label: 'dark-accordion-arrow-active',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-accordion-arrow-active'])
                },
                'dark-accordion-arrow-inactive': {
                    type: 'input',
                    label: 'dark-accordion-arrow-inactive',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-accordion-arrow-inactive'])
                },
            },
            27: {
                'dark-footer-background-color': {
                    type: 'input',
                    label: 'dark-footer-background-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-footer-background-color'])
                },
                'dark-chat-message-background-even': {
                    type: 'input',
                    label: 'dark-chat-message-background-even',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-chat-message-background-even'])
                },
            },
            28: {
                'dark-chat-message-background-odd': {
                    type: 'input',
                    label: 'dark-chat-message-background-odd',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-chat-message-background-odd'])
                },
                'dark-chat-message-color': {
                    type: 'input',
                    label: 'dark-chat-message-color',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-chat-message-color'])
                },
            },
            29: {
                'dark-chat-box-border': {
                    type: 'input',
                    label: 'dark-chat-box-border',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['dark-chat-box-border'])
                },
                tradingViewWaterMark: {
                    type: 'input',
                    label: 'trading-view-water-mark',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewWaterMark'])
                },
            },
            30: {
                tradingViewAxis: {
                    type: 'input',
                    label: 'trading-view-axis',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewAxis'])
                },
                tradingViewText: {
                    type: 'input',
                    label: 'trading-view-text',
                    validate: [validateRequired],
                    className: 'w-25 mx-2',
                    prefix: renderPrefix(formValues['tradingViewText'])
                }
            }
        }
    };
    let fields = data[formKey];
    if (formKey === 'dark' || formKey === 'light') {
        const len = Object.keys(fields) ? Object.keys(fields).length : 1;
        Object.keys(coins).forEach((key, index) => {
            let fName = `coin-${key}`;
            if (formKey === 'dark') {
                fName = `dark-${fName}`;
            }
            let fValue = {
                type: 'input',
                label: fName,
                validate: [validateRequired],
                className: 'w-25 mx-2',
                prefix: renderPrefix(formValues[fName])
            };
            if ((index + 1) % 2 !== 0) {
                fields[`${len + (index + 1)}`] = {
                    [fName]: { ...fValue }
                };
            } else {
                let temp = fields[`${len + index}`] || {};
                fields = {
                    ...fields,
                    [`${len + index}`]: {
                        ...temp,
                        [fName]: { ...fValue }
                    }
                }
            }
        });
    }
    return fields;
};

export const initialCommonColors = {
    'colors-main-black': '#212121',
    'colors-white': 'white',
    'colors-black': '#000000',
    'colors-wave-phase-completed': '#808000',
    'colors-deactivate': '#797779',
    'colors-deactivate-color1': '#cccbcb',
    'colors-deactivate-color2': '#777677',
    'colors-deactivate-color3': '#f2f2f3',
    'colors-deactivate-color4': '#f1f2f2',
    'colors-notifications-red': '#ed1c24',
    'colors-notification-inactive-red': '#e26171',
    'colors-notifications-blue': '#0000ff',
    'colors-notifications-green': '#00a651',
    'color-currency-eur--main': '#00a651',
    'color-currency-eur--secondary': '#52c2b8',
    'color-currency-btc--main': '#f15a29',
    'color-currency-btc--secondary': '#f7941e',
    'colors-currencies-eur': '#00a651',
    'colors-currencies-btc': '#f7941e',
    'colors-currencies-bch': '#ec008c',
    'colors-currencies-eth': '#2e3192',
    'colors-currencies-ltc': '#58595b',
    'colors-currencies-xrp': '#2e3192',
    'dark-app-bar-add-tab-menu-background': '#202020',
    'dark-app-bar-tab-active-menu-list-background': '#333333',
    'app-bar-menu-list-color': '#808080',
    'app-bar-icon-inactive': '#808080',
    'app-bar--quicktrade-active-color': '#fff100',
    'app-bar--quicktrade-inactive-color': '#ceac20',
    'app-bar-pairs-up': 'green',
    'app-bar-pairs-down': '#ed1c24',
    'dark-app-bar-pairs-up': '#00A69C',
    'dark-app-bar-pairs-down': '#EE4036',
};

export const initialLightColors = {
    'app-background-color': '#ffffff',
    'app-light-background': '#F2F2F3',
    'app-sidebar-background': 'white',
    'auth-container-background': '#ffffff',
    'quick-trade-background': '#ebf3f1',
    'quick-trade-container': '#ffffff',
    'app-modal-background': '#ddddddbf',
    'app-bar-background-color': '#000000',
    'app-line-divider': '#212121',
    'box-fields': '#f0f1f1',
    'buy': '#6496AA',
    'sell': '#000000',
    'color-sell-btc-light': '#000000',
    'link': '#0000ff',
    'trade-fields': '#cccbcb',
    'trade-fields-border': '#212121',
    'trade-fill-indicator': '#000000',
    'trade-fill-indicator-text': '#878787',
    'buy-bids-text': '#000000',
    'sell-bids-text': '#ffffff',
    'app-logo-color': '#ffffff',
    'sidebar-border--color': '#797779',
    'border-color': '#777677',
    'border-main': '#212121',
    'form-color-underline-focus': '#212121',
    'form-color-underline': '#cccbcb',
    'form-color-placeholder': '#cccbcb',
    'form-arrow': '#212121',
    'form-label': '#777677',
    'form-text-disabled': '#797779',
    'colors-terms-background': '#f7f7f7',
    'tab-active': '#212121',
    'tab-inactive': '#777677',
    'sidebar-color': '#777677',
    'sidebar-color-active': '#212121',
    'info-panel-background': '#f5f5f5',
    'info-panel-text': '#777677',
    'icon-hover': '#212121',
    'icon-unhover': '#777677',
    'trade-tabs-inactive-color': '#808080',
    'footer-background-color': '#000000',
    'chat-message-background-even': '#f0f1f1',
    'chat-message-background-odd': '#e6e6e6',
    'chat-message-color': '#4f4f4f',
    'chat-box-border': '#f0f1f1',
    'history-color-buy': '#d1d4dc',
    'history-color-sell': '#000000',
    'colors-username-set-dark': '#ff4bb6',
    'tradingViewWaterMark': '#202020',
    'tradingViewAxis': '#E6ECEF',
    'tradingViewText': '#292b2c'
};

export const initialLightCoins = {
    'coin-eur': '#06773d',
    'coin-eur-text': '#ffffff',
    'coin-usd': '#01592e',
    'coin-usd-text': '#ffffff',
    'coin-jpy': '#e0dfc7',
    'coin-jpy-text': '#000000',
    'coin-gbp': '#482e6e',
    'coin-gbp-text': '#ffffff',
    'coin-chf': '#ed1c24',
    'coin-chf-text': '#ffffff',
    'coin-cad': '#d7ce58',
    'coin-cad-text': '#000000',
    'coin-aud': '#19441f',
    'coin-aud-text': '#ffffff',
    'coin-nzd': '#b3498c',
    'coin-nzd-text': '#ffffff',
    'coin-zar': '#d8d3a0',
    'coin-zar-text': '#000000',
    'coin-hkd': '#f48f9b',
    'coin-hkd-text': '#000000',
    'coin-krw': '#f9ee02',
    'coin-krw-text': '#000000',
    'coin-cny': '#ec008c',
    'coin-cny-text': '#ffffff',
    'coin-sgd': '#720f15',
    'coin-sgd-text': '#ffffff',
    'coin-btc': '#f7941d',
    'coin-btc-text': '#000000',
    'coin-eth': '#3e4ea1',
    'coin-eth-text': '#ffffff',
    'coin-ltc': '#bcbec0',
    'coin-ltc-text': '#000000',
    'coin-bch': '#8dc541',
    'coin-bch-text': '#000000',
    'coin-xrp': '#414042',
    'coin-xrp-text': '#ffffff',
    'coin-xht': '#000000',
    'coin-xht-text': '#ffffff',
    'coin-eos': '#58595b',
    'coin-eos-text': '#ffffff',
    'coin-bnb': '#f1ba2a',
    'coin-bnb-text': '#000000',
    'coin-link': '#1b75bc',
    'coin-link-text': '#ffffff',
    'coin-trx': '#a22d25',
    'coin-trx-text': '#ffffff',
    'coin-ada': '#3667b2',
    'coin-ada-text': '#ffffff',
    'coin-matic': '#2aaae2',
    'coin-matic-text': '#ffffff',
    'coin-neo': '#bcbec0',
    'coin-neo-text': '#000000',
    'coin-etc': '#009444',
    'coin-etc-text': '#000000',
    'coin-xlm': '#808285',
    'coin-xlm-text': '#ffffff',
    'coin-xmr': '#f15a29',
    'coin-xmr-text': '#ffffff',
    'coin-zec': '#fbb040',
    'coin-zec-text': '#000000',
    'coin-one': '#939598',
    'coin-one-text': '#ffffff',
    'coin-pax': '#163526',
    'coin-pax-text': '#ffffff',
    'coin-usdc': '#4d7d91',
    'coin-usdc-text': '#ffffff',
    'coin-usdt': '#2bb673',
    'coin-usdt-text': '#ffffff',
    'coin-vet': '#454c7d',
    'coin-vet-text': '#ffffff',
    'coin-btt': '#c49a6c',
    'coin-btt-text': '#ffffff',
    'coin-qtum': '#96daf7',
    'coin-qtum-text': '#000000',
    'coin-algo': '#594a42',
    'coin-algo-text': '#ffffff',
    'coin-rvn': '#662d91',
    'coin-rvn-text': '#ffffff',
    'coin-iota': '#603913',
    'coin-iota-text': '#ffffff',
    'coin-dash': '#417ec1',
    'coin-dash-text': '#ffffff',
    'coin-bsv': '#a09032',
    'coin-bsv-text': '#ffffff',
    'coin-ont': '#00a79d',
    'coin-ont-text': '#ffffff',
    'coin-atom': '#796184',
    'coin-atom-text': '#ffffff',
    'coin-celr': '#726658',
    'coin-celr-text': '#ffffff',
    'coin-omg': '#8e7fbb',
    'coin-omg-text': '#ffffff',
    'coin-hot': '#8b5e3c',
    'coin-hot-text': '#ffffff'
};

export const initialDarkColors = {
    'dark-app-background-color': '#202020',
    'dark-app-light-background': '#2b2b2b',
    'dark-app-sidebar-background': '#333333',
    'dark-auth-container-background': '#333333',
    'dark-quick-trade-background': '#202020',
    'dark-quick-trade-container': '#333333',
    'dark-app-modal-background': '#231f2080',
    'dark-app-bar-background-color': '#0f1114',
    'dark-app-line-divider': '#535353',
    'dark-box-fields': '#353841',
    'dark-buy': '#00A69C',
    'dark-sell': '#EE4036',
    'dark-color-sell-btc-light': '#EE4036',
    'dark-link': '#0066B4',
    'dark-trade-fields': '#191919',
    'dark-trade-fields-border': '#2B2B2B',
    'dark-trade-fill-indicator': '#444162',
    'dark-buy-bids-text': '#000000',
    'dark-sell-asks-text': '#ffffff',
    'dark-app-logo-color': '#ffffff',
    'dark-border-main': '#535353',
    'dark-inactive-color': '#2e2f37',
    'dark-icon-color': '#ffffff',
    'dark-font-main-text-color': '#ffffff',
    'dark-font-sub-text-color': '#808080',
    'dark-font-sub-text-1-color': '#808080',
    'dark-button-active': '#0066B4',
    'dark-button-text': '#ffffff',
    'dark-button-disabled': '#333333',
    'dark-button-text-disabled': '#535353',
    'dark-form-color-underline-focus': '#ffffff',
    'dark-form-color-underline': '#535353',
    'dark-form-placeholder': '#808080',
    'dark-form-arrow': '#535353',
    'dark-form-label': '#ffffff',
    'dark-form-text-disabled': '#2e2f37',
    'dark-form-text': '#808080',
    'dark-colors-terms-background': '#191919',
    'dark-tab-active': '#ffffff',
    'dark-tab-inactive': '#808080',
    'dark-sidebar-color': '#808080',
    'dark-sidebar-color-active': '#ffffff',
    'dark-info-panel-background': '#353841',
    'dar-info-panel-text': '#808080',
    'dark-icon-hover': '#ffffff',
    'dark-icon-unhover': '#808080',
    'dark-tab-notification': '#0066B4',
    'dark-disabled-main': '#2e2f37',
    'dark-disabled-secondary': '#2e2f37',
    'dark-trade-row-highlight': '#535353',
    'dark-accordion-arrow-active': '#ffffff',
    'dark-accordion-arrow-inactive': '#808080',
    'dark-footer-background-color': '#0f1114',
    'dark-chat-message-background-even': '#202020',
    'dark-chat-message-background-odd': '#333333',
    'dark-chat-message-color': '#98CCB2',
    'dark-chat-box-border': '#2B2B2B',
    'tradingViewWaterMark': '#808080',
    'tradingViewAxis': '#535353',
    'tradingViewText': '#808080'
};

export const initialDarkCoins = {
    'dark-coin-eur': '#06773d',
    'dark-coin-eur-text': '#ffffff',
    'dark-coin-usd': '#01592e',
    'dark-coin-usd-text': '#ffffff',
    'dark-coin-jpy': '#e0dfc7',
    'dark-coin-jpy-text': '#000000',
    'dark-coin-gbp': '#482e6e',
    'dark-coin-gbp-text': '#ffffff',
    'dark-coin-chf': '#ed1c24',
    'dark-coin-chf-text': '#ffffff',
    'dark-coin-cad': '#d7ce58',
    'dark-coin-cad-text': '#000000',
    'dark-coin-aud': '#19441f',
    'dark-coin-aud-text': '#ffffff',
    'dark-coin-nzd': '#b3498c',
    'dark-coin-nzd-text': '#ffffff',
    'dark-coin-zar': '#d8d3a0',
    'dark-coin-zar-text': '#000000',
    'dark-coin-hkd': '#f48f9b',
    'dark-coin-hkd-text': '#000000',
    'dark-coin-krw': '#f9ee02',
    'dark-coin-krw-text': '#000000',
    'dark-coin-cny': '#ec008c',
    'dark-coin-cny-text': '#ffffff',
    'dark-coin-sgd': '#720f15',
    'dark-coin-sgd-text': '#ffffff',
    'dark-coin-btc': '#f7941d',
    'dark-coin-btc-text': '#000000',
    'dark-coin-eth': '#3e4ea1',
    'dark-coin-eth-text': '#ffffff',
    'dark-coin-ltc': '#bcbec0',
    'dark-coin-ltc-text': '#000000',
    'dark-coin-bch': '#8dc541',
    'dark-coin-bch-text': '#000000',
    'dark-coin-xrp': '#414042',
    'dark-coin-xrp-text': '#ffffff',
    'dark-coin-xht': '#000000',
    'dark-coin-xht-text': '#ffffff',
    'dark-coin-eos': '#58595b',
    'dark-coin-eos-text': '#ffffff',
    'dark-coin-bnb': '#f1ba2a',
    'dark-coin-bnb-text': '#000000',
    'dark-coin-link': '#1b75bc',
    'dark-coin-link-text': '#ffffff',
    'dark-coin-trx': '#a22d25',
    'dark-coin-trx-text': '#ffffff',
    'dark-coin-ada': '#3667b2',
    'dark-coin-ada-text': '#ffffff',
    'dark-coin-matic': '#2aaae2',
    'dark-coin-matic-text': '#ffffff',
    'dark-coin-neo': '#bcbec0',
    'dark-coin-neo-text': '#000000',
    'dark-coin-etc': '#009444',
    'dark-coin-etc-text': '#000000',
    'dark-coin-xlm': '#808285',
    'dark-coin-xlm-text': '#ffffff',
    'dark-coin-xmr': '#f15a29',
    'dark-coin-xmr-text': '#ffffff',
    'dark-coin-zec': '#fbb040',
    'dark-coin-zec-text': '#000000',
    'dark-coin-one': '#939598',
    'dark-coin-one-text': '#ffffff',
    'dark-coin-pax': '#163526',
    'dark-coin-pax-text': '#ffffff',
    'dark-coin-usdc': '#4d7d91',
    'dark-coin-usdc-text': '#ffffff',
    'dark-coin-usdt': '#2bb673',
    'dark-coin-usdt-text': '#ffffff',
    'dark-coin-vet': '#454c7d',
    'dark-coin-vet-text': '#ffffff',
    'dark-coin-btt': '#c49a6c',
    'dark-coin-btt-text': '#ffffff',
    'dark-coin-qtum': '#96daf7',
    'dark-coin-qtum-text': '#000000',
    'dark-coin-algo': '#594a42',
    'dark-coin-algo-text': '#ffffff',
    'dark-coin-rvn': '#662d91',
    'dark-coin-rvn-text': '#ffffff',
    'dark-coin-iota': '#603913',
    'dark-coin-iota-text': '#ffffff',
    'dark-coin-dash': '#417ec1',
    'dark-coin-dash-text': '#ffffff',
    'dark-coin-bsv': '#a09032',
    'dark-coin-bsv-text': '#ffffff',
    'dark-coin-ont': '#00a79d',
    'dark-coin-ont-text': '#ffffff',
    'dark-coin-atom': '#796184',
    'dark-coin-atom-text': '#ffffff',
    'dark-coin-celr': '#726658',
    'dark-coin-celr-text': '#ffffff',
    'dark-coin-omg': '#8e7fbb',
    'dark-coin-omg-text': '#ffffff',
    'dark-coin-hot': '#8b5e3c',
    'dark-coin-hot-text': '#ffffff',
}

export const minimalTimezoneSet = [
    { offset: '', label: 'UTC', value: 'UTC' },
    { offset: '-11:00', label: '(GMT-11:00) Pago Pago', value: 'Pacific/Pago_Pago' },
    { offset: '-10:00', label: '(GMT-10:00) Hawaii Time', value: 'Pacific/Honolulu' },
    { offset: '-10:00', label: '(GMT-10:00) Tahiti', value: 'Pacific/Tahiti' },
    { offset: '-09:00', label: '(GMT-09:00) Alaska Time', value: 'America/Anchorage' },
    { offset: '-08:00', label: '(GMT-08:00) Pacific Time', value: 'America/Los_Angeles' },
    { offset: '-07:00', label: '(GMT-07:00) Mountain Time', value: 'America/Denver' },
    { offset: '-06:00', label: '(GMT-06:00) Central Time', value: 'America/Chicago' },
    { offset: '-05:00', label: '(GMT-05:00) Eastern Time', value: 'America/New_York' },
    { offset: '-04:00', label: '(GMT-04:00) Atlantic Time - Halifax', value: 'America/Halifax' },
    { offset: '-03:00', label: '(GMT-03:00) Buenos Aires', value: 'America/Argentina/Buenos_Aires' },
    { offset: '-02:00', label: '(GMT-02:00) Sao Paulo', value: 'America/Sao_Paulo' },
    { offset: '-01:00', label: '(GMT-01:00) Azores', value: 'Atlantic/Azores' },
    { offset: '+00:00', label: '(GMT+00:00) London', value: 'Europe/London' },
    { offset: '+01:00', label: '(GMT+01:00) Berlin', value: 'Europe/Berlin' },
    { offset: '+01:00', label: '(GMT+01:00) Paris', value: 'Europe/Paris' },
    { offset: '+01:00', label: '(GMT+01:00) Rome', value: 'Europe/Rome' },
    { offset: '+02:00', label: '(GMT+02:00) Helsinki', value: 'Europe/Helsinki' },
    { offset: '+03:00', label: '(GMT+03:00) Moscow', value: 'Europe/Moscow' },
    { offset: '+03:00', label: '(GMT+03:00) Istanbul', value: 'Europe/Istanbul' },
    { offset: '+04:00', label: '(GMT+03:30) Tehran', value: 'Asia/Tehran' },
    { offset: '+04:00', label: '(GMT+04:00) Dubai', value: 'Asia/Dubai' },
    { offset: '+04:30', label: '(GMT+04:30) Kabul', value: 'Asia/Kabul' },
    { offset: '+05:00', label: '(GMT+05:00) Maldives', value: 'Indian/Maldives' },
    { offset: '+05:30', label: '(GMT+05:30) India Standard Time', value: 'Asia/Calcutta' },
    { offset: '+05:45', label: '(GMT+05:45) Kathmandu', value: 'Asia/Kathmandu' },
    { offset: '+06:00', label: '(GMT+06:00) Dhaka', value: 'Asia/Dhaka' },
    { offset: '+06:30', label: '(GMT+06:30) Cocos', value: 'Indian/Cocos' },
    { offset: '+07:00', label: '(GMT+07:00) Bangkok', value: 'Asia/Bangkok' },
    { offset: '+08:00', label: '(GMT+08:00) Hong Kong', value: 'Asia/Hong_Kong' },
    { offset: '+08:00', label: '(GMT+08:00) Kuala Lumpur', value: 'Asia/Kuala_Lumpur' },
    { offset: '+08:00', label: '(GMT+08:00) Singapore', value: 'Asia/Singapore' },
    { offset: '+08:00', label: '(GMT+08:00) Manila', value: 'Asia/Manila' },
    { offset: '+08:30', label: '(GMT+08:30) Pyongyang', value: 'Asia/Pyongyang' },
    { offset: '+09:00', label: '(GMT+09:00) Seoul', value: 'Asia/Seoul' },
    { offset: '+09:00', label: '(GMT+09:00) Tokyo', value: 'Asia/Tokyo' },
    { offset: '+09:30', label: '(GMT+09:30) Central Time - Darwin', value: 'Australia/Darwin' },
    { offset: '+10:00', label: '(GMT+10:00) Eastern Time - Brisbane', value: 'Australia/Brisbane' },
    { offset: '+10:30', label: '(GMT+10:30) Central Time - Adelaide', value: 'Australia/Adelaide' },
    { offset: '+11:00', label: '(GMT+11:00) Eastern Time - Melbourne, Sydney', value: 'Australia/Sydney' },
    { offset: '+12:00', label: '(GMT+12:00) Nauru', value: 'Pacific/Nauru' },
    { offset: '+13:00', label: '(GMT+13:00) Auckland', value: 'Pacific/Auckland' },
    { offset: '+14:00', label: '(GMT+14:00) Kiritimati', value: 'Pacific/Kiritimati' }
];
