import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  ListRenderItemInfo,
  Button,
  FlatList,
  FlatListProps,
  RefreshControl,
} from 'react-native'

// We'll try just adding 10 items at a time for now. Might need to adjust this
const dataParts = [150, 33, 56, 40, 38, 50, 42, 73, 89, 48]

const getShuffledData = () => {
  return dataParts.sort(() => (Math.random() > 0.5 ? 1 : -1))
}

const renderItem = ({item, index}: ListRenderItemInfo<number>) => {
  const backgroundColor = index % 2 === 0 ? 'green' : 'red'
  return (
    <View
      style={{
        width: '100%',
        height: item * 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
      }}>
      <Text>Element #{index + 1}</Text>
    </View>
  )
}

// These are the props that we always set on `List`
const initialProps: Partial<FlatListProps<number>> = {
  scrollIndicatorInsets: {right: 1},
  scrollEventThrottle: 1,
  style: {flex: 1, paddingTop: 0},
}

export function FlashListRepro() {
  const [data, setData] = React.useState<number[]>(dataParts)
  const [refreshing, setRefreshing] = React.useState<boolean>(false)

  // Simulate a refresh
  React.useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        setData(dataParts)
        setRefreshing(false)
      }, 1500)
    }
  }, [refreshing])

  const onAddDataBelow = React.useCallback(() => {
    setData(prev => [...prev, ...getShuffledData()])
  }, [])

  const onAddDataAbove = React.useCallback(() => {
    setData(prev => [...getShuffledData(), ...prev])
  }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Button title="Add below" onPress={onAddDataBelow} />
        <Button title="Add above" onPress={onAddDataAbove} />
        <Button title="Reset" onPress={() => setData(dataParts)} />
      </View>
      <FlatList<number>
        {...initialProps}
        data={data}
        renderItem={renderItem}
        scrollIndicatorInsets={{right: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
    </SafeAreaView>
  )
}
