import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Button,
  ListRenderItemInfo,
} from 'react-native'

type Item = {
  id: string
  value: number
}

// Generate unique key list item.
const generateUniqueKey = () => `_${Math.random().toString(36).substr(2, 9)}`

const initialData = Array.from(Array(10).keys()).map(n => ({
  id: generateUniqueKey(),
  value: n,
}))

const generateHeight = () => {
  return Math.round(Math.random() * (300 - 100 + 1) + 100)
}

function ListItem({
  item,
  shouldResize,
  reword,
}: {
  item: Item
  shouldResize: boolean
  reword: boolean
}) {
  const color = item.value % 2 === 0 ? 'green' : 'red'
  const [height, setHeight] = React.useState(generateHeight())

  // There should be the possibility of the item resizing
  // 20% chance
  React.useEffect(() => {
    if (shouldResize && item.value < 0) {
      setTimeout(() => {
        setHeight(generateHeight())
      }, 1500)
    }
  }, [item, shouldResize])

  return (
    <View style={{width: '100%', backgroundColor: color, height}}>
      <Text>List item: {item.value}</Text>
      {reword && <Text>Big!</Text>}
    </View>
  )
}

export function FlatListRepro() {
  const [numToAdd, setNumToAdd] = React.useState(10)
  const [numbers, setNumbers] = React.useState(initialData)
  const [shouldResize, setShouldResize] = React.useState(false)

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

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<Item>) => {
      if (numbers.length > 20 && item.value === 0) {
        return <ListItem item={item} shouldResize={shouldResize} reword />
      }

      return <ListItem item={item} shouldResize={shouldResize} reword={false} />
    },
    [shouldResize, numbers],
  )

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Button title="Add Above" onPress={addAbove} />
        <Button
          title={`Set Should Resize (${shouldResize})`}
          onPress={() => setShouldResize(prev => !prev)}
        />
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
            minIndexForVisible: 1,
          }}
          renderItem={renderItem}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
        />
      </View>
    </SafeAreaView>
  )
}
