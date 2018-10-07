const data = [
  [1, 0.1, 0.1, 0, 0],
  [3, 0.2, 0.1, 0, 0],
  [6, 0.2, 0.2, 201, 0],
  [8, 0.2, 0.3, 201, 0]
];

const xData = data.map(item => item[0]);
const yData1 = data.map(item => item[1] || 0);
const yData2 = data.map(item => item[2] || 0);
const yData3 = data.map(item => item[3] || 0);
const yData4 = data.map(item => item[4] || 0);

let maxAmount = 0;
yData3.forEach(v => (maxAmount = maxAmount > i ? maxAmount : i));
yData4.forEach(v => (maxAmount = maxAmount > i ? maxAmount : i));

option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  grid: [
    {
      bottom: '60%'
    },
    {
      top: '60%'
    }
  ],
  xAxis: [
    {
      data: xData,
      gridIndex: 0
    },
    {
      data: xData,
      gridIndex: 1
    }
  ],
  yAxis: [
    {
      name: 'odds',
      type: 'value',
      max: 10,
      gridIndex: 0,
      splitLine: { show: false }
    },
    {
      name: 'pool',
      type: 'value',
      max: maxAmount,
      gridIndex: 1,
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: 'win odds',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: yData1,
      type: 'line',
      smooth: true
    },
    {
      name: 'lose odds',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: yData2,
      type: 'line',
      smooth: true
    },
    {
      name: 'win pool',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: yData3,
      type: 'line',
      smooth: true
    },
    {
      name: 'lose pool',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: yData4,
      type: 'line',
      smooth: true
    }
  ]
};
