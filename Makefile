# global service name
SERVICE                 := evsexplore

#######################################################################
#                 OVERRIDE THIS TO MATCH YOUR PROJECT                 #
#######################################################################
APP_VERSION             := $(shell echo `grep "^version =" web/build.gradle | sed 's/version = //'`)
VERSION                 := $(shell echo `grep "^version =" web/build.gradle | sed 's/version = //; s/.RELEASE//'`)

# Builds should be repeatable, therefore we need a method to reference the git
# sha where a version came from.
GIT_VERSION          	?= $(shell echo `git describe --match=NeVeRmAtCh --always --dirty`)
GIT_COMMIT          	?= $(shell echo `git log | grep -m1 -oE '[^ ]+$'`)
GIT_COMMITTED_AT        ?= $(shell echo `git log -1 --format=%ct`)
GIT_BRANCH				?=
FULL_VERSION            := v$(APP_VERSION)-g$(GIT_VERSION)
DOCKER_TAG              := $(shell grep "^version =" web/build.gradle | sed 's/version = //; s/"//g; s/.RELEASE//')
DOCKER_IMAGE            ?= $(SERVICE):$(DOCKER_TAG)

ifeq ($(OS),Windows_NT)
DOCKER                  ?= docker.exe
WEB_GRADLEW             := ./gradlew.bat
else
DOCKER                  ?= docker
WEB_GRADLEW             := ./gradlew
endif

DOCKER_IMG              := $(shell $(DOCKER) image inspect "$(DOCKER_IMAGE)" --format "{{.Id}}" 2>/dev/null)

.PHONY: build docker dockerpush scandocker rundocker

# consider also "docker save..." and "docker load..." to avoid registry.
clean:
	cd web; $(WEB_GRADLEW) clean

# Build the library without tests.
build:
	cd web; $(WEB_GRADLEW) clean build -x test

# build the frontend
frontend:
	/bin/rm -rf web/src/main/resources/static/*
	cd frontend; ./gradlew build

test: 
	cd frontend; npm run test

# Run
run:
	cd frontend; npm start

# Build a Linux deployment image from source inside Docker.
docker:

# Remove prior docker image if it is built
ifdef DOCKER_IMG
	$(DOCKER) rmi -f $(DOCKER_IMG)
else
	@echo No docker image to remove
endif
	$(DOCKER) build --platform linux/amd64 --no-cache-filter=web-build --file web/Dockerfile --tag "$(DOCKER_IMAGE)" .

# Build and push a Linux/AMD64 image. Override DOCKER_IMAGE with a registry-qualified image name.
dockerpush:
	$(DOCKER) push --platform linux/amd64 "$(DOCKER_IMAGE)"

# Report all HIGH and CRITICAL image vulnerabilities with their installed and fixed versions.
# The complete HTML report is written to report.html.
scandocker:
	$(DOCKER) save -o scan.tar $(DOCKER_IMAGE)
	trivy image --input scan.tar $(DOCKER_IMAGE) --format template -o report.html --template "@config/trivy/html.tpl"
	egrep "CRITICAL|HIGH" report.html
	/bin/rm -f scan.tar

# Run against EVSRESTAPI exposed on the Docker host. EVSRESTAPI, Jena, and OpenSearch must be running.
rundocker:
	$(DOCKER) run --rm --name "$(SERVICE)" -p "4200:4200" \
		-e NCI_EVSEXPLORE_SERVER_PORT=4200 \
		-e EVS_API_BASE_PATH="http://host.docker.internal:8082" \
		"$(DOCKER_IMAGE)"

releasetag:
	git tag -a "${VERSION}-RC-`/bin/date +%Y-%m-%d`" -m "Release ${VERSION}-RC-`/bin/date +%Y-%m-%d`"
	git push origin "${VERSION}-RC-`/bin/date +%Y-%m-%d`"

rmreleasetag:
	git tag -d "${VERSION}-RC-`/bin/date +%Y-%m-%d`"
	git push origin --delete "${VERSION}-RC-`/bin/date +%Y-%m-%d`"

tag: frontend
	@git diff --quiet HEAD -- || { echo "verify no repository changes on frontend build, commit changes from make frontend before running make tag"; exit 1; }
	git tag -a "v`/bin/date +%Y-%m-%d`-${APP_VERSION}" -m "Release `/bin/date +%Y-%m-%d`"
	git push origin "v`/bin/date +%Y-%m-%d`-${APP_VERSION}"

rmtag:
	git tag -d "v`/bin/date +%Y-%m-%d`-${APP_VERSION}"
	git push origin --delete "v`/bin/date +%Y-%m-%d`-${APP_VERSION}"

version:
	@echo $(APP_VERSION)

scan:
	trivy fs frontend/package-lock.json --format template -o report.html --template "@config/trivy/html.tpl"
	grep CRITICAL report.html
	cd web; ./gradlew dependencies --write-locks
	trivy fs web/gradle.lockfile --format template -o reportJava.html --template "@config/trivy/html.tpl"
	grep CRITICAL reportJava.html
	/bin/rm -rf web/gradle.lockfile
	

.PHONY: frontend
