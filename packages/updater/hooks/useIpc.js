import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import htmlStringToReact from '@common/utilities/htmlStringToReact';
import { regex } from '@constants';
import { addSearchParamsToUrl, removeSearchParamsFromUrl } from '@common/utilities/searchParams';
import { appUpdateAvailable } from '@common/store/actions';
import FlashMessageHolder from '@views/basics/flashMessage/holder';
import NewReleaseMessage from '@shared/newReleaseMessage/newReleaseMessage';

const useIpc = (history) => {
  const dispatch = useDispatch();

  const { ipc } = window;

  if (!ipc) return;

  useEffect(() => {
    ipc.on('update:available', (action, { version, releaseNotes }) => {
      const readMore = () => {
        addSearchParamsToUrl(history, { modal: 'newRelease' });
      };

      const remindMeLater = () => {
        FlashMessageHolder.deleteMessage('NewRelease');
        removeSearchParamsFromUrl(history, ['modal']);
      };

      const updateNow = () => {
        ipc.send('update:started');
        setTimeout(() => {
          FlashMessageHolder.deleteMessage('NewRelease');
        }, 500);
      };

      const [releaseSummary] = releaseNotes.match(regex.releaseSummary).slice(1);
      dispatch(appUpdateAvailable({
        version, releaseNotes, remindMeLater, updateNow,
      }));

      FlashMessageHolder.addMessage(
        <NewReleaseMessage
          version={version}
          releaseNotes={releaseNotes}
          releaseSummary={htmlStringToReact(releaseSummary)}
          readMore={readMore}
          updateNow={updateNow}
        />,
        'NewRelease',
      );
    });
  }, []);
};

export default useIpc;