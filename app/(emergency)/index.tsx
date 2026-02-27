import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { useNavigationStore } from '@/store/useNavigationStore';
import * as Haptics from 'expo-haptics';
import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/emergency/header';
import { WarningBanner } from '@/components/emergency/warning-banner';
import { GridItem } from '@/components/ui/grid-item';

const EXIT_LOCATION_ID = 0; // 0 = backend picks nearest exit

const Index = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const startNavigation = useNavigationStore((s) => s.startNavigation);

  const handleEmergencyNavigate = useCallback(async () => {
    // Heavy haptic to signal emergency activation
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Start emergency navigation — the Map screen will auto-calculate the route
    startNavigation(EXIT_LOCATION_ID, true);
    router.push('/(tabs)/map');
  }, [startNavigation, router]);

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      <Header
        router={router}
        arrowIcon={ArrowLeftIcon}
        iconHeader={AlertTriangleIcon}
        insetsNumber={insets.top}
      />
      <ScrollView className="bg-white/10 px-4">
        <View className="mt-3 flex-1">
          <WarningBanner
            alertIcon={AlertTriangleIcon}
            title={t('emergency.findExit')}
            declaration={t('emergency.followGreen')}
          />
          <View className="w-full">
            <Text className="mb-3">{t('emergency.emergencyNumbers')}</Text>
            <View className="flex-row flex-wrap">
              {[
                { name: t('emergency.fire'), number: 998, icon: AlertTriangleIcon },
                { name: t('emergency.ambulance'), number: 997, icon: AlertTriangleIcon },
                { name: t('emergency.security'), number: 911, icon: AlertTriangleIcon },
              ].map((card) => (
                <GridItem
                  key={card.number}
                  icon={card.icon}
                  title={card.name}
                  subtitle={card.number.toString()}
                  iconSize={17}
                  onPress={async () => {
                    await Linking.openURL(`tel:${card.number}`);
                  }}
                  containerClassName="mb-4 w-1/3"
                  iconClassName="text-destructive"
                  cardIconBgClassName="bg-destructive-light/50"
                />
              ))}
            </View>
          </View>
          <TouchableOpacity
            className="h-full justify-center rounded-2xl border-4 border-destructive-light bg-destructive p-6"
            onPress={handleEmergencyNavigate}
            activeOpacity={0.7}
          >
            <Text className="text-center text-2xl font-bold text-white">
              {t('emergency.navigateToExit')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
