const r6Info = require('r6-info.js');

async function main() {

    try {

      const maps = await r6Info.getMaps({ name: 'Bank' });
      console.log('Maps:', maps);

      const service = await r6Info.getServiceStatus();
      console.log('Service:', service);
  
  } catch (error) {
    console.error('Errore durante le richieste:', error.message);
  }
}

main();
