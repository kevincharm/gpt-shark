.PHONY: inspect build

serve:
	parcel src/manifest.json --web-extension --out-dir=build --no-cache

inspect:
	node inspect $$(which parcel) src/manifest.json --target=web-extension --out-dir=build --no-cache

build:
	PARCEL_WORKERS=0 parcel build src/manifest.json --out-dir=build --no-cache --no-minify
