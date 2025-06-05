const r6Info = require('r6-info.js');

async function main() {

  try {

    await r6Info.generateDashboard({
      email: 'youremail',
      password: 'yourpassword',
      nameOnPlatform: 'player',
      platformType: 'uplay',
      outputPath: './my-dashboard.html',
      theme: 'dark',
      includeCharts: true,
      includeOperatorStats: true,
      includeMapStats: true
    });

  } catch (error) {
    console.error('Errore durante le richieste:', error.message);
  }
}

main();
