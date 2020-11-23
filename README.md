# Information Security Project - UGent 

This repo contains the project of the Information Security course of Ghent University. The scope of the project is to create a web application that safely logs a close contact between users and informs them if anybody that has recently contacted with is positive to COVID-19.

More info at the documentation folder [**here**](documentation/README.md)


## Quick Steps:
1. Open Terminal at backend folder and execute: 
`npm run start`
2. Open Terminal at database folder and execute:
`sudo ./docker_create.sh`
`sudo ./docker_start.sh`
`./populate_db.sh` 
3. Open Terminal at frontend folder and execute: 
`npm run serve`
4. Open browser at local port indicated:

## Work Distribution
- Chaikalis Marinos: database + API
- Chelakis Konstantinos Marios: frontend + database + simulation 
- Pitoskas Giannis: backend + frontend + simulation

## Remarks
1. If any problem occurs when executing the steps above read the readme file at each folder for more instructions
2. Some txt files are being downloaded for simulation reasons when clicking the button which were used for simulation and log reasons
3. Sometimes you should double click the check button depending on the backend current state

