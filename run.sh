docker run -d \ 
--name es-master \
-p 9200:9200 \
-p 9300:9300 \ 
-v /es/data:/usr/share/elasticsearch/data \ 
-v /es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \ 
-v /es/log:/usr/share/elasticsearch/log \ 
elasticsearch:5.6.9

docker run -d --name es-master -p 9200:9200 -p 9300:9300 -v /es/data:/usr/share/elasticsearch/data -v /es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /es/logs:/usr/share/elasticsearch/logs elasticsearch:5.6.9

docker run -d --name es-master -p 9200:9200 -p 9300:9300 elasticsearch:5.6.9


docker rm -f $(docker ps -qa)
docker run -d --name es-master -p 9200:9200 -p 9300:9300 -v /es/data:/usr/share/elasticsearch/data -v /es/logs:/usr/share/elasticsearch/logs -v /es/config:/usr/share/elasticsearch/config elasticsearch:5.6.9

download:
kibana
wget https://artifacts.elastic.co/downloads/kibana/kibana-5.5.1-darwin-x86_64.tar.gz