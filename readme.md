install https

Step 1
Install mkcert (only once).

brew install mkcert
brew install nss # if you use Firefox


Step 2

mkcert -install

Step 3
переходим в папку где будет хранить ключи ssh, в нашем случае ./cert
выполняем mkcert {hostname}
например mkcert app.optstarter.local

Step 4
переходим в .env и заполняем нашими данными
пример:
CERT_FILENAME=app.optstarter.local.pem
CERT_KEY_FILENAME=app.optstarter.local-key.pem

Step 5
заполняем NODE_EXTRA_CA_CERTS значением из путя
