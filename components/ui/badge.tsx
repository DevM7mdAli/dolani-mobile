import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.ComponentPropsWithoutRef<typeof View> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  className?: string;
  label: string;
}

export function Badge({ className, variant = 'default', label, ...props }: BadgeProps) {
  return (
    <View
      className={cn(
        'focus:ring-ring flex items-center rounded-full border px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'border-transparent bg-primary': variant === 'default',
          'border-transparent bg-secondary': variant === 'secondary',
          'border-transparent bg-destructive': variant === 'destructive',
          'text-foreground': variant === 'outline',
          'border-transparent bg-green-100 dark:bg-green-900': variant === 'success',
        },
        className,
      )}
      {...props}
    >
      <Text
        className={cn('text-xs font-semibold', {
          'text-primary-foreground': variant === 'default',
          'text-secondary-foreground': variant === 'secondary',
          'text-destructive-foreground': variant === 'destructive',
          'text-foreground': variant === 'outline',
          'text-green-800 dark:text-green-300': variant === 'success',
        })}
      >
        {label}
      </Text>
    </View>
  );
}
