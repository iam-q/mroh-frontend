docker-build-push:
	docker buildx build --platform linux/amd64,linux/arm64 -t iamqsoh/mroh-frontend:latest --push .