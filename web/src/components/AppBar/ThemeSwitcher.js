import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { Select } from 'antd';

const { Option } = Select;

const ThemeSwitcher = ({ selected, options = [], toggle, icons: ICONS }) => {

    const handleClick = () => {
      const theme = options[0].value === selected ? options[1].value : options[0].value
      toggle(theme)
    }

    const isSwitch = options.length < 3

    return (
        <div>
            <div className={classnames('toggle_button-wrapper', 'd-flex')}>
                { isSwitch && (
                  <div
                    className={classnames(
                      'toggle-content',
                      'f-0',
                      ...FLEX_CENTER_CLASSES,
                      'direction_ltr'
                    )}
                  >
                      <div className={classnames('selected', selected)}>
                          <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                          >
                              <Image
                                icon={ICONS["SUN_THEME"]}
                                wrapperClassName="app-bar-account-moon-icon"
                              />
                          </div>
                      </div>
                      <div
                        onClick={handleClick}
                        className={classnames('toggle-action_button', {
                          left: options[0].value === selected,
                          right: options[1].value === selected
                        })}
                      >
                          <div className="toggle-action_button-display" />
                      </div>
                      <div className={classnames('selected', selected)}>
                          <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                          >
                              <Image
                                iconId="SUN_THEME,MOON_THEME"
                                icon={ICONS["MOON_THEME"]}
                                wrapperClassName="app-bar-account-moon-icon"
                              />
                          </div>
                      </div>
                  </div>
                )}

                { !isSwitch && (
                  <Select
                    value={selected}
                    size="default"
                    onSelect={toggle}
                  >
                    {
                      options.map(({ value }) => (
                        <Option value={value} key={value}>
                          {value}
                        </Option>
                      ))
                    }
                  </Select>
                )}
            </div>
        </div>
    )
}

export default withConfig(ThemeSwitcher);