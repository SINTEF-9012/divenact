from node:10

RUN apt-get update && apt-get install -y \
    python3-pip && \
    mkdir /opt/divenact

COPY . /opt/divenact/service
WORKDIR /opt/divenact/service

RUN pip3 install \
        --trusted-host pypi.python.org \
        --trusted-host files.pythonhosted.org \
        --trusted-host pypi.org \
        -r public/requirements.txt && \
    npm install && \
    cd client && \
    npm install

ENTRYPOINT ["/bin/python3", "start.py"]
CMD ["--connection=''", "--no-db"]
