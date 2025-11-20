import {GoogleCharts} from 'google-charts';

const GOODS = ['Steel', 'Copper', 'Plastics', 'Textiles'];
const PRICE_POINTS = 8;
const BASE_PRICES = {
    Steel: 110,
    Copper: 95,
    Plastics: 60,
    Textiles: 45
};

GoogleCharts.load(drawChart, {packages: ['corechart']});

function generatePrice(previousPrice) {
    const swing = (Math.random() - 0.5) * 12;
    return Math.max(5, parseFloat((previousPrice + swing).toFixed(2)));
}

function buildPriceRows() {
    const rows = [];
    const now = Date.now();
    const currentPrices = {...BASE_PRICES};

    for (let offset = PRICE_POINTS - 1; offset >= 0; offset -= 1) {
        const timestamp = new Date(now - offset * 3_600_000);
        const row = [timestamp];
        GOODS.forEach((good) => {
            currentPrices[good] = generatePrice(currentPrices[good]);
            row.push(currentPrices[good]);
        });
        rows.push(row);
    }
    return rows;
}

export function drawChart() {
    const dataTable = new GoogleCharts.api.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    GOODS.forEach((good) => dataTable.addColumn('number', good));
    dataTable.addRows(buildPriceRows());

    const options = {
        title: 'Random Goods Pricing',
        curveType: 'function',
        legend: {position: 'bottom'},
        hAxis: {title: 'Timestamp', format: 'HH:mm'},
        vAxis: {title: 'Price (USD)'},
        focusTarget: 'category',
        height: 360
    };

    const chartContainer = document.getElementById('chart1');
    if (!chartContainer) {
        return;
    }
    const lineChart = new GoogleCharts.api.visualization.LineChart(chartContainer);
    lineChart.draw(dataTable, options);
}