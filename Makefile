install:
	npm install
	bower install

update:
	npm prune && npm update
	bower prune && bower update

clean:
	rm -rf node_modules
	rm -rf public/uploads/*
	rm -rf public/bower_components
	rm -rf tmp/*
