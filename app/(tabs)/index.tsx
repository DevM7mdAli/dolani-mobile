import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { HomeMenuItem } from '@/types/home';
import { AlertTriangle, MapPin, Navigation, Search, Settings, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyBannerCard } from '@/components/home/emergency-banner';
import { HeaderHome } from '@/components/home/header';
import { LocationCard } from '@/components/home/location-card';
import { Card } from '@/components/ui/card';
import { GridItem } from '@/components/ui/grid-item';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const menuItems: HomeMenuItem[] = useMemo(
    () => [
      {
        icon: Search,
        title: t('home.menuSearch'),
        subtitle: t('common.search'),
        route: '/(tabs)/search',
      },
      {
        icon: Navigation,
        title: t('home.menuNavigate'),
        subtitle: t('common.navigate'),
        route: '/(tabs)/map',
      },
      {
        icon: Users,
        title: t('home.menuFaculty'),
        subtitle: t('common.faculty'),
        route: '/(tabs)/search?filter=doctor',
      },
      {
        icon: MapPin,
        title: t('home.menuMap'),
        subtitle: t('common.map'),
        route: '/(tabs)/map',
      },
    ],
    [t],
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <View style={{ paddingTop: insets.top + 16 }} className="rounded-b-3xl bg-primary px-6 pb-24">
        <HeaderHome
          router={router}
          applicationBrandName={t('home.brandName')}
          mapPinIcon={MapPin}
          settingIcon={Settings}
        />

        {/* Location Card */}
        <LocationCard
          currentLocationLabel={t('home.currentLocation')}
          currentLocation={t('home.sampleLocation')}
        />
      </View>

      <View className="-mt-14 px-5">
        {/* ── EMERGENCY BANNER ── */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(emergency)')}>
          <EmergencyBannerCard
            alertIcon={AlertTriangle}
            emergencyTitle={t('home.emergencyExit')}
            actionLabel={'Press to enter Emergency Mode'}
          />
        </TouchableOpacity>

        {/* ── GRID MENU ── */}
        <View className="mb-8 flex-row flex-wrap justify-between gap-y-4">
          {menuItems.map((option) => (
            <GridItem
              key={option.title}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              onPress={() => router.push(option.route)}
            />
          ))}
        </View>

        {/* ── PAST ACTIVITY ── */}
        <View className="items-start">
          <Text className="mb-3 text-start text-sm font-medium text-muted-foreground">
            {t('home.pastActivity')}
          </Text>
        </View>
        <Card className="flex-row items-center justify-between p-4">
          <View className="rounded-lg bg-muted px-3 py-1">
            <Text className="text-xs font-bold text-foreground">A201</Text>
          </View>
          <View className="flex-1 items-start px-3">
            <Text className="text-base font-semibold text-foreground">{t('home.mockLabName')}</Text>
            <Text className="text-xs text-muted-foreground">{t('home.mockLabLocation')}</Text>
          </View>
          <View className="rounded-full bg-green-100 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-green-700">{t('common.available')}</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
