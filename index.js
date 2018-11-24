const path = require("path");
const fs = require("fs-extra");
const yargs = require("yargs");

const Mustache = require("mustache");
const Listr = require("listr");
const prompts = require("prompts");

const argv = yargs
  .version("1.0.0")
  .strict()
  .command("$0 <app-name...>", "Create node cli app with typescript", yargs => {
    return yargs
      .option("quite", { desc: "Remove all log" })
      .option("--space-replace", { default: "-" })
      .option("current", { desc: "Create application to current folder" })
      .positional("app-name", { desc: "Application name, can be capital, and space name" });
  }).argv;

const fixture = "fixtures";

const name = argv.appName.join(" ");
const filename = name.replace(" ", argv.spaceReplace).toLowerCase();

const filepath = argv.current ? "." : path.join(".", filename);

(async () => {
  const progress = new Listr();

  progress.add({
    title: `Creating folder at ${filepath}`,
    task: async () => {
      await fs.copy(fixture, filepath);
    }
  });

  progress.add({
    title: "Compiling Package json",
    task: async ctx => {
      const pjson = path.join(filepath, "package.json");
      if (!ctx.content) ctx.content = {};
      if (!ctx.path) ctx.path = {};

      const content = await fs.readFile(pjson);
      ctx.path.pjson = pjson;
      ctx.content.pjson = content.toString();
    }
  });

  progress.add({
    title: "Compiling Webpack",
    task: async ctx => {
      const webpack = path.join(filepath, "webpack.config.js");
      if (!ctx.content) ctx.content = {};
      if (!ctx.path) ctx.path = {};

      const content = await fs.readFile(webpack);
      ctx.path.webpack = webpack;
      ctx.content.webpack = content.toString();
    }
  });

  const context = await progress.run();

  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Application name",
      initial: filename
    },
    {
      type: "text",
      name: "version",
      message: "Application version",
      initial: "1.0.0"
    },
    {
      type: "text",
      name: "description",
      message: "Application description"
    },
    {
      type: "text",
      name: "filename",
      message: "Application caches file name",
      initial: filename
    },
    {
      type: "text",
      name: "repository_url",
      message: "Repository url",
      initial: ""
    },
    {
      type: "text",
      name: "author_name",
      message: "Author name"
    },
    {
      type: "text",
      name: "author_surname",
      message: "Author surname"
    },
    {
      type: "text",
      name: "author_email",
      message: "Author email"
    },
    {
      type: "text",
      name: "deployment_name",
      message: "Deployment file name"
    }
  ]);

  const data = {
    name: response.name,
    version: response.version,
    description: response.description,
    filename: response.filename,
    repository_url: response.repository_url,
    author: {
      name: response.author_name,
      surname: response.author_surname,
      email: response.author_email
    },
    deployment: {
      name: response.deployment_name
    }
  };

  // const finalPjson = Mustache.render(ctx.content.pjson, ctx.data);
  // console.log(finalPjson.toString());

  // const finalWebpack = Mustache.render(ctx.content.webpack, ctx.data);
  // console.log(finalWebpack.toString());

  const progress2 = new Listr();

  progress2.add({
    title: "Update package.json file",
    task: ctx => {
      const finalPjson = Mustache.render(ctx.content.pjson, ctx.data);
      return fs.outputFile(ctx.path.pjson, finalPjson);
    }
  });

  progress2.add({
    title: "Update webpack.config.js file",
    task: ctx => {
      const finalWebpack = Mustache.render(ctx.content.webpack, ctx.data);
      return fs.outputFile(ctx.path.webpack, finalWebpack);
    }
  });

  context.data = data;
  progress2.run(context);
})();
