'use client';

import { useNotificationContext } from '@/context/NotificationContext';

export function useNotification() {
  const { notify } = useNotificationContext();
  return { notify };
}

export default useNotification;
