const os = require('os');
const proc = require('child_process');

if (os.platform() == 'darwin'){   // OS X
  proc.execFileSync('./src/zipit.sh');
}else{                            // Windows
  proc.execFileSync('.\\src\\zipit.bat');
}