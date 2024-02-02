import React from 'react'
// Going to use list to easily copy over the options we are using
import {
  SafeAreaView,
  View,
  Text,
  ListRenderItemInfo,
  Button,
} from 'react-native'
import {List} from 'view/com/util/List'

// Initial data that we have

const dataParts = [150, 33, 56, 40, 38, 50, 10]

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

export function FlashListRepro() {
  const [data, setData] = React.useState<number[]>(dataParts)

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Button title="Add below" />
        <Button title="Add above" />
      </View>
      <List<number> data={data} renderItem={renderItem} />
    </SafeAreaView>
  )
}
