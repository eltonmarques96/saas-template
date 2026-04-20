import React from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER;

export function AdBanner() {
  return <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />;
}
