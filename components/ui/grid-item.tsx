import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';

import { Card } from '@/components/ui/card';
import { Icon, IconType } from '@/components/ui/icon';

export interface GridItemProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  containerClassName?: string;
  cardClassName?: string;
  cardIconBgClassName?: string;
  iconSize?: number;
  iconClassName?: string;
}

export function GridItem({
  icon,
  title,
  subtitle,
  onPress,
  containerClassName,
  cardClassName,
  cardIconBgClassName,
  iconSize = 24,
  iconClassName,
}: GridItemProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      className={cn('w-[48%]', containerClassName)}
    >
      <Card className={cn('h-36 items-center justify-center border-none', cardClassName)}>
        <View
          className={cn(
            'mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-primary',
            cardIconBgClassName,
          )}
        >
          <Icon icon={icon} size={iconSize} className={cn('text-white', iconClassName)} />
        </View>
        <Text className="text-lg font-bold text-foreground">{title}</Text>
        {subtitle ? <Text className="text-xs text-muted-foreground">{subtitle}</Text> : null}
      </Card>
    </Wrapper>
  );
}
