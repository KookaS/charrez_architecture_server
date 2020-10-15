import {serverInit} from "@server/server";

const shell = require('shelljs');
shell.exec('./reset-port.sh');
serverInit();
