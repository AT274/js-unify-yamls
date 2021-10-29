#!/usr/bin/env node
import fs from "fs";
import jsYaml from "js-yaml";
import deepmerge from "deepmerge";
import { Command } from 'commander';

'use strict'

const program = new Command();

program.requiredOption('-t, --target <target directory>', 'target directory must be entered.')
       .requiredOption('-o --output <output name>', 'output name must be entered.')
       .parse(process.argv);

const options = program.opts();
let ret = {}

const pathStack = [options.target]
while (pathStack.length > 0) {
  const path = pathStack.pop();
  const dirents = fs.readdirSync(path, { withFileTypes: true });

  dirents.forEach((dirent) => {
    const newPath = `${path}/${dirent.name}`;
    if (dirent.isDirectory()) {
      pathStack.push(newPath);
    } else {
      const yamlText = fs.readFileSync(newPath, "utf8");
      const yamlObj = jsYaml.load(yamlText);
      ret = deepmerge(ret, yamlObj || {});
    }
  } );
}

const fileContent = `export default ${JSON.stringify(ret)}`;
fs.writeFileSync(options.output, fileContent);
