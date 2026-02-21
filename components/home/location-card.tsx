import { Text, View } from 'react-native';

export const LocationCard = ({
  currentLocationLabel,
  currentLocation,
}: {
  currentLocationLabel: string;
  currentLocation: string;
}) => (
  <View className="rounded-2xl border border-white/20 bg-white/10 p-4">
    <View className="flex-row items-center justify-between">
      <View className="items-start">
        <Text className="text-sm text-white/80">{currentLocationLabel}</Text>
        <Text className="mt-1 text-xl font-bold text-white">{currentLocation}</Text>
      </View>
      <View className="h-3 w-3 rounded-full bg-secondary" />
    </View>
  </View>
);
