import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AlertTriangle, MapPin, Navigation, Search, Settings, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <View style={{ paddingTop: insets.top + 16 }} className="rounded-b-3xl bg-primary px-6 pb-24">
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Icon icon={Settings} size={20} className="text-white" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <View className="items-end">
              <Text className="text-lg font-bold text-white">{t('home.brandName')}</Text>
              <Text className="text-sm text-white/70">{t('home.brandSubtitle')}</Text>
            </View>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon icon={MapPin} size={16} className="text-primary-dark" />
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View className="rounded-2xl border border-white/20 bg-white/10 p-4">
          <View className="flex-row items-center justify-between">
            <View className="h-3 w-3 rounded-full bg-secondary" />
            <View className="items-end">
              <Text className="text-sm text-white/80">{t('home.currentLocation')}</Text>
              <Text className="mt-1 text-xl font-bold text-white">{t('home.sampleLocation')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="-mt-14 px-5">
        {/* ── EMERGENCY BANNER ── */}
        <TouchableOpacity activeOpacity={0.9}>
          <Card className="mb-6 border-destructive bg-destructive p-5">
            <View className="flex-row items-center justify-between">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Icon icon={AlertTriangle} size={28} className="text-white" />
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-white">{t('home.emergencyExit')}</Text>
                <Text className="text-sm text-white/80">Emergency Exit</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* ── GRID MENU ── */}
        <View className="mb-8 flex-row flex-wrap justify-between gap-y-4">
          <GridItem
            icon={Search}
            title={t('home.menuSearch')}
            subtitle="Search"
            onPress={() => router.push('/(tabs)/search')}
          />
          <GridItem
            icon={Navigation}
            title={t('home.menuNavigate')}
            subtitle="Navigate"
            onPress={() => router.push('/(tabs)/map')}
          />
          <GridItem
            icon={Users}
            title={t('home.menuFaculty')}
            subtitle="Faculty"
            onPress={() => router.push('/(tabs)/faculty')}
          />
          <GridItem
            icon={MapPin}
            title={t('home.menuMap')}
            subtitle="Map"
            onPress={() => router.push('/(tabs)/map')}
          />
        </View>

        {/* ── PAST ACTIVITY ── */}
        <Text className="mb-3 text-right text-sm font-medium text-muted-foreground">
          {t('home.pastActivity')} • Past Activity
        </Text>
        <Card className="flex-row items-center justify-between p-4">
          <View className="rounded-full bg-green-100 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-green-700">{t('common.available')}</Text>
          </View>
          <View className="flex-1 items-end px-3">
            <Text className="text-base font-semibold text-foreground">{t('home.mockLabName')}</Text>
            <Text className="text-xs text-muted-foreground">{t('home.mockLabLocation')}</Text>
          </View>
          <View className="rounded-lg bg-muted px-3 py-1">
            <Text className="text-xs font-bold text-foreground">A201</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function GridItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="w-[48%]">
      <Card className="h-36 items-center justify-center border-none">
        <View className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Icon icon={icon} size={24} className="text-white" />
        </View>
        <Text className="text-lg font-bold text-foreground">{title}</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </Card>
    </TouchableOpacity>
  );
}
