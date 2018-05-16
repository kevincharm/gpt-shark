.PHONY: inspect build

inspect:
	node inspect $$(which parcel) src/manifest.json --target=web-extension --out-dir=build --no-cache

build:
	parcel build src/manifest.json --target=web-extension --out-dir=build --no-cache
