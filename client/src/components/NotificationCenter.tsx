import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Bell, X, Check, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery();
  const { data: notificationsList = [] } = trpc.notifications.list.useQuery({ limit: 20 });
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteMutation = trpc.notifications.delete.useMutation();

  useEffect(() => {
    setNotifications(notificationsList);
  }, [notificationsList]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync({ id });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'job':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'invoice':
        return <Info className="w-5 h-5 text-purple-500" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string, read: number) => {
    if (read === 1) return 'bg-gray-50 hover:bg-gray-100';
    
    switch (type) {
      case 'success':
        return 'bg-green-50 hover:bg-green-100';
      case 'warning':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'error':
        return 'bg-red-50 hover:bg-red-100';
      case 'job':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'invoice':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'payment':
        return 'bg-green-50 hover:bg-green-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 ${getBgColor(notification.type, notification.read)} transition-colors cursor-pointer group`}
                    onClick={() => {
                      if (notification.read === 0) {
                        handleMarkAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${notification.read === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          {notification.read === 0 && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
