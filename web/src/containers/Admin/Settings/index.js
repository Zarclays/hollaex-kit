import React, { Component } from 'react';
import { Tabs, Row, Spin, Alert } from 'antd';

import { GeneralSettingsForm, EmailSettingsForm, SecuritySettingsForm, LinksSettingsForm } from './SettingsForm';
import { getConstants, updatePlugins } from './action';
import { generateAdminSettings } from './Utils';

const TabPane = Tabs.TabPane;

export default class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: '',
            loading: false,
            error: '',
            constants: {},
            initialGeneralValues: {
                theme: 'white',
                valid_languages: 'en',
                country: 'global',
                new_user_is_activated: false
            },
            initialEmailValues: {
                configuration: {
                    timezone: 'utc',
                    port: 587,
                    send_email_to_support: false
                },
                distribution: {}
            },
            initialSecurityValues: {},
            initialLinkValues: {}
        };
    }

    componentDidMount() {
        this.getConstantData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState.constants) !== JSON.stringify(this.state.constants)) {
            this.getSettingsValues();
        }
    }

    tabChange = (activeTab) => {
        this.setState({ activeTab });
    };

    getConstantData = () => {
        this.setState({ loading: true, error: '' });
        getConstants()
            .then((res) => {
                this.setState({ loading: false, constants: res.constants });
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({ loading: false, error: message });
            });
    };

    getSettingsValues = () => {
        const result = generateAdminSettings();
        let initialGeneralValues = { ...this.state.initialGeneralValues };
        const {
            title,
            description,
            defaults = {},
            emails = {},
            secrets = { smtp: {}, captcha: {} },
            accounts = {},
            allowed_domains,
            admin_whitelist,
            captcha = {},
            links = {}
        } = this.state.constants;
        const { configuration = {}, distribution = {} } = this.state.initialEmailValues || {};
        const initialEmailValues = {
            configuration: { ...configuration, ...emails, ...secrets.smtp },
            distribution: { ...distribution, ...accounts }
        };
        Object.keys(result).forEach(utilsValue => {
            if (this.state.constants[utilsValue]) {
                if (utilsValue === 'valid_languages'
                    && typeof this.state.constants.valid_languages === 'string') {
                    initialGeneralValues[utilsValue] = this.state.constants[utilsValue].split(',');
                } else {
                    initialGeneralValues[utilsValue] = this.state.constants[utilsValue];
                }
            }
        });
        initialGeneralValues = { ...initialGeneralValues, ...defaults, title, description };

        let initialSecurityValues = {
            ...captcha,
            ...secrets.captcha
        }
        if (allowed_domains) {
            initialSecurityValues.allowed_domains = typeof allowed_domains === 'string'
                ? allowed_domains.split(',')
                : allowed_domains;
        }
        if (admin_whitelist) {
            initialSecurityValues.admin_whitelist = typeof admin_whitelist === 'string'
                ? admin_whitelist.split(',')
                : admin_whitelist;
        }
        const initialLinkValues = { ...links };
        this.setState({ initialGeneralValues, initialEmailValues, initialSecurityValues, initialLinkValues });
    };

    submitSettings = (formProps, formKey) => {
        let formValues = {};
        if (formKey === 'general') {
            formValues = { defaults: {} };
            Object.keys(formProps).forEach((val) => {
                if (val === 'theme' || val === 'language' || val === 'country') {
                    formValues.defaults[val] = formProps[val];
                } else if (val === 'valid_languages' && typeof formProps[val] !== 'string') {
                    formValues[val] = formProps[val].join(',');
                } else if (val === 'new_user_is_activated') {
                    if (typeof formProps[val] === 'string')
                        formValues[val] = formProps[val] === 'true' ? true : false;
                    else
                        formValues[val] = formProps[val];
                } else {
                    formValues[val] = formProps[val];
                }
            });
        } else if (formKey === 'email_distribution') {
            formValues = {};
            formValues.accounts = { admin: formProps.admin, support: formProps.support };
            if (formProps.kyc) formValues.accounts.kyc = formProps.kyc;
            if (formProps.supervisor) formValues.accounts.supervisor = formProps.supervisor;
        } else if (formKey === 'email_configuration') {
            formValues = {};
            Object.keys(formProps).forEach((val) => {
                if (val === 'sender' || val === 'timezone' || val === 'send_email_to_support') {
                    if (!formValues.emails) formValues.emails = {};
                    formValues.emails[val] = formProps[val];
                // } else if (val === 'kyc' || val === 'supervisor') {
                //     if (!formValues.accounts) formValues.accounts = {};
                //     formValues.accounts[val] = formProps[val];
                } else if (val === 'port') {
                    if (!formValues.secrets || !formValues.secrets.smtp) formValues.secrets = { smtp: {} };
                    formValues.secrets.smtp[val] = parseInt(formProps[val], 10);
                } else {
                    if (!formValues.secrets || !formValues.secrets.smtp) formValues.secrets = { smtp: {} };
                    formValues.secrets.smtp[val] = formProps[val];
                }
            });
        } else if (formKey === 'security') {
            formValues = { captcha: {}, secrets: { captcha: {} } };
            Object.keys(formProps).forEach((val) => {
                if (val === 'site_key') {
                    formValues.captcha[val] = formProps[val];
                } else if (val === 'secret_key') {
                    formValues.secrets.captcha[val] = formProps[val];
                } else if ((val === 'allowed_domains' || val === 'admin_whitelist')
                    && typeof formProps[val] === 'string') {
                    formValues.allowed_domains = formProps.allowed_domains.split(',');
                } else {
                    formValues[val] = formProps[val];
                }
            });
        } else if (formKey === 'links') {
            formValues.links = { ...formProps }
        }
        this.setState({ loading: true, error: '' });
        updatePlugins(formValues)
            .then((res) => {
                this.setState({ loading: false, constants: res });
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({ loading: false, error: message });
            });
    };

    render() {
        const { loading, error, initialGeneralValues, initialEmailValues, initialSecurityValues, initialLinkValues } = this.state;
        return (
            <div className="app_container-content">
                <h1>Settings</h1>
                {error && (
                    <Alert
                        message="Error"
                        className="m-top"
                        description={error}
                        type="error"
                        showIcon
                    />
                )}
                {loading ? (
                    <Spin size="large" />
                ) : (
                        <Tabs
                            defaultActiveKey={this.state.activeTab}
                            onChange={this.tabChange}
                        >
                            <TabPane tab={'General'} key={'general'}>
                                <Row>
                                    <GeneralSettingsForm
                                        initialValues={initialGeneralValues}
                                        handleSubmitSettings={this.submitSettings} />
                                </Row>
                            </TabPane>
                            <TabPane tab={'Email'} key={'email'}>
                                <Row>
                                    <EmailSettingsForm
                                        initialValues={initialEmailValues}
                                        handleSubmitSettings={this.submitSettings} />
                                </Row>
                            </TabPane>
                            <TabPane tab={'Security'} key={'security'}>
                                <Row>
                                    <SecuritySettingsForm
                                        initialValues={initialSecurityValues}
                                        handleSubmitSettings={this.submitSettings} />
                                </Row>
                            </TabPane>
                            <TabPane tab={'Links'} key={'links'}>
                                <Row>
                                    <LinksSettingsForm
                                        initialValues={initialLinkValues}
                                        handleSubmitSettings={this.submitSettings} />
                                </Row>
                            </TabPane>
                        </Tabs>
                    )}
            </div>
        )
    }
}
