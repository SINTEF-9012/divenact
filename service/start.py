import sys, getopt, yaml, os

argvs = sys.argv[1:]

short_options = "h"
long_options = ["help", "connection=", "database=", "no-db"]

try:
    arguments, values = getopt.getopt(argvs, short_options, long_options)
    arg_dict = dict(arguments)

    connection_string = ""
    if "--connection" in arg_dict:
        connection_string = arg_dict["--connection"]

    cred = {"iothub": {"connection": connection_string}}
    stream = open("../azureiot.credential", "w")
    yaml.dump(cred, stream)
    stream.close()

    if "--no-db" in arg_dict:
        os.system("cp .env-mockupdb .env")
    os.system("npm start")



except getopt.error as err:
    # Output error, and return with an error code
    print(str(err))
    sys.exit(2)



