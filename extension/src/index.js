const initData = function(data = [[Date.now(), 0, 0, 0, 0]]) {
  data = data;

  xData = data.map(item => {
    const d = new Date(item[0]);
    return `${d.getMonth()}-${d.getDate()}
    ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  });
  yData1 = data.map(item => item[1] || 0);
  yData2 = data.map(item => item[2] || 0);
  yData3 = data.map(item => ((item[2] || 0) * 10 - (item[1] || 0) * 10) / 10);
  yData4 = data.map(item => item[3] || 0);
  yData5 = data.map(item => item[4] || 0);
  yData6 = yData4.map((item, idx) => {
    idx = idx === 0 ? 1 : idx;
    return item - yData4[idx - 1];
  });
  yData7 = yData5.map((item, idx) => {
    idx = idx === 0 ? 1 : idx;
    return item - yData5[idx - 1];
  });
};
initData();

const myChart = echarts.init(document.querySelector('#chart'), 'dark');

const option = {
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
      bottom: '81%'
    },
    {
      bottom: '54%',
      top: '27%'
    },
    {
      bottom: '27%',
      top: '54%'
    },
    {
      top: '81%'
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
    },
    {
      data: xData,
      gridIndex: 2
    },
    {
      data: xData,
      gridIndex: 3
    }
  ],
  yAxis: [
    {
      name: '赔率',
      type: 'value',
      gridIndex: 0,
      splitLine: { show: false }
    },
    {
      name: '赔率差',
      type: 'value',
      gridIndex: 1,
      splitLine: { show: false }
    },
    {
      name: '鱼丸',
      type: 'value',
      gridIndex: 2,
      splitLine: { show: false },
      axisLabel: {
        formatter(value) {
          return value >= 1e4 ? `${value / 1e4}万` : value;
        }
      }
    },
    {
      name: '鱼丸',
      type: 'value',
      gridIndex: 3,
      splitLine: { show: false },
      axisLabel: {
        formatter(value) {
          return value >= 1e4 ? `${value / 1e4}万` : value;
        }
      }
    }
  ],
  series: [
    {
      name: '左赔率',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: yData1,
      type: 'line',
      smooth: true
    },
    {
      name: '右赔率',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: yData2,
      type: 'line',
      smooth: true
    },
    {
      name: '赔率差',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: yData3,
      type: 'line',
      smooth: true
    },
    {
      name: '左押注',
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: yData4,
      type: 'line',
      smooth: true
    },
    {
      name: '右押注',
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: yData5,
      type: 'line',
      smooth: true
    },
    {
      name: '左押注差',
      xAxisIndex: 3,
      yAxisIndex: 3,
      data: yData6,
      type: 'line',
      smooth: true
    },
    {
      name: '右押注差',
      xAxisIndex: 3,
      yAxisIndex: 3,
      data: yData7,
      type: 'line',
      smooth: true
    }
  ]
};

myChart.setOption(option);

// ================================
const renderChart = function(match) {
  const { meta, data } = match;
  initData(data);
  myChart.setOption({
    xAxis: [{ data: xData }, { data: xData }, { data: xData }, { data: xData }],
    series: [
      {
        data: yData1
      },
      {
        data: yData2
      },
      {
        data: yData3
      },
      {
        data: yData4
      },
      {
        data: yData5
      },
      {
        data: yData6
      },
      {
        data: yData7
      }
    ]
  });
};

const selectBox = document.querySelector('#selectBox');

const renderSelectBox = function() {
  if (Array.from(selectBox.children).length !== localStorage.length) {
    selectBox.innerHTML = Object.keys(localStorage)
      .map(k => `<option value=${k}>${k}</option>`)
      .reverse()
      .join('');
  }
};
renderSelectBox();
let currentKey = Object.keys(localStorage).pop();
renderChart(JSON.parse(localStorage[currentKey]));
selectBox.addEventListener('change', function(e) {
  currentKey = e.target.value;
  renderChart(JSON.parse(localStorage[currentKey]));
});

window.addEventListener('storage', function(e) {
  renderSelectBox();
  if (e.key === currentKey) {
    renderChart(JSON.parse(e.newValue));
  }
});

window.addEventListener('resize', function() {
  myChart.resize();
});
