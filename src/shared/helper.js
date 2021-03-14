import {matchSorter} from 'match-sorter'


export const typeMap = type => {
    const mapper = num => ({
      Grass: '#3a6351',
      Poison: '#693c72',
      Fire: '#bb2205',
      Water: '#2bb2bb',
      Flying: '#8fcfd1',
      Bug: '#025955',
      Normal: '#bd9354',
      Electric: '#f4d160',
      Ground: '#85603f',
      Fairy: '#ff75a0',
      Fighting: '#9e7540',
      Psychic: '#822659',
      Ghost: '#845ec2',
      Rock: '#999b84',
      Flower: '#b088f9',
      Ice: '#9ddfd3',
      Dragon: '#ff9a8c',
      Dark: '#1c2b2d',
      Steel: '#99a8b2'
    }[num]);
    if (type?.split(',').length > 1) {
      return type
    }
    return mapper(type);
  }

export function sortPokemon(data, reset) {
  //get random sorting at the group level (via a hashtable)
let randomGroupSortKey = {}
data.forEach(d => randomGroupSortKey[d.name] = Math.random())

//add the sortKey property to the individual array entries
let dataSortable = data.map(x => {
  return {
    ...x,
    sortKey: randomGroupSortKey[x.name]
  }
})

dataSortable.sort((a, b) => a.sortKey - b.sortKey) //sort the groups!

return dataSortable
}


export function paginate (array, size) {
const mappedArray = [];
array.map(data => mappedArray.push(data.num))
  return mappedArray.reduce((acc, val, i) => {
    let idx = Math.floor(i / size)
    let page = acc[idx] || (acc[idx] = [])
    page.push(val)

    return acc
  }, [])
}

export function filterPokemon(arr, pagination) {

     const filtered = arr.filter(data => {
      return pagination?.includes(data.num)
     })
    return filtered
}

export function filterBySearch(arr, value, param) {

  const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
  let returnValue;

  const mappedType = arr.map(data => {
    return data?.variations[0].types
  })

  const mappedNames = arr.map(data => data.name);
  const mappedNum = arr.map(data => data.num);

  const sortedNames = matchSorter(mappedNames, capitalized, {threshold: matchSorter.rankings.CONTAINS});
  const sortedNums = matchSorter(mappedNum, capitalized, {threshold: matchSorter.rankings.CONTAINS});
  const sortedTypes = matchSorter(mappedType, capitalized, {threshold: matchSorter.rankings.CONTAINS});

  const mapSorted = sortedTypes.map(data => {
    return data[0];
  })

  const filterNames = arr.filter(names => {
    return sortedNames.includes(names.name)
  })

  const filterNum = arr.filter(nums => {
    return sortedNums.includes(nums.num)
  })

  const filterTypes = arr.filter(mapped => {
    return mapped.variations[0].types.includes([...new Set(mapSorted)][0])
  })

  if (filterTypes?.length && param)  returnValue = filterTypes
  if (filterNames.length && !param) returnValue = filterNames
  if (filterNum.length) returnValue = filterNum
  if (!value) returnValue = filterPokemon(arr, paginate(arr, 24)[0])
  if(!filterTypes?.length && !filterNames.length && !filterNum.length && value) returnValue = []

  return returnValue
}
