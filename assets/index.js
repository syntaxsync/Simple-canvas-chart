const calculateMovingAverage = (data, period) => {
  const ma = [];

  for (let i = 0; i < data.length; i++) {
    if (i >= period) {
      const sum = data.slice(i - period, i).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
  }

  return ma;
};

const drawMAChart = (
  id,
  data,
  labels,
  options = {
    width: 600,
    height: 400,
    strokeColor: "green",
    period: 20,
  }
) => {
  const {
    width: canvas_width,
    height: canvas_height,
    strokeColor,
    period,
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

  const padding = 60;
  const chart_width = canvas_width - padding * 2;
  const chart_height = canvas_height - padding * 2;

  // calculating moving average

  const values = calculateMovingAverage(data, period);
  const names = labels.slice(period);

  // calculating max and min values

  const max = Math.ceil(Math.max(...values));
  const min = Math.floor(Math.min(...values));

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
    "IBM, 2023-04-15 to 2023-05-31",
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

  const stepX = chart_width / (values.length - 1);

  for (let i = 0; i < values.length; i++) {
    ctx.moveTo(padding + i * stepX, padding);
    ctx.lineTo(padding + i * stepX, padding + chart_height);
  }

  ctx.stroke();

  // drawing names for y axis with markers on the left
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";

  for (let i = 0; i <= 5; i++) {
    ctx.fillText(
      (max - (max - min) * (i / 5)).toFixed(1),
      30,
      padding + i * stepY
    );
  }

  // drawing names for x axis rotated 45 degrees
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let i = 0; i < names.length; i++) {
    const x = stepX * i;
    ctx.save();
    ctx.translate(x + padding, canvas_height - padding + 5);
    ctx.rotate(Math.PI / 4);
    ctx.fillText(names[i], 0, 0);
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
    const y = e.clientY - rect.top;

    const stepX = chart_width / (values.length - 1);

    const index = Math.floor((x - padding) / stepX);
    const value = values[index];

    if (value) {
      toolkit.style.display = "block";
      toolkit.style.left = e.pageX + 10 + "px";
      toolkit.style.top = e.pageY + 10 + "px";
      toolkit.innerHTML = `<div>Date: ${
        names[index]
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
  const historicalData = await fetch("./assets/data.json").then((res) =>
    res.json()
  );

  const movingAverage = historicalData.map((d) => d.close);
  const labels = historicalData.map((d) => d.date.split("T")[0]);

  drawMAChart("chart-demo", movingAverage, labels, {
    width: 600,
    height: 400,
    strokeColor: "green",
    period: 20,
  });
});
