const r6Info = require('r6-info.js');

async function main() {

    try {

      const maps = await r6Info.getMaps({ name: 'Bank' });
      console.log('Maps:', maps);

      const service = await r6Info.getServiceStatus();
      console.log('Service:', service);

    const rankedStats = await r6Info.getStats({
      type: 'stats',
      email: 'hallubobine22@gmail.com',
      password: 'Allahmerda99.',
      nameOnPlatform: 'maz.-',
      platformType: 'uplay',
      platform_families: 'pc'
    });
    
    return rankedStats;
  
  } catch (error) {
    console.error('Errore durante le richieste:', error.message);
  }
}

main();
