import React from 'react';
import { Link } from 'react-router-dom';
import routes from '@screens/router/routes';
import { isEmpty } from '@common/utilities/helpers';
import Icon from '@basics/icon';
import DialogLink from '@basics/dialog/link';
import { PrimaryButton } from '@basics/buttons';
import Tooltip from '@basics/tooltip/tooltip';
import Toggle from '@settings/setters/toggles/toggle';
import VoteQueueToggle from '@settings/setters/toggles/voteQueueToggle';
import styles from './topBar.css';
import Network from './networkName';
import NavigationButtons from './navigationButtons';
import Search from './search';
import SignOut from './signOut';

const TopBar = ({
  t,
  account,
  history,
  network,
  token,
  noOfVotes,
  location,
}) => {
  const isUserLogout = isEmpty(account) || account.afterLogout;
  const disabled = location.pathname === routes.reclaim.path;

  return (
    <div className={`${styles.wrapper} top-bar`}>
      <div className={styles.group}>
        <Icon
          name="liskLogo"
          className={`${styles.logo} topbar-logo`}
        />
        <NavigationButtons
          history={history}
          account={account}
        />
        <Toggle
          setting="sideBarExpanded"
          icons={['toggleSidebarActive', 'toggleSidebar']}
          tips={[t('Collapse sidebar'), t('Expand sidebar')]}
        />
        <Tooltip
          className={styles.tooltipWrapper}
          size="maxContent"
          position="bottom"
          content={(
            <DialogLink
              component="bookmarks"
              className={`${styles.toggle} bookmark-list-toggle ${disabled && `${styles.disabled} disabled`}`}
            >
              <Icon name="bookmark" className={styles.bookmarksIcon} />
            </DialogLink>
          )}
        >
          <p>{t('Bookmarks')}</p>
        </Tooltip>
        <VoteQueueToggle
          t={t}
          noOfVotes={noOfVotes}
          isUserLogout={isUserLogout}
          disabled={disabled}
        />
        <Search t={t} history={history} disabled={disabled} />
      </div>
      <div className={styles.group}>
        <Toggle
          setting="darkMode"
          icons={['lightMode', 'darkMode']}
          tips={[t('Disable dark mode'), t('Enable dark mode')]}
        />
        {
          !isUserLogout ? (
            <Toggle
              setting="discreetMode"
              icons={['discreetModeActive', 'discreetMode']}
              tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
            />
          ) : null
        }
        <Network
          token={token.active}
          network={network}
          t={t}
        />
        {
          isUserLogout && history.location.pathname !== routes.login.path ? (
            <Link to={routes.login.path} className={styles.signIn}>
              <PrimaryButton size="s">Sign in</PrimaryButton>
            </Link>
          ) : null
        }
        {!isUserLogout && <SignOut t={t} history={history} />}
      </div>
    </div>
  );
};

export default TopBar;