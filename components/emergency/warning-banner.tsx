import { Text, View } from 'react-native';

import { Icon, IconType } from '../ui/icon';

export const WarningBanner = ({
  alertIcon,
  declaration,
  title,
}: {
  alertIcon: IconType;
  title: string;
  declaration: string;
}) => (
  <View className="mb-6 items-center rounded-xl border border-destructive/20 bg-destructive/10 p-6">
    <Icon icon={alertIcon} size={40} className="mb-3 text-destructive" />
    <Text className="mb-1 text-lg font-bold text-destructive">{title}</Text>
    <Text className="text-sm text-destructive opacity-80">{declaration}</Text>
  </View>
);
