import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { CURRENCIES, FLEX_CENTER_CLASSES } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const LanguageSelector = ({ changeLanguage, languages, activeLanguage = '' }) => (
  <div className="d-flex">
    {languages.map(({ key, label }, index) => (
      <div
        style={{ padding: 8 }}
        key={key}
        onClick={changeLanguage(key)}
        className="pointer"
      >
        {label}
      </div>
    ))}
  </div>
);

class AppBar extends Component {
  state = {
    symbolSelectorIsOpen: false,
  }

  toogleSymbolSelector = () => {
    this.setState({ symbolSelectorIsOpen: !this.state.symbolSelectorIsOpen })
  }

  onChangeSymbol = (symbol) => {
    this.props.changeSymbol(symbol)
    this.toogleSymbolSelector();
  }

  renderSymbolOption = ({ symbol, name, currencySymbol, iconPath}, index) => (
    <div key={index} className="app_bar-currency_option" onClick={() => this.onChangeSymbol(symbol)}>
      <img
        alt={symbol}
        src={`${process.env.PUBLIC_URL}${iconPath}`}
      />
      <span>{name}</span>
    </div>
  );


  renderSymbolBlock = (symbol) => {
    const { name, iconPath } = CURRENCIES[symbol];
    return (
      <div className="app_bar-currency_wrapper pointer">
        <div className="app_bar-currency_display" onClick={this.toogleSymbolSelector}>
          <img
            alt={symbol}
            src={`${process.env.PUBLIC_URL}${iconPath}`}
          />
          <span>{name}</span>
        </div>
        {this.state.symbolSelectorIsOpen &&
          <div className="app_bar-currency_list">
            {Object.entries(CURRENCIES)
              .filter(([key, currency]) => currency.symbol !== symbol)
              .map(([key, currency], index) => this.renderSymbolOption(currency, index))
            }
          </div>
        }
      </div>
    );
  }

  renderAppActions = (activeSymbol, acccountIsActive, goToAccountPage) => {
    return (
      <div className="app_bar-controllers">
        {this.renderSymbolBlock(activeSymbol)}
        <div className="app_bar-user pointer" onClick={goToAccountPage}>
          <img
            alt="account"
            src={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-${acccountIsActive ? '15' : '12'}.png`}
            className={classnames('pointer', {
              'active': acccountIsActive,
            })}
          />
        </div>
      </div>
    );
  }

  renderSplashActions = (token, verifyingToken, goToQuickTrade) => {
    if (verifyingToken) {
      return <div></div>
    }
    const COMMON_CLASSES = ['text-uppercase', 'action_button', 'pointer', ...FLEX_CENTER_CLASSES];
    const WRAPPER_CLASSES = ['app_bar-controllers-splash', 'd-flex'];
    return token ? (
      <div className={classnames(...WRAPPER_CLASSES)}>
        <div className={classnames(...COMMON_CLASSES, 'contrast')}>
          <Link to='/account'>{STRINGS.ACCOUNT_TEXT}</Link>
        </div>
      </div>
    ) : (
      <div className={classnames(...WRAPPER_CLASSES)}>
        <div className={classnames(...COMMON_CLASSES)} onClick={goToQuickTrade}>
          quick trade
        </div>
        <div className={classnames(...COMMON_CLASSES)}>
          <Link to='/login'>{STRINGS.LOGIN_TEXT}</Link>
        </div>
        <div className={classnames(...COMMON_CLASSES, 'contrast')}>
          <Link to='/signup'>{STRINGS.SIGNUP_TEXT}</Link>
        </div>
      </div>
    );
  }

  render() {
    const {
      title, goToAccountPage, goToDashboard, acccountIsActive, activeSymbol, noBorders, token, verifyingToken, goToQuickTrade, changeLanguage, activeLanguage,
    } = this.props;

    return (
      <div className={classnames('app_bar', { 'no-borders': noBorders })}>
        <div className={classnames('app_bar-icon', 'text-uppercase', 'contrast', { pointer: !!goToDashboard })} onClick={goToDashboard}>
          {STRINGS.APP_NAME}
        </div>
        <div className="app_bar-main d-flex justify-content-between">
          <div>{STRINGS.APP_TITLE}</div>
          {changeLanguage &&
            <LanguageSelector
              changeLanguage={changeLanguage}
              languages={STRINGS.LANGUAGES}
              activeLanguage={activeLanguage}
            />
          }
        </div>
        {activeSymbol ?
          this.renderAppActions(activeSymbol, acccountIsActive, goToAccountPage) :
          this.renderSplashActions(token, verifyingToken, goToQuickTrade)
        }
      </div>
    );
  }

}

AppBar.defaultProps = {
  noBorders: false
}
export default AppBar;
