import React from 'react';
import {
  Alert,
  DevSettings,
  I18nManager,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Updates from 'expo-updates';
import { ChevronLeft, Globe, Info, Mail, Map } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const changeLanguage = async (lang: 'ar' | 'en') => {
    const isRTL = lang === 'ar';

    // 1. Change text immediately
    await i18n.changeLanguage(lang);

    // 2. Only reload if layout direction actually needs to change
    if (isRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);

      // 3. Handle the Reload based on Environment
      try {
        if (__DEV__) {
          // In Development: Use Native DevSettings
          DevSettings.reload();
        } else {
          // In Production: Use Expo Updates
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Fallback if both fail
        Alert.alert('Restart Required', 'Please restart the app manually to apply changes.');
      }
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{ paddingTop: insets.top + 20 }}
        className="mb-0 items-center justify-center rounded-b-3xl bg-primary pb-24"
      >
        <Text className="text-2xl font-bold text-white">{t('settings.title')}</Text>
        <Text className="text-sm text-white/70">{t('settings.subtitle')}</Text>
      </View>

      <View className="-mt-14 px-5">
        {/* ── GENERAL PREFERENCES ── */}
        <Text className="mb-2 text-right text-sm font-medium text-muted-foreground">
          {t('settings.generalPreferences')}
        </Text>
        <Card className="mb-6 overflow-hidden p-0">
          {/* Language */}
          <View className="flex-row items-center justify-between border-b border-muted p-4">
            <View className="flex-row rounded-lg bg-muted p-1">
              <TouchableOpacity
                onPress={() => changeLanguage('ar')}
                className={`rounded px-4 py-1.5 ${i18n.language === 'ar' ? 'bg-primary' : ''}`}
              >
                <Text
                  className={`font-medium ${i18n.language === 'ar' ? 'text-white' : 'text-muted-foreground'}`}
                >
                  العربية
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeLanguage('en')}
                className={`rounded px-4 py-1.5 ${i18n.language === 'en' ? 'bg-primary' : ''}`}
              >
                <Text
                  className={`font-medium ${i18n.language === 'en' ? 'text-white' : 'text-muted-foreground'}`}
                >
                  English
                </Text>
              </TouchableOpacity>
            </View>
            <View className="items-end">
              <Text className="text-base font-semibold text-foreground">
                {t('settings.language')}
              </Text>
            </View>
            <View className="mr-3 rounded-full bg-blue-100 p-2">
              <Icon icon={Globe} size={20} className="text-blue-600" />
            </View>
          </View>
        </Card>

        {/* ── NAVIGATION PREFERENCES ── */}
        <Text className="mb-2 text-right text-sm font-medium text-muted-foreground">
          {t('settings.navigationPreferences')}
        </Text>
        <Card className="mb-6 p-4">
          <View className="mb-3 flex-row items-center justify-between rounded-lg bg-muted/30 p-2">
            <Switch
              trackColor={{ false: '#e2e8f0', true: '#008080' }}
              thumbColor="#fff"
              ios_backgroundColor="#3e3e3e"
            />
            <View className="flex-1 items-end pr-3">
              <Text className="text-base font-semibold text-foreground">
                {t('settings.avoidElevators')}
              </Text>
            </View>
            <View className="rounded-full bg-muted p-2">
              <Icon icon={Map} size={20} className="text-foreground" />
            </View>
          </View>

          <View className="flex-row items-center justify-between rounded-lg bg-muted/30 p-2">
            <Switch
              trackColor={{ false: '#e2e8f0', true: '#008080' }}
              thumbColor="#fff"
              ios_backgroundColor="#3e3e3e"
            />
            <View className="flex-1 items-end pr-3">
              <Text className="text-base font-semibold text-foreground">
                {t('settings.avoidStairs')}
              </Text>
            </View>
            <View className="rounded-full bg-muted p-2">
              <Icon icon={Map} size={20} className="text-foreground" />
            </View>
          </View>
        </Card>

        {/* ── ABOUT APP ── */}
        <Text className="mb-2 text-right text-sm font-medium text-muted-foreground">
          {t('settings.aboutApp')}
        </Text>
        <Card className="overflow-hidden p-0">
          <SettingsRow
            icon={Info}
            title={t('settings.appVersion')}
            subtitle="v2.1.0"
            badge={t('settings.latest')}
          />
          <View className="h-[1px] bg-muted" />
          <SettingsRow
            icon={Mail}
            title={t('settings.support')}
            subtitle="support@dolani.sa"
            hasChevron
          />
        </Card>
      </View>
    </ScrollView>
  );
}

function SettingsRow({
  icon: IconComp,
  title,
  subtitle,
  badge,
  hasChevron,
}: {
  icon: any;
  title: string;
  subtitle: string;
  badge?: string;
  hasChevron?: boolean;
}) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-muted/50">
      <View className="flex-row items-center">
        {hasChevron && <Icon icon={ChevronLeft} size={20} className="text-muted-foreground" />}
        {badge && (
          <View className="mr-2 rounded-full bg-primary px-2 py-0.5">
            <Text className="text-[10px] font-bold text-white">{badge}</Text>
          </View>
        )}
      </View>

      <View className="flex-1 items-end pr-3">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>

      <View className="rounded-full bg-muted p-2">
        <IconComp size={20} className="text-foreground" />
      </View>
    </TouchableOpacity>
  );
}
