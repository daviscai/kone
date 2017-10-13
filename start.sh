# dev 环境快速启动
THIS_DIR=$(dirname "$0")
pushd "$THIS_DIR"

npm run watch & npm run dev

popd
