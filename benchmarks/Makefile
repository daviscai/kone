all: battle

helloworld:
	@./bench_helloworld/run 5 node
	@./bench_helloworld/run 5 kwan
	@./bench_helloworld/run 5 toa
	@./bench_helloworld/run 5 trek
	@./bench_helloworld/run 5 koa
	@./bench_helloworld/run 5 express

middleware:
	@./dist/bench_middleware/run 1 kwan
	@./dist/bench_middleware/run 1 koa

.PHONY: all trek koa toa express battle
