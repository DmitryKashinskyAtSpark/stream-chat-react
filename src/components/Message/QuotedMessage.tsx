import React from 'react';

import { Avatar as DefaultAvatar } from '../Avatar';

import { useComponentContext } from '../../context/ComponentContext';
import { useMessageContext } from '../../context/MessageContext';
import { useTranslationContext } from '../../context/TranslationContext';

import type { TranslationLanguages } from 'stream-chat';

import type { DefaultStreamChatGenerics } from '../../types/types';

export const QuotedMessage = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>() => {
  const { Attachment, Avatar: ContextAvatar } = useComponentContext<StreamChatGenerics>(
    'QuotedMessage',
  );
  const { isMyMessage, message } = useMessageContext<StreamChatGenerics>('QuotedMessage');
  const { userLanguage } = useTranslationContext('QuotedMessage');

  const Avatar = ContextAvatar || DefaultAvatar;

  const { quoted_message } = message;
  if (!quoted_message) return null;

  const quotedMessageText =
    quoted_message.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] ||
    quoted_message.text;

  // @ts-expect-error
  const quotedMessageAttachment = quoted_message.attachments.length
    ? // @ts-expect-error
      quoted_message.attachments[0]
    : null;

  if (!quotedMessageText && !quotedMessageAttachment) return null;

  return (
    <>
      <div className={`${isMyMessage() ? 'quoted-message mine' : 'quoted-message'}`}>
        {quoted_message.user && (
          <Avatar
            image={quoted_message.user.image}
            name={quoted_message.user.name || quoted_message.user.id}
            size={20}
            user={quoted_message.user}
          />
        )}
        <div className='quoted-message-inner'>
          {quotedMessageAttachment && <Attachment attachments={[quotedMessageAttachment]} />}
          <div>{quotedMessageText}</div>
        </div>
      </div>
      {message.attachments?.length && message.quoted_message ? (
        <Attachment attachments={message.attachments} />
      ) : null}
    </>
  );
};
