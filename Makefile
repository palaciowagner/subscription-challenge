.PHONY: unit-test subscription-%

comma:=,

start-dev:
	COMPOSE_HTTP_TIMEOUT=120 docker-compose up -d

unit-test:
	yarn run test

subscription-%:
	$(foreach unit-test,$(subst $(comma), ,$(@:subscription-%=%)),test/test$(test))
