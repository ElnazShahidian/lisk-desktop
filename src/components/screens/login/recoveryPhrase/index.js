import React, { useEffect, useState } from 'react';
import CheckBox from '@toolbox/checkBox';
import { Input } from '@toolbox/inputs';
import WarningMessage from '@shared/warningMessage';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import { isEmpty } from '@utils/helpers';
import styles from './recoveryPhrase.css';

const addWarningMessage = (t) => {
  FlashMessageHolder.addMessage(
    (
      <WarningMessage
        title={t('WARNING: You are about to use the recovery phrase of your hardware wallet to access your Lisk account.')}
      >
        <>
          <p>{t('Using your recovery phrase this way should be avoided, and if you don’t need to access your funds now, we recommend waiting for full support of hardware wallets in Lisk Desktop 2.2.0.')}</p>
          <p>{t('Lisk desktop does not store your recovery seed anywhere and is open-source. However, be aware that if your computer is compromised or running malware, entering your recovery phrase could lead to the loss of all crypto assets stored with your device, not only LSK tokens.')}</p>
        </>
      </WarningMessage>
    ),
    'RecoveryPhraseWarning',
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('RecoveryPhraseWarning');
};

const RecoveryPhrase = ({
  t, account,
  isRecoveryPhraseMode, setIsRecoveryPhrase,
  derivationPath, setDerivationPath,
}) => {
  const [showCustomDerivationPath, setShowCustomDerivationPath] = useState(false);

  useEffect(() => {
    console.log('Use effect', isRecoveryPhraseMode);
    if (isRecoveryPhraseMode) {
      addWarningMessage(t);
    } else {
      removeWarningMessage();
    }
  }, [isRecoveryPhraseMode]);

  useEffect(() => {
    if (!isEmpty(account)) {
      removeWarningMessage();
    }
  }, [account]);

  console.log('re-render');

  return (
    <>
      <div className={styles.checkboxWrapper}>
        <CheckBox
          name="recoveryMode"
          className="recovery-phrase-check"
          checked={isRecoveryPhraseMode}
          onChange={() => {
            setIsRecoveryPhrase(!isRecoveryPhraseMode);
          }}
        />
        <span>{t('Enable recovery phrase mode (optional)')}</span>
      </div>
      {isRecoveryPhraseMode && (
        <div className={styles.checkboxWrapper}>
          <CheckBox
            name="customDerivation"
            className="custom-derivation-check"
            checked={showCustomDerivationPath}
            onChange={() => {
              setShowCustomDerivationPath(!showCustomDerivationPath);
            }}
          />
          <span>{t('Modify derivation path (optional)')}</span>
        </div>
      )}
      {showCustomDerivationPath && (
        <Input
          className={styles.derivationPathInput}
          size="l"
          onChange={(e) => { setDerivationPath(e.target.value); }}
          value={derivationPath}
        />
      )}
    </>
  );
};

export default RecoveryPhrase;
