# Database

```sudo ./docker_create.sh```  
This will start a docker image containing a postgres database.

```sudo ./docker_start.sh```  
Will restart existing container, for example after restarting your system.

```./populate_db.sh```  
This will populate the database with tables defined in ```/scripts```. Node and yarn are required for this to work.