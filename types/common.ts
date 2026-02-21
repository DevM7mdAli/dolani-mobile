import { IconType } from '@/components/ui/icon';

/**
 * simple contact card (used in emergencies, faculty list, etc.)
 */
export interface ContactCard {
  icon: IconType;
  label: string;
  number: string;
}

/**
 * helper used by several screens
 */
export interface BadgeInfo {
  text: string;
  color?: string;
}
