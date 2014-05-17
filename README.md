welean2-share
=============
What if we can share with friends without click pictures, videos... Yes no click, just a drag and drop! No sign in! Even easier than wetransfer!

Installation
------------


Deployment
----------
    ssh share@picanoo.com
    share@share:~$ cd ~/site/www
    share@share:~/site/www$ git pull
    share@share:~/site/www$ make update
    share@share:~/site/www$ ps -ef | grep nodejs
    share@share:~/site/www$ kill pid (gotten from ps)
    share@share:~/site/www$ nohup nodejs src/server/server.js > /home/share/site/logs/output.log &

