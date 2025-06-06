.PHONY: build-standalone copy-standalone dev-docusaurus build clean

build-packages:
	pnpm build:packages

# Build standalone API reference
build-standalone:
	pnpm --filter "@scalar/api-reference" build:standalone

# Copy standalone.js to docusaurus static folder
copy-standalone:
	mkdir -p examples/docusaurus/static/scalar/
	cp packages/api-reference/dist/browser/standalone.js examples/docusaurus/static/scalar/

# Start docusaurus development server
dev-docusaurus:
	cd examples/docusaurus && pnpm run dev

# Complete deployment process: build -> copy -> dev
build: build-packages build-standalone copy-standalone dev-docusaurus

# Clean build artifacts
clean:
	rm -rf packages/api-reference/dist/
	rm -rf examples/docusaurus/static/scalar/

# Help target
help:
	@echo "Available targets:"
	@echo "  build-packages     - Build all packages"
	@echo "  build-standalone   - Build the standalone API reference"
	@echo "  copy-standalone    - Copy standalone.js to docusaurus static folder"
	@echo "  dev-docusaurus     - Start docusaurus development server"
	@echo "  build  - Complete deployment (build + copy + dev)"
	@echo "  clean              - Clean build artifacts"
	@echo "  help               - Show this help message"

