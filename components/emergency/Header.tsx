import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { Icon, type IconType } from '../ui/icon';

type HeaderProps = {
  iconHeader: IconType;
  arrowIcon: IconType;
  insetsNumber?: number;
  router: { back: () => void };
};
export const Header = ({ iconHeader, router, arrowIcon, insetsNumber }: HeaderProps) => (
  <View
    className={`flex-row items-center justify-between bg-destructive px-5 pb-4 ${Platform.OS === 'android' ? 'pt-10' : 'pt-4'}`}
    style={{ paddingTop: insetsNumber }}
  >
    <View className="flex-1">
      <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
        <Icon className="text-white" icon={arrowIcon} />
      </TouchableOpacity>
    </View>
    <View className="flex-row items-center gap-2">
      <View className="items-center justify-center rounded-full bg-muted/20 p-1.5">
        <Icon icon={iconHeader} className="text-white" />
      </View>
      <Text className="text-white">Emergency Mode</Text>
    </View>
  </View>
);
