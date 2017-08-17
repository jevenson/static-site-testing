const Metalsmith  = require('metalsmith'),
      layout      = require('metalsmith-layouts'),
      markdown    = require('metalsmith-markdown'),
      sass        = require('metalsmith-sass'),
      permalinks  = require('metalsmith-permalinks')
      browsersync = require('metalsmith-browser-sync'),
      args        = require('command-line-args');

const optionsDefinitions = [
  { name: 'serve', alias: 's', type: Boolean }
];

const options = args(optionsDefinitions);

const metalsmithPipeline = Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(markdown())
  .use(sass({
    outputDir: 'css'
  }))
  .use(permalinks())
  .use(layout({
    engine: 'handlebars',
    partials: 'partials'
  }));

if (options.serve) {
  metalsmithPipeline
    .use(browsersync({
      server: 'build',
      files: [
        'src/**/*.md',
        'layouts/**/*.hbs',
        'partials/**/*.hbs'
      ]
    }));
}

metalsmithPipeline
  .build(function(err, files) {
    if (err) { throw err; }
  });