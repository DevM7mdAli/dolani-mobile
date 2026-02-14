import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Navigation, Search as SearchIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

/* ── Mock Data ── */
const ROOMS = [
  { id: '1', code: 'A201', type: 'lectureHall', floor: 2, building: 'A' },
  { id: '2', code: 'B105', type: 'computerLab', floor: 1, building: 'B' },
  { id: '3', code: 'A302', type: 'lectureHall', floor: 3, building: 'A' },
  { id: '4', code: 'C110', type: 'computerLab', floor: 1, building: 'C' },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');

  const filtered = ROOMS.filter(
    (r) =>
      r.code.toLowerCase().includes(query.toLowerCase()) ||
      t(`search.${r.type}`).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-background">
      {/* ── HEADER ── */}
      <View style={{ paddingTop: insets.top + 12 }} className="rounded-b-3xl bg-primary px-5 pb-6">
        <Text className="mb-4 text-center text-xl font-bold text-white">{t('search.title')}</Text>

        <View className="flex-row items-center rounded-2xl bg-white/15 px-4 py-3">
          <TextInput
            placeholder={t('search.placeholder')}
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-right text-base text-white"
            autoCapitalize="none"
          />
          <Icon icon={SearchIcon} size={20} className="ml-2 text-white/70" />
        </View>

        <Text className="mt-3 text-right text-sm text-white/70">
          {t('search.roomCount', { count: filtered.length })}
        </Text>
      </View>

      {/* ── RESULTS ── */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((room) => (
          <Card key={room.id} className="mb-3 flex-row items-center justify-between p-4">
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Icon icon={Navigation} size={18} className="text-white" />
            </TouchableOpacity>

            <View className="flex-1 items-end px-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-bold text-foreground">
                  {t(`search.${room.type}`)}
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                {t('search.floor', { floor: room.floor, building: room.building })}
              </Text>
            </View>

            <View className="items-center">
              <View className="rounded-lg bg-muted px-3 py-1.5">
                <Text className="text-sm font-bold text-foreground">{room.code}</Text>
              </View>
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View className="mt-12 items-center">
            <Icon icon={SearchIcon} size={48} className="mb-3 text-muted-foreground" />
            <Text className="text-center text-base text-muted-foreground">
              {t('common.search')}…
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
