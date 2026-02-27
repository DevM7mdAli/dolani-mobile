import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useNavigationStore } from '@/store/useNavigationStore';
import type { Professor } from '@/types/faculty';
import type { Location, LocationType } from '@/types/location';
import { Building2, Filter, Navigation, Search as SearchIcon, Users, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

import { useFacultySearch } from '@/hooks/useFaculty';
import { useBuildings, useLocations } from '@/hooks/useLocations';

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
};

/* ── Filterable type options ── */

const SEARCH_TYPE_FILTERS: { label: string; value: LocationType }[] = [
  { label: 'Classroom', value: 'CLASSROOM' },
  { label: 'Office', value: 'OFFICE' },
  { label: 'Lab', value: 'LAB' },
  { label: 'Theater', value: 'THEATER' },
  { label: 'Conference', value: 'CONFERENCE' },
  { label: 'Prayer Room', value: 'PRAYER_ROOM' },
  { label: 'Cafeteria', value: 'CAFETERIA' },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ filter?: string }>();

  /* ── State ── */
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mode, setMode] = useState<'rooms' | 'faculty'>(
    params.filter === 'doctor' ? 'faculty' : 'rooms',
  );
  const [selectedType, setSelectedType] = useState<LocationType | undefined>();
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  /* ── Navigation store ── */
  const startNavigation = useNavigationStore((s) => s.startNavigation);
  const addRecentNavigation = useNavigationStore((s) => s.addRecentNavigation);

  /* ── Debounce search input ── */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  /* ── Data hooks ── */
  const locationsQuery = useLocations({
    search: debouncedQuery || undefined,
    type: selectedType,
    buildingId: selectedBuildingId,
    page,
    limit: 20,
  });

  const facultyQuery = useFacultySearch(debouncedQuery);
  const buildingsQuery = useBuildings();

  const locations = locationsQuery.data?.data ?? [];
  const totalLocations = locationsQuery.data?.meta.total ?? 0;
  const totalPages = locationsQuery.data?.meta.totalPages ?? 1;
  const professors = facultyQuery.data ?? [];

  /* ── Navigate to a location ── */
  const navigateToLocation = useCallback(
    (loc: Location) => {
      startNavigation(loc.id);
      addRecentNavigation({
        locationId: loc.id,
        name: loc.name,
        roomNumber: loc.room_number,
        buildingName: loc.floor.building.name,
        floorNumber: loc.floor.floor_number,
        timestamp: Date.now(),
      });
      router.push('/(tabs)/map');
    },
    [startNavigation, addRecentNavigation, router],
  );

  /* ── Navigate to faculty office ── */
  const navigateToFaculty = useCallback(
    (prof: Professor) => {
      if (prof.location_id) {
        startNavigation(prof.location_id);
        router.push('/(tabs)/map');
      }
    },
    [startNavigation, router],
  );

  /* ── Clear filters ── */
  const clearFilters = useCallback(() => {
    setSelectedType(undefined);
    setSelectedBuildingId(undefined);
    setPage(1);
  }, []);

  const hasActiveFilters = selectedType || selectedBuildingId;

  /* ── Render a location card ── */
  const renderLocationItem = useCallback(
    ({ item }: { item: Location }) => (
      <TouchableOpacity className="px-4" onPress={() => navigateToLocation(item)}>
        <Card className="mb-3 flex-row items-center justify-between p-4">
          <View className="items-center">
            <View className="rounded-lg bg-muted px-3 py-1.5">
              <Text className="text-sm font-bold text-foreground">{item.room_number ?? '—'}</Text>
            </View>
          </View>
          <View className="flex-1 items-start px-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              <Badge variant="secondary" label={LOCATION_TYPE_LABELS[item.type] ?? item.type} />
            </View>
            <Text className="text-xs text-muted-foreground">
              {t('search.floor', {
                floor: item.floor.floor_number,
                building: item.floor.building.name,
              })}
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Icon icon={Navigation} size={18} className="text-white" />
          </View>
        </Card>
      </TouchableOpacity>
    ),
    [navigateToLocation, t],
  );

  /* ── Render a professor card ── */
  const renderFacultyItem = useCallback(
    ({ item }: { item: Professor }) => (
      <TouchableOpacity
        className="px-4"
        onPress={() => navigateToFaculty(item)}
        disabled={!item.location_id}
      >
        <Card className="mb-3 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-start">
              <Text className="text-base font-bold text-foreground">{item.full_name}</Text>
              <Text className="text-xs text-muted-foreground">{item.department.name}</Text>
              {item.office && (
                <Text className="mt-1 text-xs text-muted-foreground">
                  {t('faculty.office', { room: item.office.room_number ?? item.office.name })}
                </Text>
              )}
              {item.office_hours.length > 0 && (
                <Text className="mt-0.5 text-xs text-muted-foreground">
                  {item.office_hours
                    .map((oh) => `${oh.day.slice(0, 3)} ${oh.start_time}-${oh.end_time}`)
                    .join(', ')}
                </Text>
              )}
            </View>
            <View className="items-center gap-2">
              <Badge
                variant={item.status === 'AVAILABLE' ? 'success' : 'destructive'}
                label={item.status === 'AVAILABLE' ? t('common.available') : t('common.busy')}
              />
              {item.location_id && (
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Icon icon={Navigation} size={18} className="text-white" />
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    ),
    [navigateToFaculty, t],
  );

  /* ── Pagination ── */
  const handleLoadMore = useCallback(() => {
    if (page < totalPages && !locationsQuery.isFetching) {
      setPage((p) => p + 1);
    }
  }, [page, totalPages, locationsQuery.isFetching]);

  const isLoading = mode === 'rooms' ? locationsQuery.isLoading : facultyQuery.isLoading;

  return (
    <View className="flex-1 bg-background">
      {/* ── HEADER ── */}
      <View style={{ paddingTop: insets.top + 12 }} className="rounded-b-3xl bg-primary px-5 pb-5">
        <Text className="mb-4 text-center text-xl font-bold text-white">{t('search.title')}</Text>

        {/* Search input */}
        <View className="flex-row items-center rounded-2xl bg-white/15 px-4 py-3">
          <TextInput
            placeholder={t('search.placeholder')}
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-right text-base text-white"
            autoCapitalize="none"
            returnKeyType="search"
          />
          <Icon icon={SearchIcon} size={20} className="ml-2 text-white/70" />
        </View>

        {/* Mode toggle + filter button */}
        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row rounded-lg bg-white/15 p-1">
            <TouchableOpacity
              onPress={() => setMode('rooms')}
              className={`flex-row items-center rounded-md px-3 py-1.5 ${mode === 'rooms' ? 'bg-white/25' : ''}`}
            >
              <Icon icon={Building2} size={14} className="mr-1 text-white" />
              <Text className="text-sm font-medium text-white">{t('common.rooms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('faculty')}
              className={`flex-row items-center rounded-md px-3 py-1.5 ${mode === 'faculty' ? 'bg-white/25' : ''}`}
            >
              <Icon icon={Users} size={14} className="mr-1 text-white" />
              <Text className="text-sm font-medium text-white">{t('common.members')}</Text>
            </TouchableOpacity>
          </View>

          {mode === 'rooms' && (
            <View className="flex-row items-center gap-2">
              {hasActiveFilters && (
                <TouchableOpacity onPress={clearFilters}>
                  <View className="rounded-full bg-white/25 p-1.5">
                    <Icon icon={X} size={14} className="text-white" />
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowFilters((v) => !v)}>
                <View className="rounded-full bg-white/25 p-2">
                  <Icon icon={Filter} size={16} className="text-white" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Count */}
        <View className="items-start">
          <Text className="mt-2 text-start text-sm text-white/70">
            {mode === 'rooms'
              ? t('search.roomCount', { count: totalLocations })
              : t('faculty.memberCount', { count: professors.length })}
          </Text>
        </View>
      </View>

      {/* ── FILTER CHIPS (rooms mode) ── */}
      {mode === 'rooms' && showFilters && (
        <View className="border-b border-border bg-white px-4 py-3">
          {/* Type filters */}
          <View className="mb-2 flex-row flex-wrap gap-2">
            <Text className="mb-1 w-full text-xs font-medium text-muted-foreground">
              {t('common.all')} — Type
            </Text>
            {SEARCH_TYPE_FILTERS.map((tf) => (
              <TouchableOpacity
                key={tf.value}
                onPress={() =>
                  setSelectedType((prev) => (prev === tf.value ? undefined : tf.value))
                }
              >
                <Badge
                  variant={selectedType === tf.value ? 'default' : 'outline'}
                  label={tf.label}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Building filters */}
          {buildingsQuery.data && buildingsQuery.data.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              <Text className="mb-1 w-full text-xs font-medium text-muted-foreground">
                Building
              </Text>
              {buildingsQuery.data.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() =>
                    setSelectedBuildingId((prev) => (prev === b.id ? undefined : b.id))
                  }
                >
                  <Badge
                    variant={selectedBuildingId === b.id ? 'default' : 'outline'}
                    label={`${b.name} (${b.code})`}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── RESULTS ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#008080" />
          <Text className="mt-2 text-muted-foreground">{t('common.loading')}</Text>
        </View>
      ) : mode === 'rooms' ? (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLocationItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={locationsQuery.isRefetching}
          onRefresh={() => locationsQuery.refetch()}
          ListFooterComponent={
            locationsQuery.isFetching && page > 1 ? (
              <ActivityIndicator size="small" color="#008080" className="py-4" />
            ) : null
          }
          ListEmptyComponent={
            <View className="mt-12 items-center">
              <Icon icon={SearchIcon} size={48} className="mb-3 text-muted-foreground" />
              <Text className="text-center text-base text-muted-foreground">
                {debouncedQuery ? t('common.error') : t('common.search') + '…'}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={professors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFacultyItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={facultyQuery.isRefetching}
          onRefresh={() => facultyQuery.refetch()}
          ListEmptyComponent={
            <View className="mt-12 items-center">
              <Icon icon={Users} size={48} className="mb-3 text-muted-foreground" />
              <Text className="text-center text-base text-muted-foreground">
                {debouncedQuery.length >= 2 ? t('common.error') : t('faculty.searchPlaceholder')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
