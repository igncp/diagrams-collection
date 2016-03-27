build:
	@grunt build

build-prod:
	@grunt build-prod

lint: lint-jscs lint-eslint
	@echo "All lints passing"

lint-jscs:
	@./node_modules/.bin/jscs -c .jscsrc src/js/

lint-eslint:
	@./node_modules/.bin/eslint -c .eslintrc src/js/  --ext .js,.jsx

watch:
	@npm run watch

test: lint
	@npm test

copy-githooks:
	cp scripts/githooks/pre-* .git/hooks/