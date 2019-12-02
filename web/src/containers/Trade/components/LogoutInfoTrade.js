import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import STRINGS from '../../../config/localizedStrings';
const LogoutInfoTrade = () => {
    return (
        <div className='text-center my-5'>
            <div className="hex-order-heading my-3">{STRINGS.TERMS_OF_SERVICES.HEX_TRADE_TXT_1}</div>
            <div className="hex-order-content my-3">
                {STRINGS.formatString(
                    STRINGS.TERMS_OF_SERVICES.HEX_TRADE_TXT_2,
                    <Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
                        {STRINGS.TERMS_OF_SERVICES.LOGIN_HERE}
                    </Link>
                )}
            </div>
        </div>
    )
}
export default LogoutInfoTrade;