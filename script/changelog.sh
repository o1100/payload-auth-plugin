#!/usr/bin/env bash

PACKAGE_VERSION=$(node -p -e "require('../package.json').version")
bun x git-cliff -o '../CHANGELOG.md' --tag $PACKAGE_VERSION