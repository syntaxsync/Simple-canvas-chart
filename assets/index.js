const calculateMovingAverage = (data, period) => {
  const ma = [];

  for (let i = 0; i < data.length; i++) {
    if (i >= period) {
      const sum = data.slice(i - period, i).reduce((a, b) => {
        return a + b.close;
      }, 0);
      ma.push({
        ma: sum / period,
        date: data[i].date,
      });
    }
  }

  return ma;
};

const drawMAChart = (
  id,
  data,
  options = {
    width: 600,
    height: 400,
    strokeColor: "green",
    period: 20,
    padding: 60,
    stepOnYAxis: 10,
  }
) => {
  const {
    width: canvas_width,
    height: canvas_height,
    strokeColor,
    period,
    padding,
    stepOnYAxis,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  document.body.appendChild(canvas);

  const toolkit = document.createElement("div");
  toolkit.className = "toolkit";

  document.body.appendChild(toolkit);

  const ctx = canvas.getContext("2d");

  const chart_width = canvas_width - padding * 2;
  const chart_height = canvas_height - padding * 2;

  // calculating moving average

  const ma = calculateMovingAverage(data, period);

  const { values, labels } = ma.reduce(
    (accu, curr) => {
      return {
        values: [...accu.values, curr.ma],
        labels: [...accu.labels, curr.date],
      };
    },
    {
      values: [],
      labels: [],
    }
  );

  // calculating max and min values

  const max = Math.ceil(Math.max(...values));
  const min = Math.floor(Math.min(...values));

  // steps
  const stepX = chart_width / (values.length - 1);
  const stepY = chart_height / stepOnYAxis;

  // drawing chart title and subtitle
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${period} Days Moving Average(MA)`,
    canvas_width / 2,
    padding / 2
  );

  ctx.font = "12px Arial";
  ctx.fillText(
    `IBM, ${labels[0]} to ${labels[labels.length - 1]}`,
    canvas_width / 2,
    padding / 2 + 20
  );

  // drawing y axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + chart_height);
  ctx.stroke();

  // drawing x axis
  ctx.beginPath();
  ctx.moveTo(padding, padding + chart_height);
  ctx.lineTo(padding + chart_width, padding + chart_height);
  ctx.stroke();

  // drawing reference lines
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  ctx.setLineDash([5, 5]);

  for (let i = 0; i <= stepOnYAxis; i++) {
    ctx.moveTo(padding, padding + i * stepY);
    ctx.lineTo(padding + chart_width, padding + i * stepY);
  }

  ctx.stroke();

  // drawing reference lines for x axis
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  ctx.setLineDash([5, 5]);

  for (let i = 0; i < values.length; i++) {
    ctx.moveTo(padding + i * stepX, padding);
    ctx.lineTo(padding + i * stepX, padding + chart_height);
  }

  ctx.stroke();

  // drawing labels for y axis with markers on the left
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";

  for (let i = 0; i <= stepOnYAxis; i++) {
    ctx.fillText(
      (max - (max - min) * (i / stepOnYAxis)).toFixed(1),
      30,
      padding + i * stepY
    );
  }

  // drawing labels for x axis rotated 45 degrees
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let i = 0; i < labels.length; i++) {
    const x = stepX * i;
    ctx.save();
    ctx.translate(x + padding, canvas_height - padding + 5);
    ctx.rotate(Math.PI / 4);
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  }

  ctx.restore();

  // drawing line chart
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);

  for (let i = 0; i < values.length; i++) {
    const x = stepX * i;
    const y = (chart_height * (max - values[i])) / (max - min);

    if (i === 0) {
      ctx.moveTo(padding + x, padding + y);
    } else {
      ctx.lineTo(padding + x, padding + y);
      ctx.stroke();
    }

    // drawing markers
    ctx.beginPath();
    ctx.arc(padding + x, padding + y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  }

  ctx.stroke();

  // adding event listeners in the above toolkit on values points
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const stepX = chart_width / (values.length - 1);

    const index = Math.floor((x - padding) / stepX);
    const value = values[index];

    if (value) {
      toolkit.style.display = "block";
      toolkit.style.left = e.pageX + 10 + "px";
      toolkit.style.top = e.pageY + 10 + "px";
      toolkit.innerHTML = `<div>Date: ${
        labels[index]
      }</div><div>MA(20): ${value.toFixed(2)}</div>`;
    } else {
      toolkit.style.display = "none";
    }
  });

  canvas.addEventListener("mouseleave", () => {
    toolkit.style.display = "none";
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const historicalData = [
    {
      date: "2023-04-11",
      open: 130.58,
      high: 131.1,
      low: 130.18,
      close: 130.42,
      volume: 3132430,
    },
    {
      date: "2023-04-12",
      open: 130.4,
      high: 130.89,
      low: 128.17,
      close: 128.54,
      volume: 3957542,
    },
    {
      date: "2023-04-13",
      open: 128.01,
      high: 128.39,
      low: 126,
      close: 127.9,
      volume: 5621512,
    },
    {
      date: "2023-04-14",
      open: 128.46,
      high: 129.84,
      low: 127.31,
      close: 128.14,
      volume: 4180614,
    },
    {
      date: "2023-04-17",
      open: 128.3,
      high: 128.72,
      low: 126.8,
      close: 127.82,
      volume: 3662666,
    },
    {
      date: "2023-04-18",
      open: 128.14,
      high: 128.68,
      low: 127.35,
      close: 127.78,
      volume: 3193787,
    },
    {
      date: "2023-04-19",
      open: 126.5,
      high: 126.98,
      low: 125.3,
      close: 126.32,
      volume: 7014368,
    },
    {
      date: "2023-04-20",
      open: 130.15,
      high: 130.98,
      low: 125.84,
      close: 126.36,
      volume: 9749618,
    },
    {
      date: "2023-04-21",
      open: 126,
      high: 126.7,
      low: 125.27,
      close: 125.73,
      volume: 6725426,
    },
    {
      date: "2023-04-24",
      open: 125.55,
      high: 126.05,
      low: 124.56,
      close: 125.4,
      volume: 4043892,
    },
    {
      date: "2023-04-25",
      open: 124.9,
      high: 126.19,
      low: 124.76,
      close: 125.89,
      volume: 4275396,
    },
    {
      date: "2023-04-26",
      open: 125.81,
      high: 126.55,
      low: 125.12,
      close: 125.85,
      volume: 4070168,
    },
    {
      date: "2023-04-27",
      open: 126.37,
      high: 127.02,
      low: 125.46,
      close: 126.97,
      volume: 3204889,
    },
    {
      date: "2023-04-28",
      open: 126.58,
      high: 127.25,
      low: 125.64,
      close: 126.41,
      volume: 5061247,
    },
    {
      date: "2023-05-01",
      open: 126.35,
      high: 126.75,
      low: 126.06,
      close: 126.09,
      volume: 2724992,
    },
    {
      date: "2023-05-02",
      open: 126.3,
      high: 126.45,
      low: 123.27,
      close: 125.16,
      volume: 4445283,
    },
    {
      date: "2023-05-03",
      open: 125.46,
      high: 125.57,
      low: 123.26,
      close: 123.45,
      volume: 4554212,
    },
    {
      date: "2023-05-04",
      open: 123.03,
      high: 123.52,
      low: 121.76,
      close: 122.57,
      volume: 4468237,
    },
    {
      date: "2023-05-05",
      open: 123.11,
      high: 124.1,
      low: 122.81,
      close: 123.65,
      volume: 4971936,
    },
    {
      date: "2023-05-08",
      open: 123.76,
      high: 123.92,
      low: 122.55,
      close: 123.4,
      volume: 3663818,
    },
    {
      date: "2023-05-09",
      open: 121.9,
      high: 121.97,
      low: 120.66,
      close: 121.17,
      volume: 4540047,
    },
    {
      date: "2023-05-10",
      open: 121.99,
      high: 122.49,
      low: 121.1,
      close: 122.02,
      volume: 4189222,
    },
    {
      date: "2023-05-11",
      open: 122.02,
      high: 122.24,
      low: 120.55,
      close: 120.9,
      volume: 3446452,
    },
    {
      date: "2023-05-12",
      open: 121.41,
      high: 122.86,
      low: 121.11,
      close: 122.84,
      volume: 4564825,
    },
    {
      date: "2023-05-15",
      open: 123,
      high: 123.69,
      low: 122.34,
      close: 123.36,
      volume: 2915725,
    },
    {
      date: "2023-05-16",
      open: 123.35,
      high: 123.86,
      low: 122.45,
      close: 123.46,
      volume: 2749125,
    },
    {
      date: "2023-05-17",
      open: 123.94,
      high: 125.85,
      low: 123.47,
      close: 125.71,
      volume: 4515134,
    },
    {
      date: "2023-05-18",
      open: 125.3,
      high: 126.51,
      low: 125.19,
      close: 126.15,
      volume: 3797883,
    },
    {
      date: "2023-05-19",
      open: 126.79,
      high: 128.29,
      low: 126.55,
      close: 127.26,
      volume: 4306657,
    },
    {
      date: "2023-05-22",
      open: 127.5,
      high: 128.19,
      low: 127.15,
      close: 127.5,
      volume: 2806770,
    },
    {
      date: "2023-05-23",
      open: 127.24,
      high: 129.09,
      low: 127.13,
      close: 128.18,
      volume: 4592280,
    },
    {
      date: "2023-05-24",
      open: 127.82,
      high: 127.9,
      low: 125.47,
      close: 125.68,
      volume: 3915505,
    },
    {
      date: "2023-05-25",
      open: 125.61,
      high: 127.23,
      low: 125.01,
      close: 126.76,
      volume: 4102854,
    },
    {
      date: "2023-05-26",
      open: 127.06,
      high: 129.66,
      low: 126.81,
      close: 128.89,
      volume: 5612570,
    },
  ];

  drawMAChart("chart-demo", historicalData, {
    width: 600,
    height: 400,
    strokeColor: "green",
    period: 20,
    padding: 60,
    stepOnYAxis: 6,
  });
});
