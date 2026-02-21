import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/emergency/header';
import { WarningBanner } from '@/components/emergency/warning-banner';
import { GridItem } from '@/components/ui/grid-item';

const Index = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
            title="Search for the nearest emergency exit"
            declaration="Follow the instruction for your safety"
          />
          <View className="w-full">
            <Text className="mb-3">Emergency Numbers</Text>
            <View className="flex-row flex-wrap">
              {[
                { name: 'Police', number: 911, icon: AlertTriangleIcon },
                { name: 'Fire', number: 998, icon: AlertTriangleIcon },
                { name: 'Ambulance', number: 997, icon: AlertTriangleIcon },
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
            className="h-full justify-center rounded-2xl border-4 border-destructive-light bg-destructive"
            onPress={() => router.push('/(tabs)/map')}
          >
            <Text className="text-center text-3xl">Navigate to the nearest exit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
