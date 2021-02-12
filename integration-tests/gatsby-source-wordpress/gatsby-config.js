require(`dotenv`).config({
  path: `.env.test`,
})

console.log(`Sourcing data from ` + process.env.WPGRAPHQL_URL)

// this is it's own conditional object so we can run
// an int test with all default plugin options
const wpPluginOptions = !process.env.DEFAULT_PLUGIN_OPTIONS
  ? {
      excludeFieldNames: [`commentCount`],
      debug: {
        graphql: {
          writeQueriesToDisk: true,
        },
      },
      type: {
        TypeLimitTest: {
          limit: 1,
        },
        TypeLimit0Test: {
          limit: 0,
        },
        Comment: {
          excludeFieldNames: [`databaseId`],
        },
        Page: {
          excludeFieldNames: [`enclosure`],
        },
        DatabaseIdentifier: {
          exclude: true,
        },
        User: {
          excludeFieldNames: [
            `extraCapabilities`,
            `capKey`,
            `email`,
            `registeredDate`,
          ],
        },
        Post: {
          limit:
            process.env.NODE_ENV === `development`
              ? // Lets just pull 50 posts in development to make it easy on ourselves.
                50
              : // and we don't actually need more than 1000 in production
                1000,
        },
      },
    }
  : {}

module.exports = {
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: process.env.WPGRAPHQL_URL,
        auth: {
          htaccess: {
            username: process.env.HTACCESS_USERNAME,
            password: process.env.HTACCESS_PASSWORD,
          },
        },
        ...wpPluginOptions,
      },
    },
  ],
}
