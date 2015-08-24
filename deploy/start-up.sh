yum install git -y

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash

npm install -g pm2 bower

mkdir /var/fnf
chown ec2-user:ec2-user /var/fnf