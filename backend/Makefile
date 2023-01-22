.PHONY: build load deploy all

WORKING_DIR = $(dir $(lastword $(MAKEFILE_LIST)))

build:
	cd $(WORKING_DIR); podman build -t lpmau-api .

load:
	rm -f /tmp/lpmau-api.tar
	podman save lpmau-api -o /tmp/lpmau-api.tar
	minikube image load /tmp/lpmau-api.tar

deploy:
	cd $(WORKING_DIR); kubectl apply -f deployment.yaml

all: build load deploy
