import React from 'react'
import { AdMobBanner } from 'expo-ads-admob'
import { LFlashCards } from '../../../app.json'

export default function BannerAd({ onError = (err) => console.log(err), personalizedAds = true }){
    return (<AdMobBanner
        bannerSize="fullBanner"
        adUnitID={LFlashCards.admob.ad_unit_id}
        servePersonalizedAds={personalizedAds}
        onDidFailToReceiveAdWithError={onError}
    />)
}