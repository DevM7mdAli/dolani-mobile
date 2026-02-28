import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { type RecentNavigation, useNavigationStore } from '@/store/useNavigationStore';
import { HomeMenuItem } from '@/types/home';
import { AlertTriangle, MapPin, Navigation, Search, Settings, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyBannerCard } from '@/components/home/emergency-banner';
import { HeaderHome } from '@/components/home/header';
import { LocationCard } from '@/components/home/location-card';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GridItem } from '@/components/ui/grid-item';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* ── Navigation store — recent history + current location ── */
  const recentNavigations = useNavigationStore((s) => s.recentNavigations);
  const currentLocationId = useNavigationStore((s) => s.currentLocationId);

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

  /* ── Current location display ── */
  const currentLocationText = useMemo(() => {
    if (!currentLocationId) return t('home.unknownLocation');
    // If we have a recent nav entry matching, show that info
    const recent = recentNavigations.find((r) => r.locationId === currentLocationId);
    if (recent) return `${recent.buildingName}, Floor ${recent.floorNumber}`;
    return t('home.sampleLocation');
  }, [currentLocationId, recentNavigations, t]);

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
          applicationBrandName={t('common.appName')}
          mapPinIcon={MapPin}
          settingIcon={Settings}
        />

        {/* Location Card */}
        <LocationCard
          currentLocationLabel={t('home.currentLocation')}
          currentLocation={currentLocationText}
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

        {/* ── PAST ACTIVITY (from MMKV-backed store) ── */}
        <View className="items-start">
          <Text className="mb-3 text-start text-sm font-medium text-muted-foreground">
            {t('home.pastActivity')}
          </Text>
        </View>

        {recentNavigations.length === 0 ? (
          <Card className="items-center p-4">
            <Text className="text-sm text-muted-foreground">{t('home.noRecentActivity')}</Text>
          </Card>
        ) : (
          recentNavigations.slice(0, 5).map((entry: RecentNavigation) => (
            <TouchableOpacity
              key={`${entry.locationId}-${entry.timestamp}`}
              onPress={() => {
                useNavigationStore.getState().startNavigation(entry.locationId);
                router.push('/(tabs)/map');
              }}
            >
              <Card className="mb-2 flex-row items-center justify-between p-4">
                <View className="rounded-lg bg-muted px-3 py-1">
                  <Text className="text-xs font-bold text-foreground">
                    {entry.roomNumber ?? '—'}
                  </Text>
                </View>
                <View className="flex-1 items-start px-3">
                  <Text className="text-base font-semibold text-foreground">{entry.name}</Text>
                  <Text className="text-xs text-muted-foreground">
                    Floor {entry.floorNumber}, {entry.buildingName}
                  </Text>
                </View>
                <Badge variant="success" label={t('common.navigate')} />
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}
