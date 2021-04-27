import React, {useEffect} from 'react'
import {View} from 'react-native'

export default function FocusScreenEvent({navigation, callback}){
    useEffect(() => navigation.addListener('focus', callback), [])
    return (<View/>)
}