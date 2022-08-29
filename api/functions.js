export const objToStr = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value ?? 'null'}`)
    .join(', ')
}

export const objTokv = (obj) => {
  return `이름:${obj.name ?? ' '},${
    obj.ipaddress ? ' 아이피주소:' + obj.ipaddress + ',' : ''
  } Index: ${obj.index}, Type:${obj.deviceType}, Mode:${obj.mode}`
}

export const zoneToStr = (obj) => {
  const children = []
  for (let i = 0; i < obj.children.length; i++) {
    if (obj.children[i]) {
      children.push(`${i + 1}:${obj.children[i].name}`)
    }
    if (obj.children[i] == null) {
      children.push(`${i + 1}: Null`)
    }
  }
  return `이름=${obj.name}, 코어이름:${obj.core.name}, 코어주소:${
    obj.core.ipaddress
  }, Index:${obj.index}, 방송지역: ${children.join(',')}`
}
