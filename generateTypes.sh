#!/ bin/sh

background_path=$1
current_path=$(cd $(dirname $0); pwd)

if [ -z "$background_path" ]; then
  echo "Sicfler-backendまでのpathが入力されていません。"
  exit 1
fi

cd $background_path

npm run gen-types:client

mv -f ./client/gen $current_path/src

rm -rf ./client

exit 0
