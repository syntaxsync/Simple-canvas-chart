const drawLineChart = (id, data, labels, options) => {
  const { width: canvas_width, height: canvas_height, strokeColor } = options;

  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const padding = 60;
  const chart_width = canvas_width - padding * 2;
  const chart_height = canvas_height - padding * 2;

  const max = Math.ceil(Math.max(...data));
  const min = Math.floor(Math.min(...data));

  // drawing chart title and subtitle
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("20 Days Moving Average(MA)", canvas_width / 2, padding / 2);

  ctx.font = "12px Arial";
  ctx.fillText(
    "IBM, 2023-05-15 to 2023-05-31",
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

  const stepY = chart_height / 5;

  for (let i = 0; i <= 5; i++) {
    ctx.moveTo(padding, padding + i * stepY);
    ctx.lineTo(padding + chart_width, padding + i * stepY);
  }

  ctx.stroke();

  // drawing reference lines for x axis
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  ctx.setLineDash([5, 5]);

  const stepX = chart_width / (data.length - 1);

  for (let i = 0; i < data.length; i++) {
    ctx.moveTo(padding + i * stepX, padding);
    ctx.lineTo(padding + i * stepX, padding + chart_height);
  }

  ctx.stroke();

  // drawing labels for y axis with markers on the left
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";

  for (let i = 0; i <= 5; i++) {
    ctx.fillText(
      Math.round(max - (max - min) * (i / 5)),
      30,
      padding + i * stepY
    );
  }

  // drawing labels for x axis rotated 45 degrees
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let i = 0; i < data.length; i++) {
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

  for (let i = 0; i < data.length; i++) {
    const x = stepX * i;
    const y = (chart_height * (max - data[i])) / (max - min);

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
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = [
    {
      date: "2023-05-15T16:00:00.000000Z",
      open: 123,
      high: 123.69,
      low: 122.34,
      close: 123.36,
      volume: 2915725,
    },
    {
      date: "2023-05-16T16:00:00.000000Z",
      open: 123.35,
      high: 123.86,
      low: 122.45,
      close: 123.46,
      volume: 2749125,
    },
    {
      date: "2023-05-17T16:00:00.000000Z",
      open: 123.94,
      high: 125.85,
      low: 123.47,
      close: 125.71,
      volume: 4515134,
    },
    {
      date: "2023-05-18T16:00:00.000000Z",
      open: 125.3,
      high: 126.51,
      low: 125.19,
      close: 126.15,
      volume: 3797883,
    },
    {
      date: "2023-05-19T16:00:00.000000Z",
      open: 126.79,
      high: 128.29,
      low: 126.55,
      close: 127.26,
      volume: 4306657,
    },
    {
      date: "2023-05-22T16:00:00.000000Z",
      open: 127.5,
      high: 128.19,
      low: 127.15,
      close: 127.5,
      volume: 2806770,
    },
    {
      date: "2023-05-23T16:00:00.000000Z",
      open: 127.24,
      high: 129.09,
      low: 127.13,
      close: 128.18,
      volume: 4592280,
    },
    {
      date: "2023-05-24T16:00:00.000000Z",
      open: 127.82,
      high: 127.9,
      low: 125.47,
      close: 125.68,
      volume: 3915505,
    },
    {
      date: "2023-05-25T16:00:00.000000Z",
      open: 125.61,
      high: 127.23,
      low: 125.01,
      close: 126.76,
      volume: 4102854,
    },
    {
      date: "2023-05-26T16:00:00.000000Z",
      open: 127.06,
      high: 129.66,
      low: 126.81,
      close: 128.89,
      volume: 5612570,
    },
  ];

  const movingAverage = data.map((d) => d.close);
  const labels = data.map((d) => d.date.split("T")[0]);

  drawLineChart("chart-demo", movingAverage, labels, {
    width: 600,
    height: 400,
    strokeColor: "green",
  });
});
