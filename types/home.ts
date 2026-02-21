import { IconType } from '@/components/ui/icon';

/**
 * extract the allowed push-paths from expo‑router
 */
export type MenuRoute = Parameters<ReturnType<typeof import('expo-router').useRouter>['push']>[0];

/**
 * item that drives the grid on the home dashboard
 */
export interface HomeMenuItem {
  icon: IconType;
  title: string;
  subtitle: string;
  route: MenuRoute;
}

/**
 * a “recent activity” card on the dashboard
 */
export interface RecentLocation {
  status: 'available' | 'busy' | 'offline';
  name: string;
  location: string;
  code: string;
}
