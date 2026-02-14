import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';

export interface CardProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ className, title, subtitle, children, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-xl border border-border bg-white p-4 shadow-sm', className)}
      {...props}
    >
      {(title || subtitle) && (
        <View className="mb-4">
          {title && <Text className="text-lg font-semibold text-foreground">{title}</Text>}
          {subtitle && <Text className="text-sm text-muted-foreground">{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}
