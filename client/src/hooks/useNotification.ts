import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'job' | 'invoice' | 'payment';

export function useNotification() {
  const { user } = useAuth();
  const createMutation = trpc.notifications.create.useMutation();

  const notify = async (
    title: string,
    message: string,
    type: NotificationType = 'info',
    actionUrl?: string
  ) => {
    if (!user) return;

    try {
      await createMutation.mutateAsync({
        userId: user.id,
        title,
        message,
        type,
        actionUrl,
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  return { notify };
}
