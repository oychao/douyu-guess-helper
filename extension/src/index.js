const to2Digit = s => ((s + '').length < 2 ? `0${s}` : s);

const initData = function(data = [[Date.now(), 0, 0, 0, 0]]) {
  data = data;

  xData = data.map(item => {
    const d = new Date(item[0]);
    return `${to2Digit(d.getMonth() + 1)}-${to2Digit(d.getDate())}
    ${to2Digit(d.getHours())}:${to2Digit(d.getMinutes())}:${to2Digit(
      d.getSeconds()
    )}`;
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
  infoBox.innerHTML = `
  <span class="meta-key">主播ID：</span><span class="meta-value">${
    meta.path
  }</span>
  <span class="meta-key">时间：</span><span class="meta-value">${
    meta.timestamp
  }</span>
  <span class="meta-key">竞猜问题：</span><span class="meta-value">${
    meta.question
  }</span>
  <span class="meta-key">左选项：</span><span class="meta-value">${
    meta.content.left
  }</span>
  <span class="meta-key">右选项：</span><span class="meta-value">${
    meta.content.right
  }</span>
  `;
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
const infoBox = document.querySelector('#infoBox');

let currentKey;
const renderSelectBox = function() {
  if (Array.from(selectBox.children).length !== localStorage.length) {
    selectBox.innerHTML = Object.keys(localStorage)
      .map(key => {
        const { meta } = JSON.parse(localStorage.getItem(key));
        return {
          key,
          meta
        };
      })
      .sort((m1, m2) => m2.meta.timestamp - m1.meta.timestamp)
      .map(({ key, meta }, idx) => {
        if (idx === 0) {
          currentKey = key;
        }
        const d = new Date(meta.timestamp);
        return `<option value=${key}>${to2Digit(d.getFullYear())}-${to2Digit(
          d.getMonth() + 1
        )}-${to2Digit(d.getDate())} ${to2Digit(d.getHours())}:${to2Digit(
          d.getMinutes()
        )}:${to2Digit(d.getSeconds())}  ${meta.path}</option>`;
      })
      .join('');
  }
};
renderSelectBox();
renderChart(JSON.parse(localStorage[currentKey]));
selectBox.addEventListener('change', function(e) {
  currentKey = e.target.value;
  try {
    const showMatch = JSON.parse(localStorage[currentKey]);
    renderChart(showMatch);
  } catch (error) {
    localStorage.removeItem(currentKey);
    renderSelectBox();
  }
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

const btnClearDirtyData = document.querySelector('#btnClearDirtyData');

btnClearDirtyData.addEventListener('click', function() {
  const keys = Object.keys(localStorage);
  Promise.all(
    keys.map(function(key) {
      return new Promise(resolve => {
        const value = JSON.parse(localStorage.getItem(key));
        console.log(value.data.length);
        if (
          value.data.length < 100 ||
          value.meta.question.includes('飞机航线')
        ) {
          localStorage.removeItem(key);
        } else {
          value.meta.timestamp = value.data[0][0];
          value.data = value.data.sort((d1, d2) => {
            return d1[0] - d2[0];
          });
          localStorage[key] = JSON.stringify(value);
        }
        resolve();
      });
    })
  ).then(() => {
    alert('清洗完成');
    renderSelectBox();
  });
});

selectBox.focus();
