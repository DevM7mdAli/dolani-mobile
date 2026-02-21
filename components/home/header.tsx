import { Text, TouchableOpacity, View } from 'react-native';

import { Icon, type IconType } from '../ui/icon';

export interface HeaderHomeProps {
  router: ReturnType<typeof import('expo-router').useRouter>;
  mapPinIcon: IconType;
  settingIcon: IconType;
  applicationBrandName: string;
}

export const HeaderHome = ({
  router,
  mapPinIcon,
  settingIcon,
  applicationBrandName,
}: HeaderHomeProps) => (
  <View className="mb-6 flex-row items-center justify-between">
    <View className="flex-row items-center gap-3">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <Icon icon={mapPinIcon} size={16} className="text-primary-dark" />
      </View>
      <View className="flex-row items-center gap-3">
        <View className="items-start">
          <Text className="text-lg font-bold text-white">{applicationBrandName}</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity
      className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
      onPress={() => router.push('/(tabs)/settings')}
    >
      <Icon icon={settingIcon} size={20} className="text-white" />
    </TouchableOpacity>
  </View>
);
