import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigationStore } from '@/store/useNavigationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { GraphNode } from '@/types/navigation';
import { Navigation, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';

import { useBuildings } from '@/hooks/useLocations';
import { useNavigableLocations, useRoute } from '@/hooks/useNavigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - 32;
const MAP_HEIGHT = MAP_WIDTH * 1.2;

/* ── Scale node coordinates to map canvas ── */
function scaleCoords(
  nodes: GraphNode[],
  width: number,
  height: number,
): Map<number, { sx: number; sy: number }> {
  if (nodes.length === 0) return new Map();

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const padding = 30;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const map = new Map<number, { sx: number; sy: number }>();
  for (const n of nodes) {
    map.set(n.id, {
      sx: padding + ((n.x - minX) / rangeX) * usableW,
      sy: padding + ((n.y - minY) / rangeY) * usableH,
    });
  }
  return map;
}

/* ── Blue Dot component (animated) ── */
function BlueDot({ x, y }: { x: number; y: number }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 1200 }), -1, true);
  }, [pulse]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: x - 12,
            top: y - 12,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: 'rgba(0, 128, 128, 0.25)',
          },
          animStyle,
        ]}
      />
      <View
        style={{
          position: 'absolute',
          left: x - 6,
          top: y - 6,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: '#008080',
          borderWidth: 2,
          borderColor: '#fff',
        }}
      />
    </>
  );
}

export default function MapScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  /* ── Store ── */
  const destinationId = useNavigationStore((s) => s.destinationId);
  const currentLocationId = useNavigationStore((s) => s.currentLocationId);
  const isNavigating = useNavigationStore((s) => s.isNavigating);
  const isEmergency = useNavigationStore((s) => s.isEmergency);
  const routeResult = useNavigationStore((s) => s.routeResult);
  const setRoute = useNavigationStore((s) => s.setRoute);
  const stopNavigation = useNavigationStore((s) => s.stopNavigation);
  const avoidStairs = useSettingsStore((s) => s.avoidStairs);

  /* ── Data ── */
  const { data: allNodes, isLoading: nodesLoading } = useNavigableLocations();
  const { data: buildings } = useBuildings();
  const routeMutation = useRoute();

  /* ── Floor selector ── */
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

  const floorNodes = useMemo(() => {
    if (!allNodes) return [];
    if (!selectedFloorId) return allNodes;
    return allNodes.filter((n) => n.floorId === selectedFloorId);
  }, [allNodes, selectedFloorId]);

  const coords = useMemo(() => scaleCoords(floorNodes, MAP_WIDTH, MAP_HEIGHT), [floorNodes]);

  /* ── Available floors (derived from nodes) ── */
  const availableFloors = useMemo(() => {
    if (!allNodes) return [];
    const floorSet = new Map<number, number>();
    for (const n of allNodes) {
      if (!floorSet.has(n.floorId)) floorSet.set(n.floorId, n.floorId);
    }
    return Array.from(floorSet.keys()).sort((a, b) => a - b);
  }, [allNodes]);

  /* ── Auto-select floor when destination is set ── */
  useEffect(() => {
    if (destinationId && allNodes) {
      const destNode = allNodes.find((n) => n.id === destinationId);
      if (destNode) setSelectedFloorId(destNode.floorId);
    }
  }, [destinationId, allNodes]);

  /* ── Auto-trigger route calculation ── */
  useEffect(() => {
    if (isNavigating && destinationId && currentLocationId && !routeResult) {
      routeMutation.mutate(
        {
          startLocationId: currentLocationId,
          endLocationId: destinationId,
          emergency: isEmergency,
          avoidStairs,
        },
        {
          onSuccess: (result) => setRoute(result),
        },
      );
    }
  }, [isNavigating, destinationId, currentLocationId, routeResult, isEmergency, avoidStairs]);

  /* ── Route path segments on current floor ── */
  const routeSegments = useMemo(() => {
    if (!routeResult || !selectedFloorId) return [];
    const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const pathNodes = routeResult.nodes;

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const a = pathNodes[i]!;
      const b = pathNodes[i + 1]!;
      if (a.floorId !== selectedFloorId || b.floorId !== selectedFloorId) continue;
      const ca = coords.get(a.id);
      const cb = coords.get(b.id);
      if (ca && cb) {
        segments.push({ x1: ca.sx, y1: ca.sy, x2: cb.sx, y2: cb.sy });
      }
    }
    return segments;
  }, [routeResult, selectedFloorId, coords]);

  const routeColor = isEmergency ? '#ef4444' : '#eab308';

  if (nodesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#008080" />
        <Text className="mt-2 text-muted-foreground">{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* ── HEADER ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row items-center justify-between bg-primary px-5 pb-4"
      >
        <Text className="text-xl font-bold text-white">{t('tabs.map')}</Text>
        {isNavigating && (
          <TouchableOpacity onPress={stopNavigation}>
            <View className="flex-row items-center rounded-full bg-white/20 px-3 py-1.5">
              <Icon icon={X} size={14} className="mr-1 text-white" />
              <Text className="text-sm font-medium text-white">Stop</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* ── FLOOR SELECTOR ── */}
      <View className="border-b border-border bg-white px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => setSelectedFloorId(null)}>
              <View
                className={`rounded-full px-4 py-2 ${!selectedFloorId ? 'bg-primary' : 'bg-muted'}`}
              >
                <Text
                  className={`text-sm font-medium ${!selectedFloorId ? 'text-white' : 'text-foreground'}`}
                >
                  {t('common.all')}
                </Text>
              </View>
            </TouchableOpacity>
            {availableFloors.map((floorId) => (
              <TouchableOpacity key={floorId} onPress={() => setSelectedFloorId(floorId)}>
                <View
                  className={`rounded-full px-4 py-2 ${selectedFloorId === floorId ? 'bg-primary' : 'bg-muted'}`}
                >
                  <Text
                    className={`text-sm font-medium ${selectedFloorId === floorId ? 'text-white' : 'text-foreground'}`}
                  >
                    Floor {floorId}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* ── MAP CANVAS ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT, position: 'relative' }}>
          <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
            {/* Background */}
            <Rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} rx={16} fill="#f8fafc" />

            {/* Route path */}
            {routeSegments.map((seg, i) => (
              <Line
                key={`route-${i}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={routeColor}
                strokeWidth={4}
                strokeLinecap="round"
              />
            ))}

            {/* Location nodes */}
            {floorNodes.map((node) => {
              const c = coords.get(node.id);
              if (!c) return null;

              const isDestination = node.id === destinationId;
              const isCurrent = node.id === currentLocationId;
              const isOnRoute = routeResult?.nodes.some((rn) => rn.id === node.id);

              let fill = '#94a3b8'; // default gray
              if (isDestination) fill = '#ef4444';
              else if (isCurrent) fill = '#008080';
              else if (isOnRoute) fill = routeColor;
              else if (node.type === 'EXIT') fill = '#22c55e';
              else if (node.type === 'ELEVATOR' || node.type === 'STAIRS') fill = '#6366f1';

              const radius = isDestination || isCurrent ? 8 : 5;

              return (
                <React.Fragment key={node.id}>
                  <Circle cx={c.sx} cy={c.sy} r={radius} fill={fill} />
                  {(isDestination || node.roomNumber) && (
                    <SvgText
                      x={c.sx}
                      y={c.sy - radius - 4}
                      fontSize={9}
                      fill="#334155"
                      textAnchor="middle"
                    >
                      {node.roomNumber ?? node.name}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Blue Dot overlay for current position */}
          {currentLocationId && coords.get(currentLocationId) && (
            <BlueDot x={coords.get(currentLocationId)!.sx} y={coords.get(currentLocationId)!.sy} />
          )}
        </View>

        {/* ── Route info ── */}
        {routeResult && (
          <View className="mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
            <Text className="text-base font-bold text-foreground">
              {isEmergency ? t('emergency.title') : t('navigation.startNavigation')}
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              {routeResult.nodes.length} waypoints • {routeResult.totalDistance.toFixed(1)}m
            </Text>
          </View>
        )}

        {/* ── No destination message ── */}
        {!isNavigating && !routeResult && (
          <View className="mx-4 mt-4 items-center rounded-xl bg-white p-6">
            <Icon icon={Navigation} size={32} className="mb-2 text-muted-foreground" />
            <Text className="text-center text-sm text-muted-foreground">
              {t('search.placeholder')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
