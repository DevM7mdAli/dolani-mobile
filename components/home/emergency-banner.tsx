import { Text, View } from 'react-native';

import { Card } from '../ui/card';
import { Icon, type IconType } from '../ui/icon';

interface EmergencyBannerProps {
  alertIcon: IconType;
  emergencyTitle: string;
  actionLabel: string;
}

export const EmergencyBannerCard = ({
  alertIcon,
  emergencyTitle,
  actionLabel,
}: EmergencyBannerProps) => (
  <Card className="mb-6 border-destructive bg-destructive p-5">
    <View className="flex-row items-center justify-between">
      <View className="items-start">
        <Text className="text-lg font-bold text-white">{emergencyTitle}</Text>
        <Text className="text-sm text-white/80">{actionLabel}</Text>
      </View>
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
        <Icon icon={alertIcon} size={28} className="text-white" />
      </View>
    </View>
  </Card>
);
