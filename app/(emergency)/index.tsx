import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';

import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/emergency/header';
import { WarningBanner } from '@/components/emergency/warning-banner';

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
          {[
            { name: 'Police', number: 911 },
            { name: 'Fire', number: 998 },
            { name: 'ambulance', number: 997 },
          ].map((card) => (
            <View key={card.number}></View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
