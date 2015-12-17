prod:
	@grunt uglify

lint: lint-jscs lint-eslint

lint-jscs:
	@./node_modules/.bin/jscs -c .jscsrc src/js/

lint-eslint:
	@./node_modules/.bin/eslint -c .eslintrc src/js/  --ext .js,.jsx

test:
	@npm test

watch:
	@grunt
