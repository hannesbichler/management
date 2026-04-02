# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

# install package

Change into runtime folder:

```cd C:/Salzer```

clone repo into folder:

```git clone https://github.com/hannesbichler/Eudr_NG.git```

after cloning change into folder Eudr_NG:

```cd Eudr_NG```

install node modules automatically

```npm install```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

build the application 


run with https:

option one
1. install the local CA in the system trust store
`mkcert -install`

2. create the cert and the key
`mkcert eudr`

attention: the created certificate is only valid for 2 years

option two
letsencrypt certificate
download Win-ACME
https://www.win-acme.com

run powershell as admin
cd into win-acme folder
call .\wacs.exe

- Create certificate (full options)
- Manual input
- Domain input: salzer.bichler.tech
- Friendly name '[Manual] salzer.bichler.tech'. <Enter> to accept or type desired name: eudr
Single certificate
[http] Serve verification files from memory
RSA key
PEM encoded files (Apache, nginx, etc.)
File path: C:\Salzer
None
No (additional) store steps
No (additional) installation steps
Quit

rename certificates in C:\Salzer to eudr.pem and eudr-key.pem and store it to C:\Salzer\Eudr_NG and C:\Salzer\Eudr

certificates are stored in 
C:\ProgramData\win-acme\acme-v02.api.letsencrypt.org\...

# run app in development
```ng serve --ssl --port 443 --open --proxy-config proxy.conf.json```

# build the app:
this build the system in dist/eudr-app for use in production

```ng build --configuration production```

or use

```compile.bat (Windows only)```

# run app:
in command line

```npx http-server -p 443 -S -C eudr.pem -K eudr-key.pem -c-1 .\dist\eudr-app\browser\ --cors```

or use

```startEudr.bat (Windows only)```
