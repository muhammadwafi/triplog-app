import { env } from '@/config/constants';
import * as React from 'react';

export function useDocumentTitle(title: string) {
  const documentDefined = typeof document !== 'undefined';

  React.useEffect(() => {
    if (!documentDefined) return;

    if (title && document.title !== title) {
      document.title = `${title} | ${env.APP_NAME}`;
    }

    return () => {
      document.title = env.APP_NAME;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);
}
