export default class SwaggerConf {
    static options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Hiki',
            version: '1.4.5',
          },
        },
        apis: ['./controllers/*.ts'], // files containing annotations as above
      }
}