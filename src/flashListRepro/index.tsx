import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Button,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native'

/**
 * To repro:
 * - On initial render, we can add 10 or 20 items to the list without issue while maxToRenderPerBatch is set to 20.
 * - If we increase this number to 30, we will get a jump in position after adding the items above.
 * - If we then increase the maxToRenderPerBatch to 30, we can add 30 items above without issue.
 *
 * Notice that the maxToRenderPerBatch seems to need to be set to >= the number of items we are adding.
 */

// Generate unique key list item.
const generateUniqueKey = () => `_${Math.random().toString(36).substr(2, 9)}`

// Initial data for easy reset
const initialData = Array.from(Array(5).keys()).map(n => ({
  id: generateUniqueKey(),
  value: n,
}))

function ListItemInner({item}) {
  const color = item.value % 2 === 0 ? 'green' : 'red'

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: color,
        height: item.value === 0 ? Dimensions.get('screen').height / 2 : 100,
      }}>
      <Text>List item: {item.value}</Text>
    </View>
  )
}

const ListItem = React.memo(ListItemInner)

export function FlatListRepro() {
  const [numToAdd, setNumToAdd] = React.useState(10)
  const [numbers, setNumbers] = React.useState(initialData)

  const addAbove = () => {
    setNumbers(prev => {
      const additionalNumbers = Array.from(Array(numToAdd).keys())
        .map(n => ({
          id: generateUniqueKey(),
          value: prev[0].value - n - 1,
        }))
        .reverse()

      return additionalNumbers.concat(prev)
    })
  }

  const renderItem = React.useCallback(({item}) => {
    return <ListItem item={item} />
  }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Button title="Add Above" onPress={addAbove} />
        <Button title="Reset" onPress={() => setNumbers(initialData)} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Button
          title="Add More"
          onPress={() => setNumToAdd(prev => prev + 10)}
        />
        <Button
          title="Add Less"
          onPress={() => setNumToAdd(prev => prev - 10)}
        />
        <Text>Adding: {numToAdd}</Text>
      </View>
      <View>
        <FlatList
          data={numbers}
          keyExtractor={item => item.id}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          renderItem={renderItem}
          // If we render all of them at once, there is no jump
          maxToRenderPerBatch={20}
        />
      </View>
    </SafeAreaView>
  )
}
