import React from 'react';
import { withTranslation } from 'react-i18next';
import AccountVisual from '@toolbox/accountVisual';
import Converter from '@shared/converter';
import AccountMigration from '@shared/accountMigration';
import LiskAmount from '@shared/liskAmount';
import VoteItem from '@shared/voteItem';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';

import styles from './transactionInfo.css';

const ItemList = ({ items, heading }) => (
  <div className={styles.contentItem}>
    <span className={styles.contentHeading}>{heading}</span>
    <div className={styles.voteItems}>
      {Object.keys(items).map(address => (
        <VoteItem
          key={`vote-item-${address}`}
          address={address}
          vote={items[address]}
          title={items[address].username}
        />
      ))}
    </div>
  </div>
);

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const VoteDelegate = ({
  added, edited, removed, fee, t,
}) => {
  const addedLength = Object.keys(added).length;
  const editedLength = Object.keys(edited).length;
  const removedLength = Object.keys(removed).length;

  return (
    <>
      {addedLength ? <ItemList heading={t('Added votes')} items={added} /> : null}
      {editedLength ? <ItemList heading={t('Changed votes')} items={edited} /> : null}
      {removedLength ? <ItemList heading={t('Removed votes')} items={removed} /> : null}
      <div className={styles.infoContainer}>
        <InfoColumn title={t('Total votes after confirmation')} className="total-votes">{`${addedLength + editedLength}/10`}</InfoColumn>
        <InfoColumn title={t('Transaction fee')} className="fee">
          <LiskAmount val={fee} />
        </InfoColumn>
      </div>
    </>
  );
};

const RegisterMultisignatureGroup = () => null;

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <AccountMigration account={account.info.LSK} showBalance={false} />
    </section>
    <section>
      <label>{t('Balance to reclaim')}</label>
      <LiskAmount
        val={Number(account.info.LSK.legacy.balance)}
        token={tokenMap.LSK.key}
      />
    </section>
  </>
);

const Send = ({
  fields, token, transaction, t,
}) => {
  console.log(transaction);
  console.log(fields);

  return (
    <>
      <section>
        <label>{t('Recipient')}</label>
        <label className="recipient-value">
          <AccountVisual address={fields.recipient.address} size={25} />
          <label className={`${styles.information} recipient-confirm`}>
            {fields.recipient.title || fields.recipient.address}
          </label>
          { fields.recipient.title ? (
            <span className={styles.secondText}>
              {fields.recipient.address}
            </span>
          ) : null }
        </label>
      </section>
      <section>
        <div>
          <label>{t('Transaction ID')}</label>
          <label>{transaction.id.toString('hex')}</label>
        </div>
        <div>
          <label>{t('Amount')}</label>
          <label>{`${transaction.asset.amount} ${token}`}</label>
        </div>
      </section>
      <section>
        <div>
          <label>{t('Required signatures')}</label>
          <label>-</label>
        </div>
        <div>
          <label>{t('Transaction fee')}</label>
          <label>{transaction.fee}</label>
        </div>
      </section>
      <section>
        <div>
          <label>{t('Message')}</label>
          <label>{transaction.asset.data}</label>
        </div>
        <div>
          <label>{t('Nonce')}</label>
          <label>{transaction.nonce}</label>
        </div>
      </section>
    </>
  );
};

const RegisterDelegate = ({ account, nickname, t }) => (
  <section className="summary-container">
    <label className="nickname-label">{t('Your nickname')}</label>
    <div className={styles.userInformation}>
      <AccountVisual
        className={styles.accountVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.nickname} nickname`}>{nickname}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

const UnlockBalance = ({ account, fee, t, transaction }) => {
  console.log(transaction);
  return (
    <>
      <section>
        <label>{t('Sender')}</label>
        <label>
          <AccountVisual address={account.summary.address} size={25} />
          <label>
            {account.summary.address}
          </label>
        </label>
      </section>
      <section>
        <label>{t('Fee')}</label>
        <label>
          {fee}
          <Converter className={styles.secondText} value={fee} />
        </label>
      </section>
    </>
  );
};

const TransactionInfo = ({ moduleAssetId, ...restProps }) => {
  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.reclaimLSK: return <Reclaim {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate: return <RegisterDelegate {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.transfer: return <Send {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate: return <VoteDelegate {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.unlockToken: return <UnlockBalance {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup:
      return <RegisterMultisignatureGroup {...restProps} />;
    default:
      return null;
  }
};

export default withTranslation()(TransactionInfo);
