function generateChartScript(stats) {
  return `
    // K/D Comparison Chart
    const kdCtx = document.getElementById('kdChart').getContext('2d');
    new Chart(kdCtx, {
        type: 'bar',
        data: {
            labels: ['Ranked K/D', 'Casual K/D'],
            datasets: [{
                label: 'K/D Ratio',
                data: [${stats.calculated.rankedKD || 0}, ${stats.calculated.casualKD || 0}],
                backgroundColor: ['#ffd700', '#ff6b6b'],
                borderColor: ['#ffed4e', '#ff8e8e'],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#374151' },
                    ticks: { color: '#e4e4e7' }
                },
                x: {
                    grid: { color: '#374151' },
                    ticks: { color: '#e4e4e7' }
                }
            }
        }
    });

    // Win Rate Chart
    const winRateCtx = document.getElementById('winRateChart').getContext('2d');
    new Chart(winRateCtx, {
        type: 'doughnut',
        data: {
            labels: ['Ranked Win Rate', 'Ranked Loss Rate'],
            datasets: [{
                data: [${stats.calculated.rankedWinRate || 0}, ${100 - (stats.calculated.rankedWinRate || 0)}],
                backgroundColor: ['#ffd700', '#374151'],
                borderColor: ['#ffed4e', '#4b5563'],
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e4e4e7' }
                }
            }
        }
    });

    // Match Outcomes Chart
    const matchCtx = document.getElementById('matchChart').getContext('2d');
    new Chart(matchCtx, {
        type: 'line',
        data: {
            labels: ['Ranked', 'Casual'],
            datasets: [
                {
                    label: 'Wins',
                    data: [${stats.ranked.wins || 0}, ${stats.casual.wins || 0}],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Losses',
                    data: [${stats.ranked.losses || 0}, ${stats.casual.losses || 0}],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e4e4e7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#374151' },
                    ticks: { color: '#e4e4e7' }
                },
                x: {
                    grid: { color: '#374151' },
                    ticks: { color: '#e4e4e7' }
                }
            }
        }
    });
  `;
}

module.exports = { generateChartScript };