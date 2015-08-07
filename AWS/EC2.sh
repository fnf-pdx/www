yum install nodejs npm --enablerepo=epel -y
yum install git -y

npm install -g bower nodemon

mkdir /var/fnf
chown ec2-user:ec2-user /var/fnf