 function getSolution (point) {
  const [x, y] = point
  const { des, records } = getNearestSolver(`${x},${y}`)
  const sixDir = getNeighbours(`${x},${y}`)
  const routes = []
  let nextPos = des

  // 反向寻找第一个坐标
  while (nextPos && !sixDir.includes(nextPos)) {
    routes.push(nextPos)
    nextPos = records[nextPos].source
  }

  return { nextPos, routes: routes.concat(nextPos) }
}

/**
 * BFS 求离出口最短路径
 *
 * 1. 初始化一个队列，添加起点
 * 2. 遍历队列中每一个元素，与它周围 6 个相邻块
 *     * 若没遍历过，查找周围是否有出口
 *     * 若无出口，添加进队列
 * 3. 循环停止条件
 *     * 寻找到出口，即为最短路径，返回该出口
 *     * 所有相邻点均遍历，无出口，玩家胜利 ✌️
 */
function getNearestSolver (point) {
  const records = {}
  let arr = [point]
  let des = null

  while (arr.length) {
    const V = arr.shift()
    const neighbours = getNeighbours(V).filter(p => typeof status[p] !== 'undefined' && !status[p].isWall && !status[p].hasVisited)
    // 优化：树型结构
    neighbours.forEach(p => {
      records[p] = { source: V }
      status[p].hasVisited = true
    })

    const hasEdge = neighbours.find(p => status[p].isEdge)
    arr = arr.concat(neighbours)
    if (hasEdge) {
      des = hasEdge
      break
    }
  }

  // 遍历结束，重置元素访问状态
  for (const s of Object.values(status)) {
    s.hasVisited = false
  }

  return { des, records }
}

function getNeighbours (point) {
  const split = point.split(',')
  const x = +split[0]
  const y = +split[1]

  const commonDir = [`${x},${y+1}`, `${x+1},${y}`, `${x},${y-1}`, `${x-1},${y}`]
  const differentDir = y % 2 ? [`${x+1},${y+1}`, , `${x+1},${y-1}`] : [`${x-1},${y+1}`, `${x-1},${y-1}`]

  return commonDir.concat(differentDir)
}

/**
 * 返回随机障碍物坐标，需在棋盘范围内 && 不为硬币初始位置 && 不重复
 */
function getRandomPoints () {
  const randomCount = 8
  const randomPoints = []
  let addCount = 0

  while (addCount < randomCount) {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    const pointStr = `${x},${y}`
    if ((x === 5 && y === 5) || randomPoints.find(list => list.pointStr === pointStr)) continue

    randomPoints.push(pointStr)
    addCount++
  }

  return randomPoints
}
