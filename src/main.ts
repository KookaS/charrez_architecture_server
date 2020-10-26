import {serverInit} from "@server/server";

require('shelljs').exec('./reset-port.sh');
serverInit();
