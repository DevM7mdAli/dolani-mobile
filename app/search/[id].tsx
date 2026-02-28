import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';

import { useNavigationStore } from '@/store/useNavigationStore';
import { ArrowLeft, Building2, Layers, Navigation, Share2, Users, Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

import { useLocationDetail } from '@/hooks/useLocations';

/* ── Location type labels ── */
const LOCATION_TYPE_LABELS: Record<string, string> = {
  CLASSROOM: 'Classroom',
  OFFICE: 'Office',
  LAB: 'Lab',
  THEATER: 'Theater',
  CONFERENCE: 'Conference',
  EXIT: 'Exit',
  ELEVATOR: 'Elevator',
  MAIN_HALL: 'Main Hall',
  RESTROOM: 'Restroom',
  STAIRS: 'Stairs',
  SERVICE: 'Service',
  PRAYER_ROOM: 'Prayer Room',
  SERVER_ROOM: 'Server Room',
  CAFETERIA: 'Cafeteria',
  STORE_ROOM: 'Store Room',
  CORRIDOR: 'Corridor',
  LOCKERS: 'Lockers',
  WAITING_HALL: 'Waiting Hall',
  ELECTRICAL_ROOM: 'Electrical Room',
};

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const locationId = Number(id);
  const { data: location, isLoading, isError } = useLocationDetail(locationId);

  const startNavigation = useNavigationStore((s) => s.startNavigation);
  const addRecentNavigation = useNavigationStore((s) => s.addRecentNavigation);

  /* ── Start navigation and jump to map ── */
  const handleNavigate = useCallback(() => {
    if (!location) return;
    startNavigation(location.id);
    addRecentNavigation({
      locationId: location.id,
      name: location.name,
      roomNumber: location.room_number,
      buildingName: location.floor.building.name,
      floorNumber: location.floor.floor_number,
      timestamp: Date.now(),
    });
    router.push('/(tabs)/map');
  }, [location, startNavigation, addRecentNavigation, router]);

  /* ── Share room details ── */
  const handleShare = useCallback(async () => {
    if (!location) return;
    const roomLabel = location.room_number
      ? `${location.name} (${location.room_number})`
      : location.name;
    const equipmentLine =
      location.equipment.length > 0 ? `\nEquipment: ${location.equipment.join(', ')}` : '';
    const message =
      `${roomLabel}\n` +
      `Floor ${location.floor.floor_number}, ${location.floor.building.name}` +
      equipmentLine +
      `\ndolani://search/${location.id}`;

    await Share.share({ message });
  }, [location]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#008080" />
        <Text className="mt-2 text-muted-foreground">{t('common.loading')}</Text>
      </View>
    );
  }

  /* ── Error ── */
  if (isError || !location) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="mb-4 text-center text-base text-muted-foreground">
          {t('common.error')}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <View className="rounded-xl bg-primary px-6 py-3">
            <Text className="font-semibold text-white">{t('common.back')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* ── HEADER ── */}
      <View style={{ paddingTop: insets.top + 8 }} className="rounded-b-3xl bg-primary px-5 pb-6">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Icon icon={ArrowLeft} size={22} className="text-white" />
          </TouchableOpacity>
          <Text className="ml-3 flex-1 text-lg font-bold text-white" numberOfLines={1}>
            {t('room.title')}
          </Text>
        </View>

        {/* Room number + type badges */}
        <View className="flex-row items-center gap-3">
          {location.room_number && (
            <View className="rounded-xl bg-white/20 px-4 py-2">
              <Text className="text-2xl font-extrabold text-white">{location.room_number}</Text>
            </View>
          )}
          <Badge variant="secondary" label={LOCATION_TYPE_LABELS[location.type] ?? location.type} />
        </View>

        <Text className="mt-3 text-xl font-semibold text-white" numberOfLines={2}>
          {location.name}
        </Text>
      </View>

      {/* ── BODY ── */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Location info */}
        <Card className="mb-4 gap-3">
          <View className="flex-row items-center gap-3">
            <Icon icon={Building2} size={18} className="text-primary" />
            <Text className="text-sm text-foreground">
              {location.floor.building.name}
              {location.floor.building.code ? ` (${location.floor.building.code})` : ''}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Icon icon={Layers} size={18} className="text-primary" />
            <Text className="text-sm text-foreground">Floor {location.floor.floor_number}</Text>
          </View>
          {location.department && (
            <View className="flex-row items-center gap-3">
              <Icon icon={Users} size={18} className="text-primary" />
              <Text className="text-sm text-foreground">{location.department.name}</Text>
            </View>
          )}
          {location.capacity > 0 && (
            <View className="flex-row items-center gap-3">
              <Icon icon={Users} size={18} className="text-primary" />
              <Text className="text-sm text-foreground">
                {t('room.capacity', { count: location.capacity })}
              </Text>
            </View>
          )}
        </Card>

        {/* Equipment */}
        {location.equipment.length > 0 && (
          <View className="mb-4">
            <View className="mb-2 flex-row items-center gap-2">
              <Icon icon={Zap} size={16} className="text-primary" />
              <Text className="text-sm font-semibold text-foreground">{t('room.facilities')}</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {location.equipment.map((item) => (
                <Badge key={item} variant="outline" label={item} />
              ))}
            </View>
          </View>
        )}

        {/* Connected paths summary */}
        {(location.outgoing_paths.length > 0 || location.incoming_paths.length > 0) && (
          <Card className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-foreground">Connected to</Text>
            {[
              ...location.outgoing_paths.map((p) => p.end_location),
              ...location.incoming_paths.map((p) => p.start_location),
            ]
              .filter((loc, idx, arr) => arr.findIndex((l) => l.id === loc.id) === idx)
              .slice(0, 6)
              .map((connectedLoc) => (
                <View key={connectedLoc.id} className="flex-row items-center gap-2 py-1">
                  <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <Text className="text-xs text-muted-foreground">
                    {connectedLoc.name}
                    {connectedLoc.room_number ? ` (${connectedLoc.room_number})` : ''}
                  </Text>
                </View>
              ))}
          </Card>
        )}
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <View
        style={{ paddingBottom: insets.bottom + 12 }}
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-border bg-white px-5 pt-3"
      >
        {/* Share */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-primary py-3"
          activeOpacity={0.7}
        >
          <Icon icon={Share2} size={18} className="mr-2 text-primary" />
          <Text className="font-semibold text-primary">{t('room.share')}</Text>
        </TouchableOpacity>

        {/* Navigate */}
        <TouchableOpacity
          onPress={handleNavigate}
          className="flex-[2] flex-row items-center justify-center rounded-xl bg-primary py-3"
          activeOpacity={0.7}
        >
          <Icon icon={Navigation} size={18} className="mr-2 text-white" />
          <Text className="font-semibold text-white">{t('room.navigateToRoom')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
