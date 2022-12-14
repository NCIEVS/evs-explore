# global service name
SERVICE                 := evsexplore

#######################################################################
#                 OVERRIDE THIS TO MATCH YOUR PROJECT                 #
#######################################################################
APP_VERSION             := $(shell echo `grep "^version =" web/build.gradle | sed 's/version = //'`)

# Builds should be repeatable, therefore we need a method to reference the git
# sha where a version came from.
GIT_VERSION          	?= $(shell echo `git describe --match=NeVeRmAtCh --always --dirty`)
GIT_COMMIT          	?= $(shell echo `git log | grep -m1 -oE '[^ ]+$'`)
GIT_COMMITTED_AT        ?= $(shell echo `git log -1 --format=%ct`)
GIT_BRANCH				?=
FULL_VERSION            := v$(APP_VERSION)-g$(GIT_VERSION)

.PHONY: build

# consider also "docker save..." and "docker load..." to avoid registry.
clean:
	cd web; ./gradlew clean

# Build the library without tests
build:
	cd web; ./gradlew clean build -x test

# Run
run:
	cd web/frontend; npm start

tag:
	git tag -a "v`/bin/date +%Y-%m-%d`-${APP_VERSION}.RELEASE" -m "Release `/bin/date +%Y-%m-%d`"
	git push origin "v`/bin/date +%Y-%m-%d`-${APP_VERSION}.RELEASE"

rmtag:
	git tag -d "v`/bin/date +%Y-%m-%d`-${APP_VERSION}.RELEASE"
	git push origin --delete "v`/bin/date +%Y-%m-%d`-${APP_VERSION}.RELEASE"

version:
	@echo $(APP_VERSION)
