from node:10

RUN apt-get update && apt-get install -y \
    python3-pip && \
    mkdir /opt/divenact

COPY . /opt/divenact/service
WORKDIR /opt/divenact/service


