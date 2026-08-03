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
DOCKER_PORT             ?= 4200
EVS_API_PORT            ?= 8082
DOCKER_EVS_API_HOST     ?= host.docker.internal
DOCKER_EVS_API_BASE_PATH ?= http://$(DOCKER_EVS_API_HOST):$(EVS_API_PORT)
WEB_WAR                 := web/build/libs/evsexplore-$(DOCKER_TAG).RELEASE.war
WEB_SOURCE_FILES        := $(shell git ls-files web) $(shell git ls-files --cached --others --exclude-standard web/src/main/resources/static)
DOCKER_IMAGE_STAMP      := web/build/docker-image.stamp

ifeq ($(OS),Windows_NT)
DOCKER                  ?= docker.exe
WEB_GRADLEW             := ./gradlew.bat
else
DOCKER                  ?= docker
WEB_GRADLEW             := ./gradlew
endif

.PHONY: build docker scandocker rundocker

# consider also "docker save..." and "docker load..." to avoid registry.
clean:
	cd web; $(WEB_GRADLEW) clean

# Build the library without tests.
build: $(WEB_WAR)

# Build the WAR only when its source or packaged static assets have changed.
$(WEB_WAR): $(WEB_SOURCE_FILES)
	cd web; $(WEB_GRADLEW) build -x test

# build the frontend
frontend:
	/bin/rm -rf web/src/main/resources/static/*
	cd frontend; ./gradlew build

test: 
	cd frontend; npm run test

# Run
run:
	cd frontend; npm start

# Build the image only when the packaged WAR or Docker build files have changed.
docker: $(DOCKER_IMAGE_STAMP)
	@$(DOCKER) image inspect "$(DOCKER_IMAGE)" > /dev/null 2>&1 || { rm -f "$(DOCKER_IMAGE_STAMP)"; $(MAKE) "$(DOCKER_IMAGE_STAMP)"; }

$(DOCKER_IMAGE_STAMP): $(WEB_WAR) web/Dockerfile web/.dockerignore
	$(DOCKER) build --file web/Dockerfile --tag "$(DOCKER_IMAGE)" web
	@mkdir -p $(dir $@)
	@touch $@

# Report HIGH and CRITICAL image vulnerabilities and write the complete HTML report.
scandocker: docker
	trivy image "$(DOCKER_IMAGE)" --scanners vuln --severity HIGH,CRITICAL --format table
	trivy image "$(DOCKER_IMAGE)" --scanners vuln --format template -o report-docker.html --template "@config/trivy/html.tpl"

# Run against EVSRESTAPI exposed on the Docker host. EVSRESTAPI, Jena, and OpenSearch must be running.
rundocker: docker
	$(DOCKER) run --rm --name "$(SERVICE)" -p "$(DOCKER_PORT):4200" \
		-e NCI_EVSEXPLORE_SERVER_PORT=4200 \
		-e EVS_API_BASE_PATH="$(DOCKER_EVS_API_BASE_PATH)" \
		-e UI_LICENSE \
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
